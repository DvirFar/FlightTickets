// Simulated Network for Handling Communications Only
class Network {
    delayRange = { min: 1000, max: 3000 }; // délai entre 1 et 3 secondes
    dropProbability = 0.3;

    // Simule un délai aléatoire
    simulateDelay(callback) {
        const delay = Math.floor(Math.random() * (this.delayRange.max - this.delayRange.min + 1)) + this.delayRange.min;
        setTimeout(callback, delay);
    }

    sendRequest(request, callback) {
        this.simulateDelay(() => {
            // Ici, en fonction de l'URL et de la méthode, on dirige la requête.
            if (request.url === "/users") {
                if (Math.random() < this.dropProbability) { return; }

                // Appel au serveur d'authentification pour le signup
                const response = AuthServer.handle(request);
                console.log("1", response);
                // Simuler un délai de transmission de la réponse du serveur vers le client
                this.simulateDelay(() => { 
                    console.log("2", response);
                    callback(response);
                });
            }
            // D'autres routes (ex: login) pourraient être ajoutées ici...
        });        
    }
}

const network = new Network();