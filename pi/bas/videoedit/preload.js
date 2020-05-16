/**
 * @typedef AdjustmentBase
 * @property {boolean} original
 * @property {number} referenceId
 */
/**
 * @typedef {AdjustmentBase & {type:'text', text:string,pos:Vector2,direction?:Vector2}} textAdjust
 * @typedef {AdjustmentBase & {type:'img', src:string,pos:Vector2,direction?:Vector2}} imageADjust
 */

/**
 * @typedef {textAdjust| imageADjust } Adjustment
 */

/**
 * @typedef Frame
 * @property {number} time
 * @property {ImageData} data
 * @property {Array<Adjustment>} adjustements
 */
/**
 * @returns {Promise<{vidData:Array<Frame>,height:number,width:number,video:HTMLVideoElement}>}
 */
async function preload() {
    return new Promise((resolver) => {
        /**
         * @type {Array<Frame>}
         */
        let vidData = [];

        const video = document.createElement('video');

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.volume = 0;
        video.src = 'small.mp4';
        video.style.visibility = 'hidden';
        video.addEventListener('loadeddata', () => {
            canvas.style.width = video.videoWidth + 'px';
            canvas.style.height = video.videoHeight + 'px';
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            console.log('loadeddata');

            video.play();
            setTimeout(videoLoop, 10);
        });

        function videoLoop() {
            if(video && !video.paused && !video.ended) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                vidData.push({
                    time: video.currentTime,
                    data: context.getImageData(0, 0, canvas.width, canvas.height),
                    adjustements: []
                });
                setTimeout(videoLoop, 1000 / 30);
            } else {
                resolver({ vidData, width: canvas.width, height: canvas.height, video });
            }
        }
    });

}

