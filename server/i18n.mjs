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
  }
};

export function getLang(req) {
  const header = req.headers["accept-language"] || "en";
  return header.startsWith("no") ? "no" : "en";
}

export function t(req, key) {
  const lang = getLang(req);
  return translations[lang]?.[key] ?? translations["en"][key] ?? key;
}