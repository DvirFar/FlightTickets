const templates = document.querySelectorAll('template');
const navbarElement = document.getElementById('navbar-template');

function selectTemplate(page) {
    return Array.prototype.find.call(templates, template => template.id == page );
}

function showContent(page) {
    document.body.innerHTML = '';
    if (page != "login-template" && page != "signup-template") {
        document.body.appendChild(navbarElement.content.cloneNode(true));
    }

    const template = selectTemplate(page);
    document.body.appendChild(template.content.cloneNode(true));
}

//showContent("signup-template");
//showContent("dashboard-template");
showContent('flight-details-template');