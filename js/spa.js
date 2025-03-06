const templates = document.querySelectorAll('template');

function selectTemplate(page) {
    return Array.prototype.find.call(templates, template => template.id == page );
}

function showContent(page) {
    document.body.innerHTML = '';
    const template = selectTemplate(page);
    document.body.appendChild(template.content.cloneNode(true));
}

//showContent("login-template");
//showContent("dashboard-template");
showContent('flight-details-template');