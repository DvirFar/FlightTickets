const templates = document.querySelectorAll('template');

function selectTemplate(page) {
    return templates.find(template => template.id == page );
}

function showContent(page) {
    document.body.innerHTML = '';
    const template = selectTemplate(page);
    document.body.appendChild(template.content.cloneNode(true));
}

showContent("login-template");