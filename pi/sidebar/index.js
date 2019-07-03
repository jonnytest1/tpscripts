function sideBarSwitch(e) {
    /**@type {HTMLElement} */
    const menuWrapper = document.querySelector('#menuWrapper');

    if(menuWrapper.className === 'enabled') {
        menuWrapper.className = '';
        menuWrapper.parentElement.classList.remove('enabled');
    } else {
        menuWrapper.className = 'enabled';
        menuWrapper.parentElement.classList.add('enabled');
    }

}

fetch('/sidebar')
    .then(res => res.text())
    .then(text => {
        if(![...document.body.children].some(child => child.className.includes('sidebar'))) {
            const sidebar = document.createElement('div');
            sidebar.className = 'sidebar';
            sidebar.innerHTML = text;
            document.body.appendChild(sidebar);
        }
    });