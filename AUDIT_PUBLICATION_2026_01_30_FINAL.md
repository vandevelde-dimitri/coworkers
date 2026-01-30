# 🔍 AUDIT PUBLICATION APP STORE / GOOGLE PLAY

**Date:** 30 janvier 2026  
**Projet:** Coworkers - React Native + Supabase  
**Version:** 1.0.0

---

## 📊 Résumé Exécutif

| Catégorie             | État           | Score  |
| --------------------- | -------------- | ------ |
| Sécurité              | ⚠️ À améliorer | 7/10   |
| Stabilité             | ✅ Bon         | 8/10   |
| Performance           | ✅ Bon         | 8/10   |
| UX / Store Compliance | ✅ Bon         | 8.5/10 |
| Bonnes pratiques RN   | ⚠️ À améliorer | 7/10   |

**Score Global: 7.5/10** - Prêt avec corrections mineures

---

## 🔴 PROBLÈMES CRITIQUES (Bloquants pour publication)

### 1. Sécurité - Variable d'environnement avec `!` assertion

**Fichier:** `utils/supabase.ts` (lignes 6-7)

```typescript
process.env.EXPO_PUBLIC_SUPABASE_URL!,
process.env.EXPO_PUBLIC_SUPABASE_KEY!,
```

**Risque:** Crash si les variables ne sont pas définies. Aucune validation.

**Correction recommandée:**

```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Configuration Supabase manquante");
}

export const supabase = createClient(supabaseUrl, supabaseKey, { ... });
```

---

### 2. Sécurité - `useApply.ts` utilise `isLoading` déprécié

**Fichier:** `src/hooks/useApply.ts` (ligne 62)

```typescript
isLoading: requestQuery.isLoading || toggleMutation.isLoading,
```

**Problème:** `mutation.isLoading` est déprécié dans React Query v5 (version utilisée: v5.90.5). Doit être `isPending`.

**Correction:**

```typescript
isLoading: requestQuery.isLoading || toggleMutation.isPending,
```

---

### 3. Sécurité - Mode invité accède à `AppTabs` sans session

**Fichier:** `src/AppNavigator.tsx` (lignes 49-51)

```tsx
{!session ? (
    <>
        <Stack.Screen name="PublicStack" component={PublicStack} />
        <Stack.Screen name="AppTabs" component={AppTabs} />  // ⚠️ Accessible sans auth
    </>
```

**Risque:** Un utilisateur non connecté peut naviguer vers `AppTabs` via deep linking ou manipulation.

**Correction recommandée:** Retirer `AppTabs` du bloc `!session` ou ajouter une protection dans chaque écran sensible.

---

### 4. Sécurité - RLS potentiellement contournable côté client

**Fichier:** `src/api/announcement/getAllAnnouncementByFc.ts`

Les requêtes utilisent des RPC mais certaines fonctions comme `getAllAnnouncementByFc` ne valident pas l'authentification côté client. Si les RLS Supabase ne sont pas configurées correctement, des données pourraient être exposées.

**Action requise:** Vérifier que TOUTES les tables ont des RLS actives avec policies appropriées dans Supabase Dashboard.

---

### 5. Erreur potentielle - `delete-account` Edge Function

**Fichier:** `supabase/functions/delete-account/index.ts` (lignes 29-38)

```typescript
await supabase.from("participant_requests").delete().eq("user_id", userId);
await supabase.from("conversation_participants").delete().eq("user_id", userId);
await supabase.from("favorites").delete().eq("user_id", userId);
await supabase.from("annonces").delete().eq("user_id", userId);
await supabase.from("users").delete().eq("id", userId);
```

**Problème:** Aucune gestion d'erreur sur les suppressions intermédiaires. Si une suppression échoue, l'utilisateur peut être dans un état incohérent.

**Correction recommandée:** Utiliser une transaction ou vérifier chaque étape.

---

## 🟠 AMÉLIORATIONS RECOMMANDÉES

### 1. Gestion d'erreurs - `initSession` sans catch

**Fichier:** `src/contexts/authContext.tsx` (lignes 31-35)

```typescript
const initSession = async () => {
    const { data } = await supabase.auth.getSession(); // ⚠️ Pas de try/catch
    setSession(data.session);
    setLoading(false);
};
```

**Amélioration:**

```typescript
const initSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
    } catch (err) {
        console.error("Session init error:", err);
    } finally {
        setLoading(false);
    }
};
```

---

### 2. Performance - Channel Realtime trop large

**Fichier:** `src/contexts/messageContext.tsx` (lignes 65-71)

```typescript
.on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "messages",  // ⚠️ Écoute TOUS les messages
},
```

