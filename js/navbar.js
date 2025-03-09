function initializeNavbar() {
    const appIcon = document.querySelector('#app-icon');
    const logoutButton = document.querySelector('.logout');
    const userProfile = document.querySelector('#user-icon');
    const userHello = document.querySelector('#user-welcome');

    function navbarClick(dest) {
        userProfile.removeEventListener('click', navbarClick.bind(this, 'user-info-template'));
        logoutButton.removeEventListener('click', handleLogout);
        appIcon.removeEventListener('click', navbarClick.bind(this, 'dashboard-template'));

        showContent(dest);
    }

    function handleLogout() {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        navbarClick("login-template");
    }

    userProfile.addEventListener('click', navbarClick.bind(this, 'user-info-template'));
    logoutButton.addEventListener('click', handleLogout);
    appIcon.addEventListener('click', navbarClick.bind(this, 'dashboard-template'));
    userHello.textContent = `Hello, ${sessionStorage.getItem('username')}`;
}