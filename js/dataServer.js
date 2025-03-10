class DataServer {
    flightDB = new FlightDBAPI();

    handle(request) {
        switch (request.method) { 
            case "GET":
                return this.handleGet(request);
            case "PUT":
                return this.handlePut(request);
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

    handlePut(request) {
        let _, flightID, info;
        [ _, _, flightID, info ] = request.url.split("/");

        const flight = this.flightDB.dbGetFlight(flightID);
        if (!flight) {
            return {
                status: 404,
                responseText: JSON.stringify("Flight not found")
            }
        }

        if (info === "seats") {
            const data = JSON.parse(request.data);
            const occupied = flight.occupiedSeats;
            const combinedSeats = JSON.parse(data.seats).concat(occupied);

            flight.occupiedSeats = combinedSeats;
            console.log("Updates flight: ", flight);
            
            this.flightDB.dbUpdateFlight(flightID, flight);

            return {
                status: 200,
                responseText: JSON.stringify("Successfully updates flight")
            }
        }

    }
}