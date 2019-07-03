//tslint:disable-next-line variable-name
var Line = class LineC {

    /**
     * Line
     * @param {*} parent
     * @param {*} start
     * @param {*} end
     * @param {*} width
     * @param {*} color
     */
    constructor(parent, start, end, width = 30, color = 'rgba(206, 53, 53, 0.1)') {
        this.lineI = document.createElement('line');

        const distance = Math.sqrt(((end.x - start.x) * (end.x - start.x)) + ((end.y - start.y) * (end.y - start.y)));

        const centerX = (end.x + start.x) / 2;
        const centerY = (end.y + start.y) / 2;

        this.lineI.style.height = width + 'px';
        this.lineI.style.width = distance + 'px';
        this.lineI.style.backgroundColor = color;
        this.lineI.style.visibility = 'visible';
        this.lineI.style.position = 'fixed';

        this.lineI.style.top = centerY - (width / 2) + 'px';

        this.lineI.style.left = centerX - (distance / 2) + 'px';

        let rotation = Math.atan2(start.y - end.y, start.x - end.x);
        let degrees = (rotation * 180) / Math.PI;

        this.lineI.style.transform = `rotate(${degrees}deg)`;
        parent.appendChild(this.lineI);
    }

    remove() {
        this.lineI.remove();
    }
};