let adults = 1, children = 0;

function initializeDashboard() {
    adults = 1, children = 0;
}

function changeCount(type, delta) {
    if (type === 'adults') {
        adults = Math.max(1, adults + delta);
        document.getElementById('adultsCount').textContent = adults;
    } else {
        children = Math.max(0, children + delta);
        document.getElementById('childrenCount').textContent = children;
    }
    updateTravelerText();
}

function updateTravelerText() {
    document.getElementById('travelerBtn').textContent = `${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children > 1 ? 'ren' : ''}`;
}
