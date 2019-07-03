function onmClick() {

    /**@type {HTMLInputElement} */
    var cp = document.querySelector('#mC123');
    cp.value = atob('am9uYXRoYW5oZWluZGxAZ214LmRl');

    cp.select();

    /* Copy the text inside the text field */
    document.execCommand('copy');

    cp.value = '';

}