
window.p5a = {
    await: async () => {
        return new Promise((res) => {
            (function check() {
                if (window.p5 && window.p5.Vector) {
                    res();
                } else {
                    setTimeout(check, 50);
                }
            })();

        });
    },
    outOfBounds: (pos) => pos.x < 0 || pos.y < 0 || pos.y > window.innerHeight - 6 || pos.x > window.innerWidth - 6,
    ln: (v1, v2) => line(v1.x, v1.y, v2.x, v2.y),
    tr: (v1, v2, v3) => { triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y); },
    rct: (pos, width, height, ...args) => { rect(pos.x, pos.y, width, height, ...args); },
    crcl: (vec, radius) => circle(vec.x, vec.y, radius)
};
