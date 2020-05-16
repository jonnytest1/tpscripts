
/// <reference path="preload.js"/>

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#canvas');
/**
 * @type {CanvasRenderingContext2D}
 */
var context;

const xStart = 0;
const yStart = 0;
context = canvas.getContext('2d');
const loadin = setInterval(() => setLloading(Date.now() / 100 % 360), 100);
preload()
	.then(loadedData => {
		canvas.height = loadedData.height;
		canvas.width = loadedData.width;
		canvas.style.height = loadedData.height + 'px';
		canvas.style.width = loadedData.width + 'px';
		currentEntryIndex = 1;
		vidData = loadedData.vidData;
		clearInterval(loadin);
		drawCurrent(loadedData.vidData[1], true);
		new Notification('preloaded video');
		console.log('loaded');

		slider.addEventListener('input', e => {
			const time = (+slider.value / 100) * loadedData.video.duration;

			for(let i = 0; i < loadedData.vidData.length; i++) {
				const entry = loadedData.vidData[i];
				if(time < entry.time) {
					currentEntryIndex = i;
					drawCurrent(loadedData.vidData[i], true);
					break;
				}
			}

		});
		/**
		 * @type {HTMLButtonElement}
		 */
		const runButton = document.querySelector('button#run');
		runButton.onclick = play;

		function play() {
			var finalStream = new MediaStream();
			// @ts-ignore
			loadedData.video.captureStream()
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

			loadedData.video.currentTime = 0;
			loadedData.video.play();
			render();

			function render() {
				if(loadedData.video && !loadedData.video.paused && !loadedData.video.ended) {
					const time = loadedData.video.currentTime;
					for(let i = 0; i < vidData.length; i++) {
						const entry = vidData[i];
						if(time < entry.time) {
							drawCurrent(vidData[i], false);
							break;
						}
					}
					setTimeout(render, 10);
				}

			}
		}
	});

/**
 * @type {Array<Frame>}
 */
let vidData = [];

function setLloading(angle = 0) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.arc(canvas.width / 2, canvas.height / 2, 10, angle, angle + Math.PI);
	context.stroke();
}

/**
 * @type {HTMLInputElement}
 */
const slider = document.querySelector('#slider');

/**
 * @type {number}
 */
var currentEntryIndex;
var addingTExt = false;

/**
 *
 * @param {Frame} current
 */
function drawCurrent(current, preview) {
	context.putImageData(current.data, xStart, yStart);

	for(const adjustment of current.adjustements) {
		switch(adjustment.type) {
			case 'text':
				context.fillText(adjustment.text, adjustment.pos.x, adjustment.pos.y);

				if(preview && adjustment.direction) {
					context.moveTo(adjustment.pos.x, adjustment.pos.y);
					context.lineWidth = 1;
					context.strokeStyle = 'red';
					const finish = adjustment.pos.added(adjustment.direction);
					context.lineTo(finish.x, finish.y);
					context.stroke();
				}
				break;
			default:
				throw 'not implemented';
		}
	}
}
function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();

	return new Vector2(evt.offsetX, evt.offsetY);
	//return new Vector2(evt.clientX - rect.left, evt.clientY - rect.top);

}
let mouseDownEvent;

canvas.onmousedown = e => {
	mouseDownEvent = e;
};

canvas.onmouseup = event => {
	if(addingTExt) {
		if(currentEntryIndex !== undefined) {
			const position = getMousePos(mouseDownEvent);

			const uuid = Math.random() * 1000000;
			/**
			 * @type {textAdjust}
			 */
			const adjustment = { type: 'text', text: 'hallo', pos: position, original: true, referenceId: uuid };
			const direction = getMousePos(event).minus(position);
			if(mouseDownEvent && direction.magnitude() > 0) {
				let pos = position.added(direction.divided(10));
				for(let i = currentEntryIndex + 1; i < vidData.length; i++) {
					vidData[i].adjustements.push({ ...adjustment, original: false, pos: pos });
					pos = pos.added(direction.divided(10));
				}
				adjustment.direction = direction;
				mouseDownEvent = undefined;
			}

			vidData[currentEntryIndex].adjustements.push(adjustment);
			drawCurrent(vidData[currentEntryIndex], true);
		}
		addingTExt = false;
	}
};

canvas.onmousemove = e => console.log(e.offsetX, e.offsetY);

function addText() {
	addingTExt = true;

}
/*
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

			for(let i = 0; i < vidData.length; i++) {
				const entry = vidData[i];
				if(time < entry.time) {
					drawCurrent(vidData[i], false);
					break;
				}
			}

			setTimeout(render, 10);
		} else {
			mediaRecorder.save();
		}

	}
}*/