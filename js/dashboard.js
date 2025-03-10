function initializeDashboard() {
    const prices = document.body.querySelectorAll('.flight-pricing');

    function clickFlight(price) {
        console.log(price.getAttribute('flight-id'));
        prices.forEach(price => {
            price.removeEventListener('click', clickFlight.bind(this, price));
        });
        sessionStorage.setItem('currentFlight', price.getAttribute('flight-id'));
        showContent('flight-details-template');
    }

    prices.forEach(price => {
        price.addEventListener('click', clickFlight.bind(this, price));
    });
}
