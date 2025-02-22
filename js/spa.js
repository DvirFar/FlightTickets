const templates = document.querySelectorAll('template');

function showContent(page) {
    document.body.innerHTML = '';
    document.body.appendChild(templates[page].content.cloneNode(true));
}

showContent(0);