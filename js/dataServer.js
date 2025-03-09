class DataServer {
    flightDB = new FlightDBAPI();

    handle(request) {
        switch (request.method) { 
            case "GET":
                return this.handleGet(request);
            default:
                return { status: 400, response: "Invalid Data Request" };
        }   
    }

    handleGet(request) {
        // example: URL = "/data?flID=FL1"
        const URLQuery = request.url.split("?")[1]; // "flID=FL1"
        const queryParams = URLQuery.split("&"); // ["flID=FL1"]
        const params = [];
        for (let param of queryParams) {
            params.push(param.split("="));
        }
        console.log(params);

        const flight = this.flightDB.dbGetFlight(params[0][1]);
        if (flight) {
            return {
                status: 200,
                responseText: JSON.stringify(flight)
            }
        }
        else {
            return {
                status: 200,
                responseText: JSON.stringify("Flight not found")
            }
        }
    }
}