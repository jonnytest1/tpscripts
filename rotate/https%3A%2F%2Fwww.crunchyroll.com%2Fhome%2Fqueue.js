


function rek(array = find("queue-item"), index = 0) {
    if (index < array.length) {
        let i = array[index];
        let videoElement = find("episode-progress", i);
        if (videoElement.style.width.replace("%", "") - 0 < 1) {
            open(find("episode", i).href);
            setTimeout(rek, 500, array, index + 1);
        }
        else {
            rek(array, index + 1);
        }
    }
}
setTimeout(rek, 2000);