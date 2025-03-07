// Simulated Network for Handling Communications Only
class Network {
    static send(request) {
        return new Promise((resolve, reject) => {
            const delay = Math.random() * 200 + 100; // 1 to 3 seconds delay
            const failureRate = 0.0 // TO DO 10% to 50% failure probability

            setTimeout(() => {
                if (Math.random() < failureRate) { // Simulating network failure
                    reject({ status: 500, response: "Network Error" });
                    return;
                }

                // Route request to the appropriate server
                if (request.url.startsWith("/users")  /*|| request.url.startsWith("/register")*/) {
                    resolve(serverAuth.handle(request));
                } else {
                    resolve(serverData.handle(request));
                }
            }, delay);
        });
    }
}