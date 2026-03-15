export const getAuthErrorMessage = (error: any) => {
  const message = error?.message || "";

  switch (message) {
    case "invalid_credentials":
    case "Invalid login credentials":
    case "user_not_found":
    case "User already registered":
    case "User is banned":
      return "Email ou mot de passe incorrect.";

    case "weak_password":
      return "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.";

    case "password_required":
      return "Le mot de passe est requis.";

    case "email_address_invalid":
      return "Le format de l'adresse email est invalide.";
    default:
      return "Une erreur est survenue, veuillez réessayer.";
  }
};
