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

    networkError() {
        // error!
    }

    send(data = null) {
        this.data = data;
        const onerror = setTimeout(this.networkError, 6500);
        // Simuler le délai d'envoi via network.js
        const response = network.sendRequest(this, onerror);
        console.log(response);
        
         // Mise à jour de l'objet requête comme si la réponse était reçue
        this.readyState = 4; // DONE
        this.status = response.status;
        this.responseText = response.responseText;
        this.onreadystatechange();
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