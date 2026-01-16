# 🔍 Audit pré-publication App Store & Google Play - Coworkers

**Date**: 16 janvier 2026  
**Version analysée**: 1.0.0  
**Stack**: React Native (Expo) + Supabase + React Query

---

## 📊 SCORE GLOBAL: 6/10

**Risque de rejet**:

-   **Apple App Store**: 🔴 **ÉLEVÉ** (permissions + sécurité)
-   **Google Play**: 🟡 **MOYEN** (RLS critique)

---

## 🚨 PROBLÈMES CRITIQUES (Bloquants)

### 1. 🔐 Sécurité - Clés API exposées

**Fichier**: `utils/supabase.ts`

❌ **PROBLÈME**:

```typescript
process.env.EXPO_PUBLIC_SUPABASE_URL!;
process.env.EXPO_PUBLIC_SUPABASE_KEY!;
```

Les clés préfixées `EXPO_PUBLIC_*` sont **incluses dans le bundle client** et accessibles par n'importe qui.

**RISQUE**: Accès direct à votre base de données Supabase

**✅ SOLUTION**:

-   Utiliser uniquement des clés **anon** (jamais service_role)
-   Activer RLS strict sur TOUTES les tables
-   Vérifier les politiques RLS en base

---

### 2. 🔐 Sécurité - Absence de validation ownership

**Fichiers concernés**:

#### `src/api/announcement/deleteAnnouncement.ts`

```typescript
const { error } = await supabase
    .from("participant_requests")
    .update({ status: "announce_deleted" })
    .eq("annonce_id", id);
```

❌ Vérifie la session mais **pas l'ownership** → Un utilisateur peut supprimer l'annonce d'un autre

#### `src/api/candidate/removeParticipant.ts`

```typescript
await supabase
    .from("conversation_participants")
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", participantId);
```

❌ Pas de vérification si l'utilisateur appelant est le propriétaire de l'annonce

**✅ SOLUTION**:
Configurer des politiques RLS strictes sur Supabase:

```sql
-- Exemple pour la table annonces
CREATE POLICY "Users can only delete their own announcements"
ON annonces FOR DELETE
USING (auth.uid() = user_id);

-- Pour participant_requests
CREATE POLICY "Only announcement owner can update status"
ON participant_requests FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM annonces
        WHERE annonces.id = participant_requests.annonce_id
        AND annonces.user_id = auth.uid()
    )
);
```

---

### 3. ⚡ Race Conditions & États incohérents

**Fichier**: `src/screens/notification/notificationScreen.tsx:73-84`

❌ **PROBLÈME**:

```typescript
try {
    // 1️⃣ Accepter la candidature
    await acceptRequest({ candidate_id, annonce_id: annonceId });

    // 2️⃣ Décrémenter les places
    await supabase.rpc("decrement_places", { annonce: annonceId });

    // 3️⃣ Ajouter le candidat à la conversation
    await addUserConversation(candidate_id, annonceId);

    Alert.alert("Succès", "Candidature acceptée");
} catch (e: any) {
    console.error("❌ ACCEPT ERROR:", e);
    Alert.alert("Erreur", JSON.stringify(e, null, 2));
}
```

**RISQUES**:

-   Si étape 3 échoue, les places sont déjà décrémentées
-   Risque de places négatives
-   État incohérent entre tables

**✅ SOLUTION**:
Créer une fonction RPC Supabase qui fait tout en transaction:

```sql
CREATE OR REPLACE FUNCTION accept_candidate(
    p_candidate_id UUID,
    p_annonce_id UUID
) RETURNS void AS $$
BEGIN
    -- Tout dans une transaction atomique
    UPDATE participant_requests
    SET status = 'accepted'
    WHERE user_id = p_candidate_id AND annonce_id = p_annonce_id;

    UPDATE annonces
    SET number_of_places = number_of_places - 1
    WHERE id = p_annonce_id AND number_of_places > 0;

    INSERT INTO conversation_participants (conversation_id, user_id)
    SELECT conversation_id, p_candidate_id
    FROM annonces
    WHERE id = p_annonce_id;
END;
$$ LANGUAGE plpgsql;
```

