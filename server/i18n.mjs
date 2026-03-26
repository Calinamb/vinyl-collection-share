const translations = {
  en: {
    error_server: "Something went wrong on the server.",
    error_not_found: "Resource not found.",
    error_username_required: "Username and password are required.",
    error_could_not_create_user: "Could not create user. Username might be taken.",
    error_login_failed: "Invalid username or password.",
    error_login_server: "Server error during login.",
    error_delete_user: "Could not delete user.",
    error_user_not_found: "User not found.",
  },
  no: {
    error_server: "Noe gikk galt på serveren.",
    error_not_found: "Ressursen ble ikke funnet.",
    error_username_required: "Brukernavn og passord er påkrevd.",
    error_could_not_create_user: "Kunne ikke opprette bruker. Brukernavnet kan være tatt.",
    error_login_failed: "Ugyldig brukernavn eller passord.",
    error_login_server: "Serverfeil under innlogging.",
    error_delete_user: "Kunne ikke slette bruker.",
    error_user_not_found: "Bruker ikke funnet.",
  },

  fr: {
  error_server: "Une erreur s'est produite sur le serveur.",
  error_not_found: "Ressource introuvable.",
  error_username_required: "Nom d'utilisateur et mot de passe requis.",
  error_could_not_create_user: "Impossible de créer l'utilisateur. Le nom est peut-être déjà pris.",
  error_login_failed: "Nom d'utilisateur ou mot de passe invalide.",
  error_login_server: "Erreur serveur lors de la connexion.",
  error_delete_user: "Impossible de supprimer l'utilisateur.",
  error_user_not_found: "Utilisateur introuvable.",
  error_fetch_community: "Impossible de récupérer les collections.",
  error_fetch_collections: "Impossible de récupérer les collections.",
  error_save_collection: "Impossible de sauvegarder la collection.",
  error_delete_collection: "Impossible de supprimer la collection.",
  error_fetch_albums: "Impossible de récupérer les albums.",
  error_save_album: "Impossible de sauvegarder l'album.",
}
};

export function getLang(req) {
  const header = (req.headers["accept-language"] || "en").toLowerCase();
  if (header.startsWith("nb") || header.startsWith("nn") || header.startsWith("no")) return "no";
  if (header.startsWith("fr")) return "fr";
  return "en";
}

export function t(req, key) {
  const lang = getLang(req);
  return translations[lang]?.[key] ?? translations["en"][key] ?? key;
}