
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#canvas');
/**
 * @type {CanvasRenderingContext2D}
 */
var context;
var video;

const xStart = 0;
const yStart = 0;
const xEnd = +canvas.style.width.replace('px', '') / 1.5;
const yEnd = +canvas.style.height.replace('px', '') / 1.5;
context = canvas.getContext('2d');

let vidData = [];

video = document.createElement('video');
video.volume = 0;
video.src = 'small.mp4';
video.style.visibility = 'hidden';
video.addEventListener('loadeddata', () => {
	console.log('loadeddata');
	video.play();
	setTimeout(videoLoop, 10);
});
/**
 * @type {HTMLInputElement}
 */
const slider = document.querySelector('#slider');

var currentEntry;
var addingTExt = false;

function videoLoop() {
	if(video && !video.paused && !video.ended) {
		context.drawImage(video, xStart, yStart, xEnd - xStart, yEnd - yStart);
		vidData.push({
			time: video.currentTime,
			data: context.getImageData(xStart, yStart, xEnd - xStart, yEnd - yStart)
		});
		if(!currentEntry) {
			currentEntry = vidData[0];
		}
		setTimeout(videoLoop, 1000 / 30);
	} else {
		console.log('loaded');
		slider.addEventListener('input', e => {
			const time = (+slider.value / 100) * video.duration;

			for(let entry of vidData) {
				if(time < entry.time) {
					currentEntry = entry;
					drawCurrent();
					break;
				}
			}

		});
	}
}

function drawCurrent() {
	context.putImageData(currentEntry.data, xStart, yStart);
	if(currentEntry.text) {
		context.fillText(currentEntry.text.text, currentEntry.text.x, currentEntry.text.y);
	}
}

canvas.onclick = event => {
	if(addingTExt) {
		if(currentEntry) {
			currentEntry.text = { text: 'hallo', x: event.offsetX, y: event.offsetY };
			drawCurrent();
		}
		addingTExt = false;
	}
	debugger;

};

function addText() {
	addingTExt = true;

}

function download() {

	var finalStream = new MediaStream();
	video.captureStream()
		.getAudioTracks()
		.forEach((track) => {
			finalStream.addTrack(track);
		});

	// @ts-ignore
	canvas.captureStream()
		.getVideoTracks()
		.forEach((track) => {
			finalStream.addTrack(track);
		});

	video.currentTime = 0;
	video.play();

	// @ts-ignore
	var mediaRecorder = new MediaStreamRecorder(finalStream);
	mediaRecorder.mimeType = 'video/webm';
	mediaRecorder.start(3000);
	video.play();
	render();

	function render() {
		if(video && !video.paused && !video.ended) {
			console.log('loaded');

			const time = video.currentTime;

			for(let entry of vidData) {
				if(time < entry.time) {
					currentEntry = entry;
					drawCurrent();
					break;
				}
			}
			setTimeout(render, 10);
		} else {
			mediaRecorder.save();
		}

	}
}