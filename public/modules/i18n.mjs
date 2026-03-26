const translations = {
  en: {
    // Register
    error_fill_fields: "Please fill in all fields.",
    error_agree_terms: "You must agree to the terms.",
    register_success: "User created successfully! Redirecting...",
    error_register_failed: "Registration failed. Please try again.",
    error_server: "Server error. Try again later.",

    // Login
    error_fill_login: "Please enter both username and password.",
    login_success: "Logged in! Redirecting...",
    error_login_failed: "Login failed. Please try again.",
    error_no_user_id: "Error: Could not retrieve user ID from server.",
    error_connection: "Connection error. Is the server running?",

    // Collections
    my_collections: "My Vinyl Collections",
    community: "Vinyl Community",
    nav_community: "Community",
    nav_my_collection: "My Collection",
    nav_logout: "Log Out",
    nav_delete_account: "Delete Account",
    confirm_delete_account: "Are you sure you want to delete your account? This will delete all your collections and cannot be undone.",
    error_delete_account: "Could not delete account.",
    confirm_delete_collection: "Are you sure?",
    no_albums: "No albums in this collection yet.",
    loading_albums: "Loading albums...",
    add_vinyl: "Add Vinyl",
    create_collection: "Create Collection",
    new_collection_placeholder: "New Collection Title",
    album_title_placeholder: "Album Title",
    artist_placeholder: "Artist Name",
    open: "Open",
    back: "← Back",
    albums_count: "albums",
    by: "by",

    users_title: "Users",
    create_user_title: "Create User",
    username_label: "Username:",
    consent_label: "I accept Terms of Service & Privacy Policy",
    create_user_btn: "Create",
    delete_btn: "Delete",
    edit_label: "Edit",
    save_btn: "Save",
  },
  no: {
    // Register
    error_fill_fields: "Vennligst fyll inn alle feltene.",
    error_agree_terms: "Du må godta vilkårene.",
    register_success: "Bruker opprettet! Omdirigerer...",
    error_register_failed: "Registrering feilet. Prøv igjen.",
    error_server: "Serverfeil. Prøv igjen senere.",

    // Login
    error_fill_login: "Vennligst skriv inn brukernavn og passord.",
    login_success: "Innlogget! Omdirigerer...",
    error_login_failed: "Innlogging feilet. Prøv igjen.",
    error_no_user_id: "Feil: Kunne ikke hente bruker-ID fra serveren.",
    error_connection: "Tilkoblingsfeil. Kjører serveren?",

    // Collections
    my_collections: "Mine Vinyl-samlinger",
    community: "Vinyl-fellesskap",
    nav_community: "Fellesskap",
    nav_my_collection: "Min Samling",
    nav_logout: "Logg Ut",
    nav_delete_account: "Slett Konto",
    confirm_delete_account: "Er du sikker på at du vil slette kontoen din? Dette sletter alle dine samlinger og kan ikke angres.",
    error_delete_account: "Kunne ikke slette konto.",
    confirm_delete_collection: "Er du sikker?",
    no_albums: "Ingen album i denne samlingen ennå.",
    loading_albums: "Laster album...",
    add_vinyl: "Legg til Vinyl",
    create_collection: "Opprett Samling",
    new_collection_placeholder: "Tittel på ny samling",
    album_title_placeholder: "Albumtittel",
    artist_placeholder: "Artistnavn",
    open: "Åpne",
    back: "← Tilbake",
    albums_count: "album",
    by: "av",

    users_title: "Brukere",
    create_user_title: "Opprett Bruker",
    username_label: "Brukernavn:",
    consent_label: "Jeg godtar vilkår og personvernerklæring",
    create_user_btn: "Opprett",
    delete_btn: "Slett",
    edit_label: "Rediger",
    save_btn: "Lagre",
  }
};

export function getLang() {
  return navigator.language?.startsWith("no") ? "no" : "en";
}

export function t(key) {
  const lang = getLang();
  return translations[lang]?.[key] ?? translations["en"][key] ?? key;
}