Puis côté client:

```typescript
await supabase.rpc("accept_candidate", {
    p_candidate_id: candidate_id,
    p_annonce_id: annonceId,
});
```

---

### 4. 🐛 Gestion d'erreurs insuffisante

**Fichier**: `src/components/ApplyButton.tsx:48`

❌ **PROBLÈME**:

```typescript
const onPress = async () => {
    if (!session) {
        /* ... */
    }
    if (isCancelAction) {
        /* ... */
    }
    await toggleApply(); // ⚠️ Pas de try/catch !
};
```

**IMPACT**: Si l'appel échoue, l'utilisateur ne voit rien → confusion

**✅ SOLUTION**:

```typescript
const onPress = async () => {
    if (!session) {
        /* ... */
    }
    if (isCancelAction) {
        setConfirmOpen(true);
        return;
    }

    try {
        await toggleApply();
        showToast("success", "Candidature envoyée");
    } catch (error) {
        showToast("error", "Une erreur est survenue");
    }
};
```

---

**Autres occurrences sans try/catch**:

-   `src/screens/profile/candidateProfile.tsx:22` - `loadApplications()`
-   `src/screens/chat/messengingScreen.tsx:111` - `onSend()`
-   `src/components/FavoriteButton.tsx:30` - `toggleFavorite()`

---

### 5. 🔊 Console.log en production

**30+ occurrences détectées** dans le projet:

```typescript
// src/screens/chat/messengingScreen.tsx:131
console.log("RAW DATA", messages);

// src/screens/notification/notificationScreen.tsx:66
console.log("onAccept", annonceId, candidate_id);

// src/contexts/notificationContext.tsx:29
console.log("[NotificationContext] userId:", userId);

// src/screens/profile/candidateProfile.tsx:40
console.log("Candidatures récupérées :", data);
```

**RISQUE**: Fuite d'informations sensibles (IDs utilisateurs, données personnelles)

**✅ SOLUTION**:

1. Créer un logger custom:

```typescript
// utils/logger.ts
const isDev = __DEV__;

export const logger = {
    log: (...args: any[]) => isDev && console.log(...args),
    error: (...args: any[]) => isDev && console.error(...args),
    warn: (...args: any[]) => isDev && console.warn(...args),
};
```

2. Remplacer tous les `console.log` par `logger.log`
3. Ou supprimer complètement en production avec Babel plugin

---

### 6. 📱 Permissions iOS mal décrites

**Fichier**: `app.json:16-19`

❌ **PROBLÈME**:

```json
"NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to access your camera",
"NSPhotoLibraryUsageDescription": "Allow $(PRODUCT_NAME) to access your photo library"
```

**POURQUOI C'EST BLOQUANT**:

-   Descriptions génériques → Apple **rejette souvent**
-   Manque `NSPhotoLibraryAddUsageDescription` (requis iOS 14+)
-   Manque `NSMicrophoneUsageDescription` (alors que `recordAudioAndroid: true`)

**✅ SOLUTION**:

```json
"NSCameraUsageDescription": "Coworkers a besoin d'accéder à votre caméra pour prendre une photo de profil",
"NSPhotoLibraryUsageDescription": "Coworkers a besoin d'accéder à vos photos pour choisir une photo de profil",
"NSPhotoLibraryAddUsageDescription": "Coworkers a besoin de sauvegarder des photos dans votre bibliothèque",
"NSMicrophoneUsageDescription": "Coworkers n'utilise pas le microphone (permission non requise)"
```

---

## ⚠️ PROBLÈMES MAJEURS (Peuvent causer rejet)

### 7. 💾 Memory Leaks - Realtime mal nettoyé

**Fichier**: `src/screens/chat/messengingScreen.tsx:77-102`

❌ **PROBLÈME**:

```typescript
useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
        .channel(`chat-${conversationId}`)
        .on(/* ... */)
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}, [conversationId, loadMessages]); // ⚠️ loadMessages en dépendance
```

