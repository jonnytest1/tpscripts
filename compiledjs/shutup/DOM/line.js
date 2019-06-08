class Line {
    /**
     * Line
     * @param {*} parent
     * @param {*} start
     * @param {*} end
     * @param {*} width
     * @param {*} color
     */
    constructor(parent, start, end, width = 30, color = "rgba(206, 53, 53, 0.1)") {
        const lineI = document.createElement("line");
        const distance = Math.sqrt(((end.x - start.x) * (end.x - start.x)) + ((end.y - start.y) * (end.y - start.y)));
        const centerX = (end.x + start.x) / 2;
        const centerY = (end.y + start.y) / 2;
        lineI.style.height = width + "px";
        lineI.style.width = distance + "px";
        lineI.style.backgroundColor = color;
        lineI.style.visibility = "visible";
        lineI.style.position = "fixed";
        lineI.style.top = centerY - (width / 2) + "px";
        lineI.style.left = centerX - (distance / 2) + "px";
        let rotation = Math.atan2(start.y - end.y, start.x - end.x);
        let degrees = (rotation * 180) / Math.PI;
        lineI.style.transform = "rotate(" + degrees + "deg)";
        parent.appendChild(lineI);
        return lineI;
    }
}
