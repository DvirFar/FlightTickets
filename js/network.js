// Simulated Network for Handling Communications Only
class Network {
    authServer = new AuthServer();
    dataServer = new DataServer();

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
            if (request.url.startsWith("/users")) {
                if (Math.random() < this.dropProbability) { return; }

                // Appel au serveur d'authentification pour le signup
                const response = this.authServer.handle(request);
                // Simuler un délai de transmission de la réponse du serveur vers le client
                this.simulateDelay(() => {
                    callback(response);
                });
            }
            else if (request.url.startsWith("/data")) {
                if (Math.random() < this.dropProbability) { return; }

                // Appel au serveur d'authentification pour le signup
                const response = this.dataServer.handle(request);
                // Simuler un délai de transmission de la réponse du serveur vers le client
                this.simulateDelay(() => {
                    callback(response);
                });
            }
            // D'autres routes (ex: login) pourraient être ajoutées ici...
        });        
    }
}