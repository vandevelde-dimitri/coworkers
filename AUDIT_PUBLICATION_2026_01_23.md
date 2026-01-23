# 🔍 AUDIT PRÉ-PUBLICATION - Coworkers App

**Date :** 23 janvier 2026  
**Version :** 1.0.0  
**Plateformes cibles :** App Store (iOS) & Google Play (Android)

---

## 🚨 1. PROBLÈMES CRITIQUES (À corriger avant soumission)

### 🔐 Sécurité

| Problème                                       | Fichier                                              | Risque                                                    | Correction                                                            |
| ---------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| **QueryClient créé dans le composant**         | `App.tsx:14`                                         | Réinitialisation à chaque re-render, perte de cache       | Déplacer `new QueryClient()` hors du composant ou utiliser `useState` |
| **Mot de passe oublié non implémenté**         | `src/screens/auth/LoginScreen.tsx:144-147`           | Bloque l'utilisateur, rejet store                         | Implémenter avec `supabase.auth.resetPasswordForEmail()`              |
| **Console.log en production**                  | Multiples fichiers                                   | Fuite d'informations sensibles                            | Supprimer ou conditionner avec `__DEV__`                              |
| **Erreurs Supabase exposées aux utilisateurs** | `src/screens/notification/notificationScreen.tsx:98` | `Alert.alert("Erreur", e.message)` expose le message brut | Messages génériques pour l'utilisateur                                |

### ⚠️ Suppression de compte

| Problème                                   | Fichier                                        | Correction                                                                                    |
| ------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Pas d'attente de réponse avant signOut** | `src/screens/profile/SettingsScreen.tsx:57-63` | `deleteAccount()` n'est pas await correctement, showToast appelé même si erreur dans le catch |

```tsx
// ❌ Actuel - showToast("success") dans le flux normal ET dans onConfirm
onConfirm={() => {
    setOpenDestroy(false);
    onDeleteAccount();  // async sans await
    showToast("success", "Suppression de compte réussie"); // exécuté avant fin
}}
```

---

## ⚡ 2. PROBLÈMES DE STABILITÉ

### Race Conditions & États

| Problème                                             | Fichier                                                           | Impact                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| **Double inscription AppState listener**             | `utils/supabase.ts:24-30` ET `src/contexts/authContext.tsx:44-53` | Conflit, comportement imprévisible                      |
| **Pagination chat avec `inverted`**                  | `src/screens/chat/messengingScreen.tsx:68-72`                     | `prepend` + `inverted` = messages dans le mauvais ordre |
| **État `loadMessages` dépendant de `hasMore` stale** | `src/screens/chat/messengingScreen.tsx:40-84`                     | Closure capture `hasMore` obsolète                      |

### États loading/error incomplets

| Écran                                                 | État manquant                                              |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `src/screens/home/AnnouncementDetailScreen.tsx:30-32` | `isLoading` retourne simple `<Text>` sans wrapper SafeArea |
| `src/screens/profile/updateAvatarScreen.tsx:19`       | Pas de gestion `isLoading` pour `useCurrentUser`           |

---

## 🚀 3. PERFORMANCE

### Requêtes et cache

| Problème                                          | Impact                                                                                    | Correction                                                              |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Pas de `staleTime` configuré**                  | Requêtes refetch systématiques                                                            | Ajouter `staleTime: 5 * 60 * 1000` pour les données stables             |
| **Pas de `React.memo()` sur composants de liste** | Re-renders inutiles des FlatList                                                          | `AnnouncementCardList.tsx`, `MessageBubble.tsx`, `ConversationItem.tsx` |
| **Values des Providers non mémorisées**           | `src/contexts/messageContext.tsx:119-125`, `src/contexts/notificationContext.tsx:121-126` | Utiliser `useMemo` pour la value du Provider                            |

### Realtime

| ✅ OK                             | ❌ Problème                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| Cleanup `removeChannel()` présent | Channel `messages-global` écoute TOUS les messages (pas de filtre `filter`) |

---

## 📱 4. UX / STORE COMPLIANCE

### Actions destructrices

| Action                       | Modal de confirmation  | ✅/❌     |
| ---------------------------- | ---------------------- | --------- |
| Supprimer annonce            | ✅ `ConfirmModal`      | OK        |
| Supprimer compte             | ✅ `ConfirmModal`      | OK        |
| Déconnexion                  | ✅ `ConfirmModal`      | OK        |
| Annuler candidature acceptée | ✅ `ConfirmModal`      | OK        |
| **Refuser candidature**      | ❌ Aucune confirmation | À ajouter |

### Écrans vides / confus

