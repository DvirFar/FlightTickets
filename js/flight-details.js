
function initializeFlightDetails () {
    const request = new FXAMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            const response = JSON.parse(request.responseText);
            console.log("✅ Response Received:", response);
            createPlane(response);

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
                    alert("You selected: " + selectedSeatsList.join(", "));
                    // Here you can send data to your backend or update localStorage
                    const flightSeats = {
                        id: response.id,
                        seats: JSON.stringify(selectedSeatsList)
                    }

                    const updateUserRequest = new FXAMLHttpRequest();
                    updateUserRequest.onreadystatechange = function() {
                        if (updateUserRequest.readyState === 4 && updateUserRequest.status === 200) {
                            console.log(updateUserRequest.responseText);                            
                        }
                    }
                    updateUserRequest.open("PUT", `/users/${sessionStorage.getItem('username')}/flights`);
                    updateUserRequest.send(JSON.stringify(flightSeats));

                    const updateFlightRequest = new FXAMLHttpRequest();
                    updateFlightRequest.onreadystatechange = function() {
                        if (updateFlightRequest.readyState === 4 && updateFlightRequest.status === 200) {
                            console.log(updateFlightRequest.responseText);                            
                        }
                    }
                    updateFlightRequest.open("PUT", `/data/FL1/seats`);
                    updateFlightRequest.send(JSON.stringify(flightSeats));
                }
            });
        }
    }
    request.open('GET', '/data?flID=FL1');
    request.send('');
}

function createPlane(planeData) {
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

    const seatMap = createSeats(planeData.numCols, planeData.numRows, JSON.parse(planeData.occupiedSeats));

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

function createSeats(numCols, numRows, seats) {
    const seatMap = document.createElement('div');
    seatMap.id = 'seat-map';
    seatMap.style.gridTemplateColumns = `repeat(${numCols}, 40px)`;
    let seat;

    for (const i of Array(numRows).keys()) {
        for (const j of Array(numCols).keys()) {
            seat = document.createElement('div');
            seat.classList.add('seat');
            seat.setAttribute('data-seat', `${i + 1}${String.fromCharCode(('A'.charCodeAt(0) + j))}`);
            if (seat.getAttribute('data-seat') in seats) seat.classList.add('occupied');

            seatMap.appendChild(seat);
        }
    }

    return seatMap;
}