**IMPACT**: Le channel est **recréé à chaque appel de `loadMessages`** → fuite mémoire

**✅ SOLUTION**:

```typescript
const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    // ... code
}, [conversationId, session?.user.id]);

useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
        .channel(`chat-${conversationId}`)
        .on(/* ... */)
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}, [conversationId]); // ✅ Plus de loadMessages
```

---

### 8. 🎨 États Loading/Error non gérés

**Fichier**: `src/screens/profile/candidateProfile.tsx:22-47`

❌ **PROBLÈME**:

```typescript
const { data, error } = await supabase.from("participant_requests")...

if (error) {
    console.error("Erreur chargement candidatures :", error);
    setApplications([]); // ⚠️ Affiche juste un écran vide
}
```

**IMPACT**: L'utilisateur voit un écran vide sans savoir qu'il y a eu une erreur

**✅ SOLUTION**:

```typescript
const [error, setError] = useState<string | null>(null);

// Dans loadApplications
if (error) {
    console.error("Erreur chargement candidatures :", error);
    setError("Impossible de charger vos candidatures");
    setApplications([]);
}

// Dans le render
{
    error && (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadApplications}>
                <Text style={styles.retryButton}>Réessayer</Text>
            </TouchableOpacity>
        </View>
    );
}
```

---

### 9. 🔍 Pagination inefficace (recherche client-side)

**Fichier**: `src/screens/home/HomeScreen.tsx:71-90`

❌ **PROBLÈME**:

```typescript
// On récupère page 1 (5 résultats)
const { data } = useAnnouncementByFc(page, PAGE_SIZE, selectedCenter);

// Puis on filtre côté client
if (search.trim()) {
    const q = search.toLowerCase();
    filteredData = filteredData.filter(
        (a) => a.title.toLowerCase().includes(q) || ...
    );
}
```

**IMPACT**:

-   Si l'utilisateur cherche "Paris" en page 1, il ne voit que les résultats de cette page
-   Les autres annonces "Paris" en page 2+ sont invisibles

**✅ SOLUTION**:
Passer `search` au serveur:

```typescript
// Hook
export function useAnnouncementByFc(
    page: number,
    pageSize: number,
    fc_id?: string | null,
    search?: string // ✅ Nouveau param
) {
    return useQuery({
        queryKey: [
            "announcements",
            page,
            pageSize,
            fc_id ?? "all",
            search ?? "",
        ],
        queryFn: () => getAllAnnouncementByFc(page, pageSize, fc_id, search),
        placeholderData: (previousData) => previousData,
    });
}

// API
export async function getAllAnnouncementByFc(
    page: number,
    pageSize: number = 5,
    fc_id?: string | null,
    search?: string // ✅ Nouveau param
): Promise<{ data: AnnouncementWithUser[]; totalCount: number }> {
    const { data, error } = await supabase.rpc("get_annonces_for_user", {
        p_fc_id: fc_id ? fc_id : null,
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize,
        p_search: search || null, // ✅ Passer au RPC
    });
    // ...
}
```

Puis modifier la fonction RPC SQL pour gérer la recherche.

---

### 10. 💣 Actions destructrices sans confirmation

**Fichier**: `src/api/candidate/removeParticipant.ts:13-27`

❌ **PROBLÈME**:

```typescript
export async function removeParticipant({
    annonceId,
    participantId,
    conversationId,
}: {
    annonceId: string;
    participantId: string;
    conversationId: string;
}) {
    // 1️⃣ Retirer de la conversation
    await supabase
        .from("conversation_participants")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("user_id", participantId);
    // ... suite
}
```

**IMPACT**: Appelé directement sans modal de confirmation visible dans le code

**✅ SOLUTION**:
Ajouter une modal `ConfirmModal` avant l'appel (similaire à celle pour supprimer une annonce).

---

### 11. 🔓 Données sensibles exposées dans les alertes

**Fichier**: `src/screens/notification/notificationScreen.tsx:86-87`

❌ **PROBLÈME**:

