
function initializeFlightDetails () {
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
        }
    });
}