**Problème:** Écoute tous les INSERT sur la table `messages`, même ceux qui ne concernent pas l'utilisateur.

**Amélioration:** Ajouter un filtre côté serveur via RLS ou utiliser un canal spécifique par conversation.

---

### 3. Stabilité - États `loading` minimalistes

**Fichier:** `src/AppNavigator.tsx` (ligne 40)

```typescript
if (loading) return <ActivityIndicator />; // ⚠️ Pas de style/splash
```

**Amélioration:** Utiliser un vrai splash screen ou un loader centré avec style approprié.

---

### 4. UX - Confirmation manquante sur actions critiques

**Fichier:** `src/screens/profile/SettingsScreen.tsx` (lignes 90-95)

La suppression de compte a bien une modale ✅ mais les changements d'email/mot de passe n'ont pas de confirmation préalable.

---

### 5. Performance - `staleTime: 0` force des refetch systématiques

**Fichier:** `src/hooks/announcement/useAnnouncement.ts` (lignes 19-20)

```typescript
staleTime: 0, // Toujours considérer les données comme périmées
refetchOnMount: "always",
```

**Impact:** Requêtes excessives à chaque navigation, consommation data et batterie.

**Recommandation:** Mettre `staleTime: 30000` (30 secondes minimum).

---

### 6. Typages - Usage de `any`

**Fichiers concernés:**

- `src/screens/chat/messengingScreen.tsx` (ligne 13): `route: any`
- `src/screens/notification/notificationScreen.tsx` (ligne 45): `payload: any`
- `src/screens/auth/UpdatePasswordScreen.tsx` (ligne 13): `route, navigation: any`

**Amélioration:** Typer correctement avec les types de navigation React Navigation.

---

### 7. Navigation - Typage incomplet

**Fichier:** `src/screens/auth/LoginScreen.tsx` (lignes 58-60)

```typescript
navigation.navigate("AppTabs" as never, { ... } as never);
```

**Problème:** Cast `as never` masque les erreurs de typage et empêche l'autocomplétion.

---

### 8. Memory leak potentiel - `loadMessages` dans dépendances

**Fichier:** `src/screens/chat/messengingScreen.tsx` (ligne 84)

`loadMessages` est dans les dépendances de `useCallback` mais utilise `session?.user.id` qui peut changer, créant une nouvelle fonction à chaque changement.

---

## 🟢 CE QUI EST ACCEPTABLE MAIS PERFECTIBLE

### ✅ Points positifs observés

| Aspect                          | Statut       | Détail                                            |
| ------------------------------- | ------------ | ------------------------------------------------- |
| **Cleanup Realtime**            | ✅ Excellent | `removeChannel()` présent dans tous les useEffect |
| **Confirmations destructrices** | ✅ Bon       | Modales sur suppression compte/annonce/avatar     |
| **Gestion permissions**         | ✅ Bon       | `utils/permission.ts` avec redirection paramètres |
| **React Query**                 | ✅ Bon       | Bien configuré avec invalidations cohérentes      |
| **Pagination**                  | ✅ Bon       | Implémentée sur messages et annonces              |
| **Empty states**                | ✅ Bon       | Composant `EmptyState` utilisé partout            |
| **Liens légaux**                | ✅ Requis    | Privacy Policy et ToS présents dans ProfileScreen |
| **App.json**                    | ✅ Conforme  | Permissions iOS/Android bien déclarées            |
| **Deep linking**                | ✅ Bon       | Schéma configuré et reset password fonctionnel    |
| **Logger custom**               | ✅ Bon       | `utils/logger.ts` pour erreurs critiques          |

### Points perfectibles

| Point                 | Fichier                      | Détail                                          |
| --------------------- | ---------------------------- | ----------------------------------------------- |
| Console.error en prod | Multiples                    | Plusieurs `console.error` qui polluent les logs |
| Erreurs utilisateur   | Multiples                    | Certains messages sont techniques               |
| Typo                  | `notificationScreen.tsx:151` | "vraiement" → "vraiment"                        |
| Faute grammaire       | `useAnnouncement.ts:114`     | "à était" → "a été"                             |

---

## 🚫 CE QUI PEUT PROVOQUER UN REJET STORE

### Apple App Store

| Guideline | Critère                   | Statut | Action                                              |
| --------- | ------------------------- | ------ | --------------------------------------------------- |
| 4.2       | Minimum Functionality     | ⚠️     | S'assurer que l'app a assez de contenu au lancement |
| 5.1.1     | Data Collection & Storage | ✅     | Privacy Policy présente                             |
| 2.1       | App Completeness          | ⚠️     | Vérifier que l'onboarding est complet et testable   |
| 4.8       | Sign in with Apple        | ❓     | Si login social prévu, Apple Sign-In est requis     |
| 2.3       | Accurate Metadata         | ⚠️     | Screenshots et description à jour                   |

