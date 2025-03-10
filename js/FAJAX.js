class FXAMLHttpRequest {
    network = new Network();

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
        const onerror = setTimeout(() => {
            this.readyState = 4;
            this.status = 0;
            this.responseText = "Network Error";
            console.log("Network Error");
            this.handleTransmissionError(data);
            this.onreadystatechange();
        }, 6500);

        // Simuler le délai d'envoi via network.js
        this.network.sendRequest(this, (response) => {    
            
            clearTimeout(onerror);

            console.log("3", response);

            // Mise à jour de l'objet requête comme si la réponse était reçue
           this.readyState = 4; // DONE
           this.status = response.status;
           this.responseText = response.responseText;
           this.onreadystatechange();
        });
    }

    // Method to display error message on screen in case of packet loss  
        handleTransmissionError(data) {
            const message = "A problem occurred while transmitting packets.\n\n" +
                            "Would you like to try again?";
            // confirm() displays a dialog with "OK" and "Cancel"
            if (confirm(message)) {
                // User clicked "OK"
                console.log("The user wants to retry the operation.");
                this.send(data);
            } else {
                // User clicked "Cancel"
                console.log("The user refused to try again.");
            }
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