| Écran                                       | Problème                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/screens/auth/ForgotPasswordScreen.tsx` | **Placeholder non fonctionnel** - Affiche juste "Page d'accueil"                     |
| Préférences (vibrations, mode vacances...)  | `src/screens/profile/SettingsScreen.tsx:115-163` - `<Switch />` sans state ni action |

### Permissions iOS

| ✅ Configuré dans app.json          |
| ----------------------------------- |
| `NSCameraUsageDescription`          |
| `NSPhotoLibraryUsageDescription`    |
| `NSPhotoLibraryAddUsageDescription` |

---

## ⚛️ 5. BONNES PRATIQUES REACT NATIVE

### Hooks

| Problème                                                       | Fichier                                           |
| -------------------------------------------------------------- | ------------------------------------------------- |
| `useApply` retourne `isLoading` de v5 React Query (deprecated) | `src/hooks/useApply.ts:62` → utiliser `isPending` |

### Navigation

| ✅ OK                                       |
| ------------------------------------------- |
| Protection des routes avec `useRequireAuth` |
| Redirection post-login avec SecureStore     |
| Cleanup navigation sur tab press            |

### Memory Leaks potentiels

| Risque                                                       | Fichier                                       |
| ------------------------------------------------------------ | --------------------------------------------- |
| `loadMessages` appelé dans useEffect sans cancel sur unmount | `src/screens/chat/messengingScreen.tsx:89-92` |

---

## 🚫 6. RISQUES DE REJET STORE

| Risque                                   | Niveau           | Correction requise                               |
| ---------------------------------------- | ---------------- | ------------------------------------------------ |
| **Mot de passe oublié non fonctionnel**  | 🔴 Élevé (Apple) | Implémenter la feature                           |
| **ForgotPasswordScreen placeholder**     | 🔴 Élevé         | Supprimer l'écran ou implémenter                 |
| **Switchs préférences non fonctionnels** | 🟡 Moyen         | Implémenter ou retirer de l'UI                   |
| **Liens légaux externes fonctionnels**   | ✅ OK            | Liens vers politique de confidentialité présents |
| **Permissions déclarées**                | ✅ OK            | Toutes les permissions sont justifiées           |

---

## ✅ 7. CE QUI EST ACCEPTABLE (Perfectible)

| Élément                       | État                             |
| ----------------------------- | -------------------------------- |
| Pagination côté serveur       | ✅ Implémentée avec RPC          |
| Gestion auth Supabase         | ✅ Refresh token automatique     |
| Validation formulaires (yup)  | ✅ Présente partout              |
| Toast messages                | ✅ Feedback utilisateur cohérent |
| Realtime cleanup              | ✅ `removeChannel` présent       |
| Deep linking mentions légales | ✅ Linking.openURL fonctionnel   |

---

## 📋 CHECKLIST FINALE AVANT PUBLICATION

### 🔴 Obligatoire (Bloquant)

- [ ] Corriger `QueryClient` instancié hors du composant App
- [ ] Implémenter mot de passe oublié avec `supabase.auth.resetPasswordForEmail()`
- [ ] Supprimer ou implémenter `ForgotPasswordScreen`
- [ ] Supprimer les `console.log` de production (garder uniquement si `__DEV__`)
- [ ] Corriger double listener `AppState` (garder un seul endroit)
- [ ] Ajouter confirmation avant refus de candidature
- [ ] Await `deleteAccount()` avant `showToast` success

### 🟡 Recommandé (Amélioration qualité)

- [ ] Ajouter `React.memo()` aux composants de liste
- [ ] Mémoiser values des Providers avec `useMemo`
- [ ] Ajouter `staleTime` au QueryClient global
- [ ] Remplacer `isLoading` par `isPending` (React Query v5)
- [ ] Filtrer channel realtime messages par conversation côté global
- [ ] Implémenter ou retirer les Switch de préférences

### 🟢 Optionnel (Polish)

- [ ] Ajouter skeleton loaders au lieu de simples `<Text>Chargement...</Text>`
- [ ] AbortController pour les requêtes fetch
- [ ] Sentry/Crashlytics pour monitoring production
- [ ] Tests unitaires sur les hooks critiques

---

## 📊 RÉSUMÉ

| Catégorie    | Critique | Recommandé | Acceptable |
| ------------ | -------- | ---------- | ---------- |
| Sécurité     | 4        | 2          | -          |
| Stabilité    | 3        | 2          | -          |
| Performance  | 1        | 4          | -          |
| UX/Store     | 3        | 2          | 5          |
| React Native | 1        | 2          | 3          |

**Estimation temps de correction critique : 2-4 heures**

---

## 📝 FICHIERS CONCERNÉS PAR LES CORRECTIONS

### Critiques

- `App.tsx`
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/ForgotPasswordScreen.tsx`
- `src/screens/profile/SettingsScreen.tsx`
- `src/screens/notification/notificationScreen.tsx`
- `utils/supabase.ts`
- `src/contexts/authContext.tsx`

### Recommandés

- `src/hooks/useApply.ts`
- `src/components/AnnouncementCardList.tsx`
- `src/components/MessageBubble.tsx`
- `src/components/ConversationItem.tsx`
- `src/contexts/messageContext.tsx`
- `src/contexts/notificationContext.tsx`
- `src/screens/chat/messengingScreen.tsx`

---

_Rapport généré le 23 janvier 2026_
