/**
 * @typedef {HTMLElement &{
 *  html:string
 * }} HTMLIncludeElement
 */
document.querySelectorAll('include')
    .forEach(/**@param {HTMLIncludeElement} el */el => {
        if(el.getAttribute('html')) {
            fetch(el.getAttribute('html'))
                .then(response => response.text())
                .then(text => el.innerHTML = text);
        }
    });