### Google Play

| Critère                | Statut | Action                                   |
| ---------------------- | ------ | ---------------------------------------- |
| Account Deletion       | ✅     | Fonctionnalité présente et fonctionnelle |
| Privacy Policy         | ✅     | Lien présent dans l'app                  |
| Permissions justifiées | ✅     | Camera/Gallery avec descriptions         |
| Target API Level       | ⚠️     | Vérifier que targetSdkVersion >= 34      |
| Data Safety Form       | ⚠️     | À remplir dans Play Console              |

---

## ✅ CHECKLIST FINALE AVANT PUBLICATION

### 🔒 Sécurité

- [ ] Valider les variables d'environnement au démarrage
- [ ] Vérifier RLS sur TOUTES les tables Supabase
- [ ] Retirer accès `AppTabs` pour utilisateurs non connectés dans AppNavigator
- [ ] Audit Edge Function `delete-account` avec transactions
- [ ] Vérifier qu'aucune clé sensible n'est exposée

### 🛡️ Stabilité

- [ ] Remplacer `isLoading` par `isPending` dans `useApply.ts`
- [ ] Ajouter try/catch sur `initSession` dans authContext
- [ ] Typer correctement les routes et props (retirer `as never`)
- [ ] Vérifier les useEffect avec dépendances correctes

### ⚡ Performance

- [ ] Filtrer channel Realtime par user_id si possible
- [ ] Revoir `staleTime: 0` sur announcements (mettre 30s minimum)
- [ ] Vérifier qu'il n'y a pas de re-renders inutiles

### 🎨 UX

- [ ] Splash screen pendant le loading initial
- [ ] Corriger typo "vraiement" → "vraiment"
- [ ] Corriger "à était" → "a été"
- [ ] Ajouter confirmation sur changement email/mot de passe
- [ ] Tester l'app avec connexion lente (3G)

### 📱 Store Compliance

- [ ] Tester deep links en mode non connecté
- [ ] Vérifier flow complet: inscription → onboarding → app
- [ ] Si prévu: Implémenter Sign in with Apple pour iOS
- [ ] Test sur devices réels iOS + Android
- [ ] Préparer screenshots pour toutes les tailles d'écran
- [ ] Remplir Data Safety Form (Google Play)
- [ ] Préparer App Privacy Details (App Store)

### 📝 Logging & Debug

- [ ] Remplacer `console.error` par le logger custom en production
- [ ] Vérifier que `__DEV__` conditionne bien les logs
- [ ] Désactiver les logs React Query en production

### 🧪 Tests

- [ ] Test création de compte complet
- [ ] Test connexion/déconnexion
- [ ] Test suppression de compte
- [ ] Test création/modification/suppression annonce
- [ ] Test candidature et annulation
- [ ] Test messagerie en temps réel
- [ ] Test notifications
- [ ] Test mode hors ligne / reconnexion

---

## 📋 Fichiers à modifier (priorité haute)

| Fichier                                           | Modification                       | Priorité     |
| ------------------------------------------------- | ---------------------------------- | ------------ |
| `utils/supabase.ts`                               | Validation variables env           | 🔴 Critique  |
| `src/hooks/useApply.ts`                           | `isLoading` → `isPending`          | 🔴 Critique  |
| `src/AppNavigator.tsx`                            | Retirer `AppTabs` du bloc non-auth | 🔴 Critique  |
| `src/contexts/authContext.tsx`                    | Try/catch sur initSession          | 🟠 Important |
| `src/hooks/announcement/useAnnouncement.ts`       | staleTime + typo                   | 🟠 Important |
| `src/screens/notification/notificationScreen.tsx` | Typo "vraiement"                   | 🟡 Mineur    |
| `supabase/functions/delete-account/index.ts`      | Gestion erreurs                    | 🟠 Important |

---

## 📈 Conclusion

L'application est **globalement bien structurée** avec de bonnes pratiques :

- ✅ React Query bien utilisé
- ✅ Cleanup des subscriptions realtime
- ✅ Confirmations sur actions destructrices
- ✅ Gestion des permissions correcte
- ✅ Liens légaux présents

Les problèmes identifiés sont principalement :

- 🔴 Edge cases de sécurité facilement corrigeables
- 🟠 Améliorations de robustesse mineures
- 🟡 Quelques typos et typages à corriger

**Estimation temps de correction:** 2-4 heures pour les points critiques.

---

_Audit généré le 30 janvier 2026_
