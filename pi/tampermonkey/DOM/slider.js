
/// <reference path="../customTypes/index.d.ts" />

function sliderInput(onclick) {
    return (e) => {
        try {
            onclick(e.target, (e.target.value), 1);
        }
        catch (err) {
            handleError(err);
        }
    };
}
function crSL(parent, onclick, startvalue, icon, runOnclickOnBuild = true) {
    // @ts-ignore
    let background = this.crIN(parent, ' ');
    let barcolor = '';
    if (location.href.indexOf('kissanime') > -1) {
        barcolor = '#111111';
    }
    else if (location.href.indexOf('kissmanga') > -1) {
        barcolor = '#111111';
    }
    else {
        barcolor = '#333';
    }
    background.style.backgroundColor = barcolor;
    // appendto.appendChild(background);
    let object = document.createElement('input');
    background.appendChild(object);
    object.style.width = '90%';
    if (icon) {
        let middleDiv = document.createElement('divmiddle');
        middleDiv.style.top = '0px';
        background.appendChild(middleDiv);
        let iconE = document.createElement('img');
        middleDiv.appendChild(iconE);
        middleDiv.appendChild(object);
        iconE.src = icon;
        iconE.style.width = '5%';
        iconE.style.position = 'absolute';
        iconE.style.left = '0px';
        object.style.position = 'absolute';
        object.style.left = '5%';
        object.style.width = '70%';
    }
    let obs = new MutationObserver(((a, b) => {
        let element = a[0].target;
        // @ts-ignore
        let w = element.style.width;
        // @ts-ignore
        element.children[0].style.width = (+w.replace('px', '') - 20) + 'px';
    }));
    obs.observe(background, { attributes: true });
    object.type = 'range';
    object.id = 'custom_script' + sc.D.n++;
    object.value = startvalue;
    if (onclick !== null && onclick !== undefined) {
        object.oninput = sliderInput(onclick);
        try {
            if (runOnclickOnBuild) {
                onclick(object, (object.value), 1);
            }
        }
        catch (err) {
            handleError(err);
        }
    }
    return background;
}