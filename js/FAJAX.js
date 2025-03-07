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
        this.onreadystatechange();
    }

    send(data = null) {
        this.data = data;
        const self = this;
        // Simuler le délai d'envoi via network.js
        Network.send(self)
            .then(response => {
                // Mise à jour de l'objet requête comme si la réponse était reçue
                self.readyState = 4; // DONE
                self.status = response.status;
                self.responseText = response.responseText;
                if (typeof self.onreadystatechange === "function") {
                    self.onreadystatechange();
                }
            })
            .catch(error => {
                // En cas d'erreur réseau
                self.readyState = 4; // DONE
                self.status = error.status;
                self.responseText = error.responseText;
                if (typeof self.onreadystatechange === "function") {
                    self.onreadystatechange();
                }
            });

            // D'autres routes (ex: login) pourraient être ajoutées ici...
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