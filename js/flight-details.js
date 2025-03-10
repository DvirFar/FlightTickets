
function initializeFlightDetails () {
    const currentFlightID = sessionStorage.getItem('currentFlight');

    function makeRequests(finalCallback) {
        let responses = 0;
        let results = {};

        function handleResponse(key, data) {
            results[key] = data;
            responses++;

            if (responses === 2) {
                // Both requests are done, now execute the final callback
                finalCallback(results);
            }
        }

        const flightRequest = new FXAMLHttpRequest();
        flightRequest.onreadystatechange = function () {
            if (flightRequest.readyState === 4 && flightRequest.status === 200) {
                handleResponse("flightRequest", flightRequest.responseText);
            }
        };
        flightRequest.open('GET', `/data?flID=${currentFlightID}`);
        flightRequest.send('');

        const userRequest = new FXAMLHttpRequest();
        userRequest.onreadystatechange = function() {
            if (userRequest.readyState === 4 && userRequest.status === 200) {
                handleResponse("userRequest", userRequest.responseText);
                //appel de la fonction pour enlever les icones de chargement
                removeIconnsLoading();
            }
        };
        userRequest.open('GET', `/users/${sessionStorage.getItem('username')}/flights?flID=${currentFlightID}`);
        userRequest.send();
    }

    // fonction pour enlever les icones de chargement
    function removeIconnsLoading() {
        document.querySelectorAll(".loader-small").forEach(loader => {
        loader.style.display = "none";
    });
    }

    makeRequests(function (results) {
        console.log("Both requests finished:", results);
        let flightResponse = results["flightRequest"], userResponse = results["userRequest"];

        console.log("✅ Flight Response Received:", flightResponse);
        console.log("✅ User Response Received:", userResponse);
        createPlane(JSON.parse(flightResponse), JSON.parse(userResponse));

        const seats = document.querySelectorAll(".seat:not(.occupied)");
        const confirmButton = document.getElementById("confirm-selection");

        seats.forEach(seat => {
            seat.addEventListener("click", () => {
                seat.classList.toggle("selected");
            });
        });

        confirmButton.addEventListener("click", () => {
            const selectedSeats = document.querySelectorAll(".seat.selected");
            const selectedSeatsList = [...selectedSeats].map(seat => seat.getAttribute("data-seat"));
            
            if (selectedSeatsList.length === 0) {
                alert("No seats selected!");
            } else {
                const flightSeats = {
                    id: JSON.parse(flightResponse).id,
                    seats: selectedSeatsList
                }

                // call a function that displays a loading on the button
                showLoadingOnButton(document.getElementById('confirm-selection'));

                // Update users server
                const updateUserRequest = new FXAMLHttpRequest();
                updateUserRequest.onreadystatechange = function() {
                    if (updateUserRequest.readyState === 4 && updateUserRequest.status === 200) {
                        console.log(updateUserRequest.responseText);                            
                    }
                }
                updateUserRequest.open("PUT", `/users/${sessionStorage.getItem('username')}/flights`);
                updateUserRequest.send(JSON.stringify(flightSeats));

                // Update flights server
                const updateFlightRequest = new FXAMLHttpRequest();
                updateFlightRequest.onreadystatechange = function() {
                    if (updateFlightRequest.readyState === 4 && updateFlightRequest.status === 200) {
                        console.log(updateFlightRequest.responseText);     
                        alert("You selected: " + selectedSeatsList.join(", ")); 
                        showContent('dashboard-template');                      
                    }
                }
                updateFlightRequest.open("PUT", `/data/${currentFlightID}/seats`);
                updateFlightRequest.send(JSON.stringify(flightSeats));
            }
        });
    });

    // function to show loading on button
    function showLoadingOnButton(button) {
    let btn = button;
    
    // Add class for loading animation
    btn.classList.add("loading");
}
}

function createPlane(planeData, userData) {
    const flightSrc = document.getElementById("flight-src");
    const flightDest = document.getElementById("flight-dest");
    const flightDeparture = document.getElementById("flight-departure");
    const flightArrival = document.getElementById("flight-arrival");
    const planeTitle = document.getElementById("flight-id");
    const plane = document.getElementById("plane");

    flightSrc.innerHTML = planeData.src;
    flightDest.innerHTML = planeData.dest;
    flightDeparture.innerHTML = new Date(Date.parse(planeData.timeDepart)).toLocaleString();
    flightArrival.innerHTML = new Date(Date.parse(planeData.timeArrival)).toLocaleString();
    planeTitle.innerHTML = planeData.id;

    const colLabels = createCols(planeData.numCols);
    
    const rowLabelsLeft = createRows(planeData.numRows);
    rowLabelsLeft.classList.add('left');
    const rowLabelsRight = createRows(planeData.numRows);
    rowLabelsRight.classList.add('right');

    //console.log("Data: ", JSON.parse(planeData));
    //console.log("Seats: ", JSON.parse(planeData).occupiedSeats);

    console.log(userData.flights);
    
    const userSeats = userData.flights.find(flight => flight.id === planeData.id)?.seats;
    //console.log(userData.flights[0].seats);
    console.log("userSeats: ", userSeats);
    
    const seatMap = createSeats(planeData.numCols, planeData.numRows, planeData?.occupiedSeats, userSeats);

    plane.innerHTML = '';

    const repeatCols = "col-list ".repeat(planeData.numCols);
    const repeatSeats = "seat-map ".repeat(planeData.numCols);
    const seatsRows = `"row-list-left ${repeatSeats}row-list-right"\n`.repeat(planeData.numRows);
    
    const gridTemplate = `". ${repeatCols}."\n${seatsRows}`;
    
    plane.style.gridTemplateAreas = gridTemplate;
    plane.appendChild(colLabels);
    plane.appendChild(rowLabelsLeft);
    plane.appendChild(seatMap);
    plane.appendChild(rowLabelsRight);
}

function createCols(numCols) {
    let label;

    const colLabels = document.createElement('div');
    colLabels.classList.add('col-labels');
    colLabels.style.gridTemplateColumns = `repeat(${numCols}, 40px)`;

    for (const i of Array(numCols).keys()) {
        label = document.createElement('div');
        label.classList.add('label');
        label.textContent = String.fromCharCode(('A'.charCodeAt(0) + i));
        colLabels.appendChild(label);
    }

    return colLabels;
}

function createRows(numRows) {
    let label;

    const rowLabels = document.createElement('div');
    rowLabels.classList.add('row-labels');
    rowLabels.style.gridTemplateRows = `repeat(${numRows}, 40px`;

    for (const i of Array(numRows).keys()) {
        label = document.createElement('div');
        label.classList.add('label');
        label.textContent = i + 1;
        rowLabels.appendChild(label);
    }

    return rowLabels;
}

function createSeats(numCols, numRows, occupiedSeats, userSeats) {
    const seatMap = document.createElement('div');
    seatMap.id = 'seat-map';
    seatMap.style.gridTemplateColumns = `repeat(${numCols}, 40px)`;
    let seat;
    
    for (const i of Array(numRows).keys()) {
        for (const j of Array(numCols).keys()) {
            seat = document.createElement('div');
            seat.classList.add('seat');
            seat.setAttribute('data-seat', `${i + 1}${String.fromCharCode(('A'.charCodeAt(0) + j))}`);

            if (userSeats?.includes(seat.getAttribute('data-seat'))) {
                seat.classList.add('selected');
            }
            else if (occupiedSeats?.includes(seat.getAttribute('data-seat'))) {
                seat.classList.add('occupied');
            }

            seatMap.appendChild(seat);
        }
    }

    return seatMap;
}