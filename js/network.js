// Simulated Network for Handling Communications Only
class Network {
    delayRange = { min: 1000, max: 3000 }; // délai entre 1 et 3 secondes
    dropProbability = 0.3;

    // Simule un délai aléatoire
    simulateDelay(callback, response) {
        const delay = Math.floor(Math.random() * (this.delayRange.max - this.delayRange.min + 1)) + this.delayRange.min;
        setTimeout(callback.call(this, response), delay);
    }

    sendRequest(request, onerror) {
        let responseFromServer;
        this.simulateDelay(() => {
            // Ici, en fonction de l'URL et de la méthode, on dirige la requête.
            if (request.url === "/users") {
                if (Math.random() < this.dropProbability) {
                    return;
                }
                // Appel au serveur d'authentification pour le signup
                responseFromServer = AuthServer.handle(self);
                console.log("1", responseFromServer);
                // Simuler un délai de transmission de la réponse du serveur vers le client
                this.simulateDelay(() => { 
                    clearTimeout(onerror);
                    console.log("2", responseFromServer);
                    return responseFromServer;
                }, responseFromServer);
            }
            // D'autres routes (ex: login) pourraient être ajoutées ici...
        }, responseFromServer);
        console.log("3", responseFromServer);
        
    }
}

const network = new Network();