```typescript
} catch (e: any) {
    console.error("❌ ACCEPT ERROR:", e);
    Alert.alert("Erreur", JSON.stringify(e, null, 2)); // ⚠️ Affiche l'erreur complète
}
```

**RISQUE**: Affiche stack traces, IDs internes, messages techniques à l'utilisateur

**✅ SOLUTION**:

```typescript
} catch (e: any) {
    console.error("❌ ACCEPT ERROR:", e);
    Alert.alert(
        "Erreur",
        "Impossible d'accepter cette candidature. Veuillez réessayer."
    );
    // Log structuré pour debugging (si Sentry/Crashlytics)
    // logError('accept_candidate', e);
}
```

---

## 📊 AMÉLIORATIONS RECOMMANDÉES

### 12. 🎨 UX - Skeleton loaders manquants

**Exemples à améliorer**:

#### `src/screens/home/HomeScreen.tsx:123-131`

```typescript
if (isLoading)
    return (
        <ScreenWrapper title="Chargement...">
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Chargement des annonces...</Text>
            </View>
        </ScreenWrapper>
    );
```

**✅ AMÉLIORATION**:
Utiliser un skeleton loader animé ou au moins un ActivityIndicator:

```typescript
if (isLoading)
    return (
        <ScreenWrapper title="Accueil">
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        </ScreenWrapper>
    );
```

---

### 13. ⚡ Performance - Requêtes sans limite

**Fichier**: `src/screens/chat/messengingScreen.tsx:28-43`

❌ **PROBLÈME**:

```typescript
const { data, error } = await supabase
    .from("messages")
    .select(
        `
        id, sender_id, content, created_at,
        users (id, image_profile, avatar_updated_at, contract)
    `
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true }); // ⚠️ Pas de limit()
```

**IMPACT**: Charge TOUS les messages → problème si 1000+ messages

**✅ SOLUTION**:
Pagination inverse (charge les 50 derniers):

```typescript
const MESSAGES_PAGE_SIZE = 50;
const [messages, setMessages] = useState<any[]>([]);
const [hasMore, setHasMore] = useState(true);

const loadMessages = useCallback(
    async (before?: string) => {
        let query = supabase
            .from("messages")
            .select("...")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: false })
            .limit(MESSAGES_PAGE_SIZE);

        if (before) {
            query = query.lt("created_at", before);
        }

        const { data, error } = await query;

        if (data) {
            setMessages((prev) => [...data.reverse(), ...prev]);
            setHasMore(data.length === MESSAGES_PAGE_SIZE);
        }
    },
    [conversationId]
);

// Ajouter un bouton "Charger plus" en haut de la FlatList
```

---

### 14. 🎯 Optimistic Updates incomplets

**Bien implémenté**: `src/hooks/useApply.ts:32-41`

```typescript
onMutate: async () => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (old: any) => ...);
    return { previous };
}
```

✅ Optimistic update correct

**Manque dans**:

#### `src/components/FavoriteButton.tsx:30`

```typescript
const onPress = async () => {
    if (!session) {
        /* ... */
    }
    await toggleFavorite(!isFavorite); // ⚠️ Pas d'optimistic update
};
```

**✅ AMÉLIORATION**:
Ajouter `onMutate` dans le hook `useFavorite` pour mettre à jour l'UI immédiatement.

#### `src/screens/chat/messengingScreen.tsx:111-117`

```typescript
const onSend = async (text: string) => {
    if (!text.trim()) return;

    await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: session?.user.id,
        content: text,
    });
};
```

**✅ AMÉLIORATION**:
Ajouter le message localement avant l'insert:

```typescript
const onSend = async (text: string) => {
    if (!text.trim()) return;

    const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: text,
        created_at: new Date().toISOString(),
        isMine: true,
        avatar: null,
        update_avatar: null,
        contract: session?.user.user_metadata?.contract,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
        await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_id: session?.user.id,
            content: text,
        });
    } catch (error) {
        // Retirer le message optimiste en cas d'erreur
        setMessages((prev) =>
            prev.filter((m) => m.id !== optimisticMessage.id)
        );
        showToast("error", "Impossible d'envoyer le message");
    }
};
```

