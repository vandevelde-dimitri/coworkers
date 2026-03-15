export const getAuthErrorMessage = (error: any) => {
  switch (error?.message) {
    case "invalid_credentials":
      return "Email ou mot de passe incorrect.";
    case "Invalid login credentials":
      return "Email ou mot de passe incorrect.";
    case "user_not_found":
      return "Aucun compte associé à cet email.";
    case "User already registered":
      return "Cet email est déjà utilisé.";
    case "weak_password":
      return "Le mot de passe doit contenir au moins 8 caractères.";
    case "User is banned":
      return "Votre compte a été restreint. Veuillez contacter le support pour plus d'informations.";
    case "password_required":
      return "Le mot de passe est requis.";
    default:
      return "Une erreur est survenue, veuillez réessayer.";
  }
};
