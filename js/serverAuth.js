function handleSignup(request) {
    // On suppose que request.data contient les informations d'inscription
    const signupData = request.data || {};
    const { username, password, email } = signupData;

    // Vérification si l'utilisateur existe déjà dans la base
    if (dbGetUser(username)) {
        // L'utilisateur existe, on renvoie une erreur 400
        return {
            status: 400,
            responseText: JSON.stringify({ message: "User already exists" })
        };
    }
    
    // L'utilisateur n'existe pas, on l'ajoute via API-DB
    const created = dbCreateUser({ username, password, email });
    if (created) {
        return {
            status: 200,
            responseText: JSON.stringify({ message: "OK" })
        };
    } else {
        // En cas d'erreur lors de la création
        return {
            status: 500,
            responseText: JSON.stringify({ message: "Error creating user" })
        };
    }
}
