class AuthServer {
    userDB = new UserDBAPI();

    handle(request) {
        switch (request.method) { // for example -> request = {body: "{\"username\":\"yehuda\",\"password\":\"123456\"}" method: "POST" url: "/login"}
            case "GET":
                return this.handleLogin(request);
            case "POST":
                return this.handleSignup(request);
            case "PUT":
                return this.handleUpdates(request);
            default:
                return { status: 400, response: "Invalid Auth Request" };
        }   
    }

    handleLogin(request) {
        let _, username;
        [ _, _, username ] = request.url.split("/");

        const userInfo = this.userDB.dbGetUser(username);
        if (!userInfo) {
            return {
                status: 404,
                responseText: JSON.stringify("User doesn't exist")
            }
        }
        else {
            return {
                status: 200,
                responseText: JSON.stringify(userInfo)
            }
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

    handleUpdates(request) {
        let _, username, info;
        [ _, _, username, info ] = request.url.split("/");

        const userInfo = this.userDB.dbGetUser(username);
        if (!userInfo) {
            return {
                status: 404,
                responseText: JSON.stringify("User doesn't exist")
            }
        }
        

        if (info === "flights") {
            const updateFlight = JSON.parse(request.data);
            const userFlights = userInfo.flights;
            const updatedUserFlights = [];
            let isUpdated = false;
            
            for (let flight of userFlights) {
                console.log("flight: ", flight);
                console.log("updateFlight: ", updateFlight);
                
                
                if (flight.id === updateFlight.id) {
                    updatedUserFlights.push(updateFlight);
                    isUpdated = true;
                }
                else {
                    updatedUserFlights.push(flight);
                }
            }
            if (!isUpdated) updatedUserFlights.push(updateFlight);

            userInfo.flights = updatedUserFlights;
            console.log("Updated userInfo: ", userInfo);
            
            this.userDB.dbUpdateUser(username, userInfo);

            return {
                status: 200,
                responseText: JSON.stringify("Successfully updated user")
            }
        }
    }
}