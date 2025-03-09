class User {
    //static idCount = 0;

    constructor(username, password, email) {
        //this._id = User.idCount++;
        //console.log(this._id);
        this._username = username;
        this._password = password;
        this._email = email;
        this.flights = JSON.stringify([]);
    }

    //get id() { return this._id; }
    get username() { return this._username; }
    get password() { return this._password; }
    get email() { return this._email; }

    toJSON() {
        return {
            username: this._username,
            password: this._password,
            email: this._email,
            flights: this.flights
        }
    }
}

class Flight {
    constructor(id, src, dest, numRows, numCols, timeDepart, timeArrival) {
        this._id = id;
        this._src = src;
        this._dest = dest;
        this._numRows = numRows;
        this._numCols = numCols;
        this._timeDepart = timeDepart;
        this._timeArrival = timeArrival;
    }

    get id() { return this._id; }
    get src() { return this._src; }
    get dest() { return this._dest; }
    get numRows() { return this._numRows; }
    get numCols() { return this._numCols; }
    get timeDepart() { return this._timeDepart; }
    get timeArrival() { return this._timeArrival; }

    toJSON() {
        return {
            id: this._id,
            src: this._src,
            dest: this._dest,
            numRows: this._numRows,
            numCols: this._numCols,
            timeDepart: this._timeDepart,
            timeArrival: this._timeArrival
        }
    }
}

const initUsers = function initializeUsers() {
    if (!localStorage.getItem('usernameList')) {
        localStorage.setItem('usernameList', JSON.stringify([]));
    }
}()

const initFlights = function initializeFlights() {
    if (!localStorage.getItem('flightsList')) {
        localStorage.setItem('flightsList', JSON.stringify([]));
    }
}()

class UserDBAPI {
    dbCreateUser(username, password, email) {
        const user = new User(username, password, email);
        localStorage.setItem(username, JSON.stringify(user));
    
        const usernameList = JSON.parse(localStorage.getItem('usernameList'));
        usernameList.push(username);
        localStorage.setItem('usernameList', JSON.stringify(usernameList));
        return true;
    }
    
    dbGetAllUsers() {
        const usernameList = JSON.parse(localStorage.getItem('usernameList'));
        const users = [];
        let userDB;
    
        usernameList.forEach(user => {
            userDB = JSON.parse(localStorage.getItem(JSON.parse(user)));
            users.push(userDB);
        });
    
        return users;
    }
    
    dbGetUser(username) {
        const usernameList = JSON.parse(localStorage.getItem('usernameList'));
        
        for (let user of usernameList) {
            if (user === username) {
                return JSON.parse(localStorage.getItem(user));
            }
        }
    
        return 0;
    }
    
    dbUpdateUser(username, info) {
        const usernameList = JSON.parse(localStorage.getItem('usernameList'));
    
        usernameList.forEach(user => {
            if (user === username) {
                localStorage.setItem(user, JSON.stringify(info));
                return;
            }
        });
    }
    
    dbDeleteUser(username) {
        const usernameList = JSON.parse(localStorage.getItem('usernameList'));
    
        usernameList.forEach(user => {
            if (user === username) {
                localStorage.removeItem(user);
                usernameList.filter(name => name !== username);
                localStorage.setItem('usernameList', JSON.stringify(usernameList));
                return;
            }
        });
    }
}

class FlightDBAPI {
    dbCreateFlight(id, src, dest, numRows, numCols, timeDepart, timeArrival) {
        const flight = new Flight(id, src, dest, numRows, numCols, timeDepart, timeArrival);
        localStorage.setItem(id, JSON.stringify(flight));
    
        const flightsList = JSON.parse(localStorage.getItem('flightsList'));
        flightsList.push(id);
        localStorage.setItem('flightsList', JSON.stringify(flightsList));
        return true;
    }
    
    dbGetAllFlights() {
        const flightsList = JSON.parse(localStorage.getItem('flightsList'));
        const flights = [];
        let flightDB;
    
        flightsList.forEach(flight => {
            flightDB = JSON.parse(localStorage.getItem(JSON.parse(flight)));
            flights.push(flightDB);
        });
    
        return flights;
    }
    
    dbGetFlight(getFlight) {
        const flightsList = JSON.parse(localStorage.getItem('flightsList'));
        for (let flight of flightsList) {
            if (flight === getFlight) {
                return JSON.parse(localStorage.getItem(flight));
            }
        }
    
        return 0;
    }
    
    dbUpdateFlight(updateFlight, info) {
        const flightsList = JSON.parse(localStorage.getItem('flightsList'));
    
        flightsList.forEach(flight => {
            if (flight === updateFlight) {
                localStorage.setItem(flight, JSON.stringify(info));
                return;
            }
        });
    }
    
    dbDeleteFlight(deleteFlight) {
        const flightsList = JSON.parse(localStorage.getItem('flightsList'));
    
        flightsList.forEach(flight => {
            if (flight === deleteFlight) {
                localStorage.removeItem(flight);
                flightsList.filter(flight => flight !== deleteFlight);
                localStorage.setItem('flightsList', JSON.stringify(flightsList));
                return;
            }
        });
    }

    generateFlights = function() {
        const destinations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
        const sources = ['Miami', 'Dallas', 'San Francisco', 'Seattle', 'Denver', 'Boston'];
    
        for (let i = 0; i < 6; i++) {
            const id = `FL${i + 1}`;
            const src = sources[Math.floor(Math.random() * sources.length)];
            const dest = destinations[Math.floor(Math.random() * destinations.length)];
            const numRows = Math.floor(Math.random() * 20) + 10;
            const numCols = Math.floor(Math.random() * 6) + 4;
            const timeDepart = new Date(Date.now() + Math.floor(Math.random() * 1000000000)).toISOString();
            const timeArrival = new Date(Date.now() + Math.floor(Math.random() * 1000000000) + 10000000).toISOString();
    
            this.dbCreateFlight(id, src, dest, numRows, numCols, timeDepart, timeArrival);
        }
    }
}