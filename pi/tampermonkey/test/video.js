document.body.style.backgroundColor = 'lightGray';

let vid = document.createElement('video');
vid.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
vid.volume = 0;
vid.loop = true;
document.body.appendChild(vid);