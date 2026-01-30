# 🔍 AUDIT COMPLET - Publication App Store & Google Play

**Projet :** Coworkers (React Native + Expo + Supabase)  
**Date :** 30 janvier 2026  
**Version :** 1.0.0  
**Plateformes cibles :** App Store (iOS) & Google Play (Android)

---

## 🚨 PROBLÈMES CRITIQUES (Bloquants pour publication)

### 1. 🔴 Hook appelé hors composant React

| Fichier                  | Problème                                                                          |
| ------------------------ | --------------------------------------------------------------------------------- |
| `utils/updateEmail.ts:6` | `useAuth()` appelé dans une fonction normale - **violation des règles des hooks** |

```typescript
// ❌ IMPOSSIBLE - crash assuré
export const onUpdateEmail = async ({ email }) => {
    const { refreshSession } = useAuth(); // Hook hors composant !
    // ...
};
```

**Solution :** Passer `refreshSession` en paramètre ou transformer en hook custom.

```typescript
// ✅ Solution 1 : Passer en paramètre
export const onUpdateEmail = async ({ email, refreshSession }) => {
    try {
        await supabase.auth.updateUser({ email });
        await refreshSession();
        Alert.alert("Succès", "Email mis à jour");
    } catch (e: any) {
        Alert.alert("Erreur", e.message);
    }
};

// ✅ Solution 2 : Transformer en hook
export function useUpdateEmail() {
    const { refreshSession } = useAuth();

    return async (email: string) => {
        try {
            await supabase.auth.updateUser({ email });
            await refreshSession();
            showToast("success", "Email mis à jour");
        } catch (e: any) {
            showToast("error", "Erreur lors de la mise à jour");
        }
    };
}
```

---

### 2. 🔴 Bouton mal libellé - Confusion UX critique

| Fichier                                        | Problème                                                |
| ---------------------------------------------- | ------------------------------------------------------- |
| `src/screens/auth/ForgotPasswordScreen.tsx:78` | Bouton "**S'inscrire**" sur l'écran mot de passe oublié |

```tsx
// ❌ Actuel
<Button label="S'inscrire" onPress={handleSubmit(onSubmit)} />

// ✅ Correction
<Button label="Envoyer le lien" onPress={handleSubmit(onSubmit)} />
```

**Risque :** Rejet store pour incohérence UX évidente.

---

### 3. 🔴 Console.log en production (données sensibles)

| Fichier                                           | Ligne          | Données exposées         |
| ------------------------------------------------- | -------------- | ------------------------ |
| `src/screens/users/userProfileScreen.tsx`         | L21            | Objet user complet       |
| `src/screens/profile/SettingsScreen.tsx`          | L65            | Settings utilisateur     |
| `src/api/announcement/getAnnouncementById.ts`     | L53            | Annonce complète en JSON |
| `src/contexts/messageContext.tsx`                 | L42            | Erreur conversations     |
| `src/contexts/notificationContext.tsx`            | L36, L90       | Erreurs notifications    |
| `src/screens/chat/messengingScreen.tsx`           | L82, L143      | Erreurs messages         |
| `src/screens/notification/notificationScreen.tsx` | L53            | Erreurs notifications    |
| `src/hooks/user/useUsers.ts`                      | L49, L75, L111 | Erreurs user             |

**Risque :** Fuite d'informations en production, violation RGPD potentielle.

**Solution :** Conditionner tous les logs avec `__DEV__` ou utiliser le logger existant :

```typescript
// ✅ Pattern à utiliser
if (__DEV__) console.log("debug:", data);

// ✅ Ou utiliser le logger centralisé pour les erreurs critiques
import { logger } from "../utils/logger";
await logger.critical("action_name", error, userId);
```

---

### 4. 🔴 Subscription Realtime sans filtre utilisateur

| Fichier                                      | Problème                                   |
| -------------------------------------------- | ------------------------------------------ |
| `src/contexts/messageContext.tsx:63-78`      | Écoute **TOUS** les messages de la table   |
| `src/contexts/notificationContext.tsx:44-66` | Écoute **TOUTES** les participant_requests |

```typescript
// ❌ Actuel - Pas de filtre - reçoit les messages de TOUS les utilisateurs
.on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "messages",
    // Manque: filter: `recipient_id=eq.${userId}`
})
```