---

### 15. 🔗 Deep Linking absent

❌ **PROBLÈME**: Aucune config deep link dans `app.json`

**IMPACT**:

-   Impossible de partager un lien vers une annonce
-   Notifications push ne peuvent pas rediriger vers un écran spécifique
-   Mauvaise UX pour messagerie

**✅ SOLUTION**:

```json
// app.json
{
    "expo": {
        "scheme": "coworkers",
        "android": {
            "intentFilters": [
                {
                    "action": "VIEW",
                    "data": [
                        {
                            "scheme": "https",
                            "host": "coworkers.app",
                            "pathPrefix": "/annonce"
                        }
                    ],
                    "category": ["BROWSABLE", "DEFAULT"]
                }
            ]
        },
        "ios": {
            "associatedDomains": ["applinks:coworkers.app"]
        }
    }
}
```

Puis dans la navigation:

```typescript
const linking = {
    prefixes: ['coworkers://', 'https://coworkers.app'],
    config: {
        screens: {
            AnnonceDetail: 'annonce/:id',
            Chat: 'chat/:conversationId',
            // ...
        }
    }
};

<NavigationContainer linking={linking}>
```

---

## ✅ CE QUI EST BIEN FAIT

### ✨ Points positifs détectés

1. **Auth Context bien structuré** (`src/contexts/authContext.tsx`)

    - ✅ Auto-refresh token avec `startAutoRefresh()`
    - ✅ Gestion AppState (refresh en foreground)
    - ✅ Cleanup correct des subscriptions

2. **React Query utilisé correctement** (`src/hooks/useApply.ts`)

    - ✅ Cache invalidation intelligente
    - ✅ Optimistic updates
    - ✅ Error handling dans mutations
    - ✅ `onSettled` pour refetch

3. **Realtime Supabase** (`src/contexts/messageContext.tsx`)

    - ✅ Cleanup systématique avec `removeChannel()`
    - ✅ Gestion unread conversations
    - ✅ RPC pour états initiaux

4. **Modals de confirmation** présentes

    - ✅ `ConfirmModal` pour suppressions d'annonces
    - ✅ Loading states dans les modals

5. **Structure projet propre**
    - ✅ Séparation API / hooks / contexts
    - ✅ Types TypeScript (malgré quelques `any`)
    - ✅ Navigation par stacks bien organisée

---

## 📋 CHECKLIST AVANT PUBLICATION

### 🔴 CRITIQUE - À corriger ABSOLUMENT (2-3 jours)

#### Sécurité (Priorité 1)

-   [ ] **Auditer toutes les tables Supabase**: Vérifier que RLS est activé
-   [ ] **Créer politiques RLS ownership**: `user_id = auth.uid()` sur tables sensibles
-   [ ] **Tester avec utilisateurs différents**: S'assurer qu'on ne peut pas accéder aux données d'autrui
-   [ ] **Vérifier clés API**: Confirmer qu'on utilise bien `anon` key (pas `service_role`)

#### Erreurs & Logs (Priorité 1)

-   [ ] **Supprimer tous les `console.log`**: Ou créer logger conditionnel
-   [ ] **Ajouter try/catch**: Sur tous les appels `mutateAsync` et async handlers
-   [ ] **Messages d'erreur user-friendly**: Remplacer `JSON.stringify(error)`
-   [ ] **Toast/Alert sur erreurs**: Toujours informer l'utilisateur

#### Permissions iOS (Priorité 1)

-   [ ] **Réécrire descriptions**: Expliquer POURQUOI dans `NSCameraUsageDescription`
-   [ ] **Ajouter `NSPhotoLibraryAddUsageDescription`**: Obligatoire iOS 14+
-   [ ] **Vérifier microphone**: Retirer permission ou justifier

#### Transactions (Priorité 2)

