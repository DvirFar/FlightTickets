class FXAMLHttpRequest {
    constructor() {
        this.readyState = 0;      // 0: UNSENT
        this.status = 0;          // 200: OK, 400: Erreur client, 500: Erreur serveur
        this.responseText = "";
        this.onreadystatechange = null;
        this.method = "";
        this.url = "";
        this.data = null;         // Contiendra les données de la requête (ex: {username, password, email})
    }

    open(method, url) {
        this.method = method;
        this.url = url;
        this.readyState = 1; // 1: OPENED
    }

    send(data = null) {
        this.data = data;
        const self = this;
        // Simuler le délai d'envoi via network.js
        simulateDelay(() => {
            // Ici, en fonction de l'URL et de la méthode, on dirige la requête.
            if (self.url === "/DB-API/data" && self.method === "POST") {
                // Appel au serveur d'authentification pour le signup
                const responseFromServer = handleSignup(self);
                // Simuler un délai de transmission de la réponse du serveur vers le client
                simulateDelay(() => {
                    // Mise à jour de l'objet requête comme si la réponse était reçue
                    self.readyState = 4; // DONE
                    self.status = responseFromServer.status;
                    self.responseText = responseFromServer.responseText;
                    if (typeof self.onreadystatechange === "function") {
                        self.onreadystatechange();
                    }
                });
            }
            // D'autres routes (ex: login) pourraient être ajoutées ici...
        });
    }

    setRequestHeader(header, value) {
        // Simulate setting request headers
        this.headers = this.headers || {};
        this.headers[header] = value;
    }

    getResponseHeader(header) {
        // Simulate getting response headers
        return this.headers ? this.headers[header] : null;
    }

    abort() {
        // Réinitialisation de l'état en cas d'annulation
        this.readyState = 0;
        this.status = 0;
        this.responseText = "";
    }
}