**Risque :**

- Problème de sécurité si le RLS n'est pas parfait
- Surcharge réseau inutile
- Traitement côté client de données non pertinentes

**Solution :** Ajouter un filtre côté subscription (si possible) ou s'assurer que le RLS est strict.

---

## ⚠️ PROBLÈMES IMPORTANTS (À corriger avant publication)

### 5. 🟠 Fautes d'orthographe visibles par l'utilisateur

| Fichier                                         | Texte incorrect                  | Correction                      |
| ----------------------------------------------- | -------------------------------- | ------------------------------- |
| `src/screens/profile/SettingsScreen.tsx:266`    | "vraiement"                      | "vraiment"                      |
| `src/hooks/announcement/useAnnouncement.ts:91`  | "Votre annonce à était modifié"  | "Votre annonce a été modifiée"  |
| `src/hooks/announcement/useAnnouncement.ts:112` | "Votre annonce à était supprimé" | "Votre annonce a été supprimée" |

---

### 6. 🟠 Requête sans pagination

| Fichier                 | Problème                                            |
| ----------------------- | --------------------------------------------------- |
| `src/api/getAllFc.ts:5` | `select("*")` sans limite - charge tous les centres |

```typescript
// ❌ Actuel
const { data, error } = await supabase.from("fc").select("*");

// ✅ Correction (si la liste peut grandir)
const { data, error } = await supabase.from("fc").select("*").limit(100);
```

---

### 7. 🟠 Message d'erreur incomplet à l'inscription

| Fichier                                  | Problème          |
| ---------------------------------------- | ----------------- |
| `src/screens/auth/RegisterScreen.tsx:44` | Message incomplet |

```typescript
// ❌ Actuel
showToast("error", "Inscription échouée : ");

// ✅ Correction
showToast("error", "Inscription échouée", errorAuth.message);
// Ou message générique
showToast("error", "Inscription échouée", "Veuillez vérifier vos informations");
```

---

### 8. 🟠 Gestion async incomplète dans ConfirmModal

| Fichier                                          | Problème                                |
| ------------------------------------------------ | --------------------------------------- |
| `src/screens/profile/SettingsScreen.tsx:271-277` | `onDeleteAccount()` appelé sans `await` |

```typescript
// ❌ Actuel - le toast "success" pourrait s'afficher avant la fin
onConfirm={async () => {
    setOpenDestroy(false);
    await onDeleteAccount(); // ✅ await ajouté
}}
```

---

### 9. 🟠 États loading minimalistes

| Fichier                                            | Problème                                        |
| -------------------------------------------------- | ----------------------------------------------- |
| `src/screens/home/AnnouncementDetailScreen.tsx:33` | `<Text>Loading...</Text>` sans wrapper SafeArea |
| `src/screens/chat/messengingScreen.tsx:170`        | `<Text>Chargement…</Text>` minimaliste          |

**Solution :** Utiliser un composant loading cohérent avec l'UI :

```tsx
if (isLoading) {
    return (
        <ScreenWrapper title="Détails">
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        </ScreenWrapper>
    );
}
```

---

## ✅ POINTS POSITIFS (Bien implémentés)

| Aspect                          | Implémentation                                                | Fichier(s)                                                      |
| ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| **Configuration Supabase**      | ✅ Variables d'environnement, AsyncStorage, autoRefreshToken  | `utils/supabase.ts`                                             |
| **Suppression compte**          | ✅ Edge Function sécurisée avec service_role_key              | `supabase/functions/delete-account/index.ts`                    |
| **Actions critiques**           | ✅ RPC sécurisées                                             | `accept_candidate`, `delete_announcement`, `remove_participant` |
| **Confirmations destructrices** | ✅ ConfirmModal sur toutes les actions                        | Suppression compte/annonce/déconnexion/avatar                   |
| **Permissions iOS**             | ✅ Descriptions configurées                                   | `app.json`                                                      |
| **Pagination messages**         | ✅ Implémentée avec PAGE_SIZE = 50                            | `src/screens/chat/messengingScreen.tsx`                         |
| **Cleanup realtime**            | ✅ `supabase.removeChannel()` dans les useEffect return       | Tous les contexts                                               |
| **React Query**                 | ✅ Cache, invalidation, gestion erreurs                       | Tous les hooks                                                  |
| **Navigation**                  | ✅ Structure claire avec stacks dédiés                        | `src/navigation/`                                               |
| **Liens légaux**                | ✅ Mentions légales/politique confidentialité à l'inscription | `RegisterScreen.tsx`                                            |
| **Logger production**           | ✅ Logger centralisé pour erreurs critiques                   | `utils/logger.ts`                                               |
| **Gestion permissions**         | ✅ Redirection vers paramètres système si refusé              | `utils/permission.ts`                                           |

