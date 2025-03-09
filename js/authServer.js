class AuthServer {
    userDB = new UserDBAPI();

    handle(request) {
        switch (request.method) { // for example -> request = {body: "{\"username\":\"yehuda\",\"password\":\"123456\"}" method: "POST" url: "/login"}
            case "POST":
                return this.handleSignup(request);
            default:
                return { status: 400, response: "Invalid Auth Request" };
        }   
    }

    handleSignup(request) {
        // On suppose que request.data contient les informations d'inscription
        const signupData = JSON.parse(request.data) || {};
        const { username, password, email } = signupData;

        // Vérification si l'utilisateur existe déjà dans la base
        if (this.userDB.dbGetUser(username)) {
            // L'utilisateur existe, on renvoie une erreur 400
            return {
                status: 200,
                responseText: "User already exists"
            };
        }
        
        // L'utilisateur n'existe pas, on l'ajoute via API-DB
        const created = this.userDB.dbCreateUser(username, password, email);
        if (created) {
            return {
                status: 200,
                responseText: JSON.stringify({ message: "User created successfully" })
            };
        } else {
            // En cas d'erreur lors de la création
            return {
                status: 500,
                responseText: JSON.stringify({ message: "Error creating user" })
            };
        }
    }
}