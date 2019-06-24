
document.querySelectorAll('.details')
    .forEach(el => {
        el.addEventListener('click', (event) => {
            /**@type {any} */
            let detailsButton = event.currentTarget;
            const child = detailsButton.parentElement.querySelector('.detailsContent');
            debugger;
            child.style.display = child.style.display === 'inherit' ? 'none' : 'inherit';
        });
    });