---

## 📝 ACCEPTABLE MAIS PERFECTIBLE

| Aspect                    | État actuel                              | Amélioration suggérée                         | Priorité |
| ------------------------- | ---------------------------------------- | --------------------------------------------- | -------- |
| **Types navigation**      | `as never` dans RootNavigation           | Typage strict avec ParamList                  | Basse    |
| **Folder naming**         | `src/hooks/favortie/`                    | Renommer en `favorite`                        | Basse    |
| **Provider values**       | Non mémorisées                           | Ajouter `useMemo` pour éviter re-renders      | Moyenne  |
| **Composants liste**      | Sans `React.memo`                        | Optimiser `MessageBubble`, `ConversationItem` | Moyenne  |
| **staleTime React Query** | Non configuré globalement                | Ajouter `staleTime: 5 * 60 * 1000`            | Moyenne  |
| **Hook useFloor vide**    | Fichier existe mais potentiellement vide | Vérifier et nettoyer                          | Basse    |

---

## 📋 CHECKLIST FINALE AVANT PUBLICATION

### 🔴 Critiques (OBLIGATOIRE)

- [ ] **Corriger `utils/updateEmail.ts`** - Refactorer pour ne pas appeler `useAuth()` hors composant
- [ ] **Corriger bouton `ForgotPasswordScreen.tsx:78`** - "S'inscrire" → "Envoyer le lien"
- [ ] **Supprimer console.log non protégés** - Ou ajouter `if (__DEV__)` systématiquement
- [ ] **Ajouter filtre sur subscription realtime** - Filtrer par `user_id` ou vérifier RLS strict

### 🟠 Importants (Fortement recommandé)

- [ ] Corriger les 3 fautes d'orthographe dans les messages toast
- [ ] Ajouter pagination/limite sur `getAllFc()`
- [ ] Compléter le message d'erreur inscription avec détail
- [ ] Ajouter `await` sur `onDeleteAccount()` dans ConfirmModal
- [ ] Améliorer les écrans loading avec SafeArea + ActivityIndicator

### 🟢 Optionnels (Qualité - peut attendre v1.1)

- [ ] Renommer `favortie/` → `favorite/`
- [ ] Ajouter `React.memo()` sur composants de liste
- [ ] Mémoiser les values des Providers avec `useMemo`
- [ ] Configurer `staleTime` global dans QueryClient
- [ ] Typer proprement la navigation (supprimer `as never`)

---

## 📊 RÉSUMÉ EXÉCUTIF

| Niveau           | Nombre | Action requise                       |
| ---------------- | ------ | ------------------------------------ |
| 🔴 **Critique**  | 4      | Bloquant - Corriger avant soumission |
| 🟠 **Important** | 5      | Recommandé - Risque de rejet/bugs    |
| 🟢 **Mineur**    | 6+     | Qualité - Peut attendre v1.1         |

### Estimation temps de correction

| Type              | Temps estimé   |
| ----------------- | -------------- |
| Critiques         | 2-3 heures     |
| Importants        | 1-2 heures     |
| **Total minimum** | **3-5 heures** |

---

## 🎯 VERDICT

L'application est globalement **bien architecturée** et **prête pour publication** une fois les **4 problèmes critiques** corrigés.

**Points forts :**

- Sécurité côté serveur solide (RPC, Edge Functions, RLS)
- Architecture clean (hooks, contexts, navigation structurée)
- UX cohérente avec confirmations sur actions destructrices
- Gestion des erreurs avec React Query

**Points d'attention :**

- Fuites de logs en production
- Bug critique du hook `useAuth()` appelé hors composant
- Quelques incohérences UX mineures (bouton mal libellé, fautes)

---

_Audit généré le 30 janvier 2026_