-   [ ] **Créer RPC `accept_candidate`**: Transaction atomique pour accepter candidature
-   [ ] **Créer RPC `remove_participant`**: Transaction atomique pour retrait
-   [ ] **Tester rollback**: Vérifier cohérence en cas d'erreur

---

### 🟡 IMPORTANT - Recommandé (1 semaine)

#### UX/UI

-   [ ] **Boutons "Réessayer"**: Sur tous les écrans d'erreur
-   [ ] **Skeleton loaders**: Remplacer textes "Chargement..."
-   [ ] **États vides**: EmptyState avec actions sur tous les écrans
-   [ ] **Loading indicators**: ActivityIndicator cohérents partout

#### Performance

-   [ ] **Pagination messages**: Limiter à 50 derniers
-   [ ] **Recherche serveur**: Passer filtres à l'API (pas client)
-   [ ] **Index DB**: Vérifier index sur `conversation_id`, `user_id`, etc.
-   [ ] **Optimistic updates**: Favoris et messages

#### Stabilité

-   [ ] **Memory leaks**: Revoir dépendances `useEffect` realtime
-   [ ] **Race conditions**: Vérifier toutes les séquences d'appels async
-   [ ] **Confirmation modale**: Retrait participant

#### Navigation

-   [ ] **Deep linking**: Configurer scheme + universal links
-   [ ] **Redirections**: Après auth, vers page demandée

---

### 🟢 OPTIONNEL - Amélioration continue

-   [ ] **TypeScript strict**: Remplacer `any` par types précis
-   [ ] **Tests E2E**: Detox pour flows critiques (auth, apply, message)
-   [ ] **Accessibilité**: `accessibilityLabel` sur tous les touchables
-   [ ] **Analytics**: Amplitude/Mixpanel pour tracking usage
-   [ ] **Crash reporting**: Sentry pour monitoring prod
-   [ ] **Performance monitoring**: Firebase Performance
-   [ ] **CI/CD**: GitHub Actions pour tests auto
-   [ ] **App icon variants**: iOS (1024×1024) + Android adaptive
-   [ ] **Screenshots store**: Préparer 5-10 screenshots pour chaque plateforme

---

## 🎯 ESTIMATION TEMPS

| Phase                                    | Durée    | Priorité     |
| ---------------------------------------- | -------- | ------------ |
| **Audit RLS Supabase**                   | 1 jour   | 🔴 Critique  |
| **Remove console.logs + error handling** | 1 jour   | 🔴 Critique  |
| **Permissions iOS descriptions**         | 2h       | 🔴 Critique  |
| **Transactions RPC**                     | 1 jour   | 🔴 Critique  |
| **UX (boutons retry, loaders)**          | 2 jours  | 🟡 Important |
| **Performance (pagination)**             | 1 jour   | 🟡 Important |
| **Memory leaks**                         | 0.5 jour | 🟡 Important |
| **Deep linking**                         | 1 jour   | 🟡 Important |

**Total minimum avant soumission**: 3-4 jours  
**Total recommandé**: 1-2 semaines

---

## 🚀 RECOMMANDATION FINALE

**État actuel**: Le projet est **fonctionnel** mais présente des risques de sécurité et stabilité.

**Peut-on publier maintenant ?** ❌ NON

-   Apple rejettera très probablement (permissions + potentielles failles)
-   Google pourrait accepter mais avec risques sécurité

**Quand publier ?**
Après correction des **4 points critiques** (sécurité + erreurs + permissions + transactions) → **3-4 jours de travail**

**Roadmap suggérée**:

1. **Sprint 1 (3-4j)**: Corrections critiques → soumission stores
2. **Sprint 2 (1 semaine)**: Corrections importantes → update v1.1
3. **Backlog**: Améliorations continues

**Prochaines étapes immédiates**:

1. Activer/auditer RLS sur toutes les tables Supabase
2. Créer un branch `pre-release` pour corrections
3. Supprimer tous les console.log
4. Réécrire permissions iOS
5. Tester avec 2-3 utilisateurs différents (ownership checks)

Une fois ces étapes validées, le projet sera **prêt pour soumission** avec un taux de succès élevé. 🎉
