crIF = () => {

    var crIF = (appendto, url, onload, hidden, val) => {
        if (!hidden) {
            hidden = true;
        }
        let i = document.createElement('iframe');
        i.id = "custom_script" + sc.D.n++;
        appendto.appendChild(i);
        i.frameBorder = "0";
        i.src = url;
        IFReady(i, onload, hidden, val);
        return i;
    }

    function IFReady(iFrame, fn, hiding, val) {
        let timer;
        let fired = false;
        function ready() {
            if (!fired) {
                fired = true;
                clearTimeout(timer);
                iFrame.hidden = hiding;
                if (fn !== null && fn !== undefined) {
                    try {
                        fn.call(this, iFrame, val);
                    }
                    catch (err) {
                        environment_9.Environment.sc.D.e(err);
                    }
                }
            }
        }
        function readyState() {
            if (this.readyState === "complete") {
                ready.call(this);
            }
        }
        function addEvent(elem, event, fn) {
            if (elem.addEventListener) {
                return elem.addEventListener(event, fn);
            }
            else {
                return elem.attachEvent("on" + event, function () {
                    return fn.call(elem, window.event);
                });
            }
        }
        addEvent(iFrame, "load", function () {
            ready.call(iFrame.contentDocument || iFrame.contentWindow.document);
        });
        (function checkLoaded() {
            let doc = iFrame.contentDocument || iFrame.contentWindow.document;
            if (doc.URL.indexOf("about:") !== 0) {
                if (doc.readyState === "complete") {
                    ready.call(doc);
                }
                else {
                    addEvent(doc, "DOMContentLoaded", ready);
                    addEvent(doc, "readystatechange", readyState);
                }
            }
            else {
                timer = setTimeout(checkLoaded, 1);
            }
        })();
    }
}