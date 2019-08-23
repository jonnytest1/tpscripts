/* eslint-disable */
// @ts-nocheck

define('Bar/Table', ['require', 'exports', 'environment'], function (require, exports, environment_1) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Table {
        static clearevents() {
            window['GM_setValue']('events', []);
        }
        static getcustom(btn) {
            let array = environment_1.Environment.sc.G.g('customlog', [], 0);
            let text = ' ';
            for (let i = 0; i < array.length; i++) {
                //  text += "\n" + array[i][1] + "  " + array[i][2] + " : \n";
                for (let j = 0; j < array[i].length; j++) {
                    text += array[i][j].toString() + '\n';
                }
            }
            console.log(text);
            btn.txtString = text;
            this.spam_switch(btn);
            environment_1.Environment.sc.G.s('customlog', []);
        }
        static spam_switch(btn, frommenu = true, canadd = false, canremove = false) {
            /*function getarray(btn) {
                if (btn.preparedarray) {
                    ar = btn.preparedarray;
                } else if (btn.arrayString) {
                    btn.resourcetype = "LS";
                    ar = sc.L.g(btn.arrayString, new Array(0), 0);
                    if (ar.length === 0) {
                        btn.resourcetype = "GS";
                        ar = sc.G.g(btn.arrayString, new Array(0), 0);
                    }
                } else if (btn.txtString) {
                    ar = [[btn.txtString]];
                }
                return ar;
            }
            function setarraybtn(btn, array) {
                if (btn.resourcetype === "GS") {
                    sc.G.s(btn.arrayString, array);
                } else {
                    sc.L.s(btn.arrayString, array);
                }
            }
            function removeElementFunction(bt) {
                var arraySt = getarray(btn);
                var obj = arraySt[bt.index];
                var text = "";
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].toString().indexOf("[") > -1 && obj[i].toString().indexOf("]") > -1) {
                        try {
                            obj[i] = JSON.parse(obj[i]);
                            text += "[" + obj[i][0];
                            for (var j = 1; j < obj[i].length; j++) {
                                text += "," + obj[i][j];
                            }
                            text += "]";
                        } catch (error) {
                            text += obj[i];
                        }
                    } else {
                        text += obj[i];
                    }
                    if (i < obj.length - 1) {
                        text += ",";
                    }
                }
                // btn.startvalue = JSON.stringify(arraySt[bt.index]);
                btn.startvalue = text;
                arraySt.remI(bt.index);
                setarraybtn(btn, arraySt);
                spam(btn, false, canadd, canremove);
                spam(btn, false, canadd, canremove);
            }
            sc.D.l(location.host + " bar.spamswitch", 3);
            var start = btn.start ? btn.start : 0;
            var ar = getarray(btn);
            var amount = sc.c.recent_notifications_amount;
            if (frommenu) {
                start = ar.length - amount < 0 ? 0 : ar.length - amount;
            }
            btn.enabled = !btn.enabled;
            btn.innerText = btn.enabled === false ? "show " + btn.arrayString : "remove";
            btn.style.backgroundColor = btn.enabled === false ? "lightgreen" : "red";
            var end = start + amount > ar.length ? ar.length : start + amount;
            var height = (window.innerHeight - 45) / (end - start);
            var arr = new Array(ar.length * (ar[0].length + 1) + 2);
            if (btn.enabled) {
                btn.ref = document.body.appendChild(document.createElement("arrayContainer"));
                var buttonsAmount = 0;
                if (canadd) {
                    buttonsAmount += 1;
                }
                if (ar.length > amount) {
                    buttonsAmount += 2;
                }
                if (canadd) {
                    var add = sc.DOM.crTF(btn.ref, btn.startvalue ? btn.startvalue : "add new", function (a, text) {
                        btn.startvalue = "add new";
                        var arraySt = sc.G.g(btn.arrayString, new Array(0));
                        var objects = new Array(0);
                        var brack = text.split("[#");
                        for (var i = 1; i < brack.length; i++) {
                            objects.push(brack[i].split("#]")[0]);
                        }
                        for (var i = 0; i < objects.length; i++) {
                            text = text.replace(objects[i], objects[i].replace(/,/g, "###"));
                        }
                        var objarray = text.split(",");
                        var object2 = {};
                        var bracket = false;
                        var ct = 0;
                        for (var zi = 0; zi < objarray.length; zi++) {
                            objarray[zi] = objarray[zi].replace(/###/g, ",");
                            if (objarray[zi].indexOf("[") > -1 && objarray[zi].indexOf("[#") === -1) {
                                bracket = true;
                                object2[JSON.stringify(zi - ct)] = new Array(0);
                            }
                            if (bracket) {
                                if (objarray[zi].indexOf("]") > -1) {
                                    bracket = false;
                                }
                                var t = ct;
                                if (objarray[zi].indexOf("]") === -1) {
                                    ct++;
                                }
                                if (objarray[zi].indexOf("[#") === -1) {
                                    objarray[zi] = objarray[zi].replace("[", "").replace("]", "");
                                }
                                object2[JSON.stringify(zi - t)].push(objarray[zi]);
                            } else {
                                object2[JSON.stringify(zi - ct)] = objarray[zi];
                            }
                        }
                        if (object2["4"] === undefined) {
                            var ID = 0;
                            while (arraySt.f(ID.toString(), true, "[4].toString()") > -1) {
                                ID++;
                            }
                            object2["4"] = ID;
                        }
                        object2.length = 5;
                        var object = object2;
                        if (object[0].constructor.name === "Array") {
                            object[0] = JSON.stringify(object[0]);
                        }
                        if (object[1].constructor.name === "Array") {
                            object[1] = JSON.stringify(object[1]);
                        }
                        if (object[3] === undefined) {
                            return;
                        }
                        arraySt.push(object);
                        sc.G.s(btn.arrayString, arraySt);
                        spam(btn, false, canadd, canremove);
                        spam(btn, false, canadd, canremove);
                    }, "add new");
                    add.style.width = (window.innerWidth - 20) / buttonsAmount + "px";
                    add.style.position = "fixed";
                    add.style.height = 20 + "px";
                    add.style.zIndex = zIndex - 45;
                    add.style.top = window.innerHeight - 45 + "px";
                    add.style.left = window.innerWidth - 20 - ((window.innerWidth - 20) / buttonsAmount) + "px";
                    add.style.backgroundColor = "white";
                    btn.addbtn = add;
                }
                if (ar.length > amount) {
                    var top = sc.DOM.crIN(btn.ref, "previous : " + (start - amount < 1 ? 1 : start - amount) + " - " + ((start - amount < 1 ? 1 : start - amount) + amount) + " / " + ar.length, function () {
                        btn.start = start - amount < 0 ? 0 : start - amount;
                        spam(btn, false, canadd, canremove);
                        spam(btn, false, canadd, canremove);
                    });
                    top.style.width = (window.innerWidth - 20) / buttonsAmount + "px";
                    top.style.position = "fixed";
                    top.style.height = 20 + "px";
                    top.style.zIndex = zIndex - 45;
                    top.style.top = window.innerHeight - 45 + "px";
                    top.style.left = "0px";
                    top.style.backgroundColor = "white";
                    btn.topbtn = top;
                    var bottom = sc.DOM.crIN(btn.ref, "next : " + (end > ar.length - amount ? ar.length - amount : end) + " - " + (end + amount > ar.length - 1 ? ar.length : end + amount) + " / " + ar.length, function () {
                        btn.start = end > ar.length - amount ? ar.length - amount : end;
                        spam(btn, false, canadd, canremove);
                        spam(btn, false, canadd, canremove);
                    });
                    bottom.style.top = window.innerHeight - 45 + "px";
                    bottom.style.width = (window.innerWidth - 20) / buttonsAmount + "px";
                    bottom.style.position = "fixed";
                    bottom.style.height = 20 + "px";
                    bottom.style.zIndex = zIndex - 45;
                    bottom.style.left = (window.innerWidth - 20) / buttonsAmount + "px";
                    bottom.style.backgroundColor = "white";
                    btn.bbtn = bottom;
                }
                var colarray = new Array(0);
                for (var i = start; i < end; i++) {
                    var row = ar[i]
                    var width = (window.innerWidth - 20) / row.length;
                    arr[i] = new Array(row.length);
                    var color;
                    colarray.push(color = scripts.ANIM.color());
                    if (canremove) {
                        var rem = sc.DOM.crIN(btn.ref, "X", removeElementFunction);
                        rem.index = i;
                        rem.style.top = (i - start) * height + "px";
                        rem.style.position = "fixed";
                        rem.style.width = 20 + "px";
                        rem.style.left = (row.length * width) - 20 + "px";
                        rem.style.height = 20 + "px";
                        rem.style.zIndex = zIndex + 1;
                    }
                    for (var j = 0; j < row.length; j++) {
                        var arrayElement = row[j]
                        try {
                            if (arrayElement !== null && arrayElement.constructor.name === "Array") {
                                arr[i][j] = sc.DOM.crIN(btn.ref, arrayElement[0]);
                            } else {
                                arr[i][j] = sc.DOM.crIN(btn.ref, arrayElement);
                            }
                        } catch (e) {
                            sc.D.e(e);
                            arr[i][j] = sc.DOM.crIN(btn.ref, arrayElement);
                        }
                        elementContainer = arr[i][j];
                        if (j === 0 && i % 2 === 0) {
                            elementContainer.textContent = i + ": " + elementContainer.textContent;
                        }
                        elementContainer.style.position = "fixed";
                        elementContainer.style.top = (i - start) * height + "px";
                        elementContainer.style.left = j * width + "px";
                        elementContainer.style.width = width + "px";
                        elementContainer.style.height = height + "px";
                        elementContainer.style.zIndex = zIndex - 50;
                        if (arrayElement !== null && arrayElement.color2) {
                            var area1 = sc.DOM.crIN(elementContainer);
                            area1.style.height = height / 3 + "px";
                            area1.style.width = (width - 100) / 2 + "px";
                            area1.style.border = "0px";
                            area1.style.position = "fixed";
                            area1.style.backgroundColor = ar[i][j].color2;
                            area1.style.left = (j * width) + 5 + "px";
                            area1.style.top = (i - start) * height + height / 2 - (height / 3) / 2 + "px";
                            var area2 = sc.DOM.crIN(elementContainer);
                            area2.style.height = height / 3 + "px";
                            area2.style.width = (width - 115) / 2 + "px";
                            area2.style.border = "0px";
                            area2.style.position = "fixed";
                            area2.style.backgroundColor = arrayElement.color2;
                            area2.style.left = (j * width) + width / 2 + 50 + "px";
                            area2.style.top = (i - start) * height + height / 2 - (height / 3) / 2 + "px";
                        }
                        elementContainer.style.backgroundColor = color;
                        elementContainer.style.color = scripts.ANIM.inverseColor(color);
                        if (i % 2 === 1 && (location.href.indexOf("cine") > -1 || location.href.indexOf("bs.to") > -1)) {
                            elementContainer.style.backgroundColor = colarray[i - start - 1];
                        }

                        try {
                            if (arrayElement && arrayElement.icon && arrayElement.icon !== null) {
                                elementContainer.ref = btn.ref;
                                elementContainer.bodytext = arrayElement.icon;
                                elementContainer.icon = arrayElement.icon;
                                elementContainer.indexj = j;
                                elementContainer.onmouseenter = function (e) {
                                    e.target.body = sc.DOM.crIN(e.target.ref, e.target.bodytext);
                                    e.target.onmousemove(e);
                                    e.target.body.style.backgroundColor = "white";
                                    e.target.body.style.borderRadius = 200 + "px";
                                    e.target.body.style.zIndex = zIndex;
                                    e.target.body.style.position = "fixed";
                                    e.target.body.style.opacity = 0.92;
                                    if (e.target.icon) {
                                        var img = document.createElement("img");
                                        img.src = e.target.bodytext;
                                        img.onload = function () {
                                            if (img.naturalHeight < img.naturalWidth) {
                                                img.style.width = e.target.body.style.width.split("px")[0] / 2 + "px";
                                                img.style.height = e.target.body.style.height.split("px")[0] / 2 + "px";
                                            } else {
                                                img.style.width = e.target.body.style.width.split("px")[0] / 2 + "px";
                                                img.style.height = e.target.body.style.height.split("px")[0] / 2 + "px";
                                            }
                                            img.style.top = e.target.body.style.height.split("px")[0] / 2 - (img.height / 2) + "px";
                                            img.style.left = e.target.body.style.width.split("px")[0] / 2 - (img.width / 2) + "px";
                                        };
                                        img.style.zIndex = zIndex + 1;
                                        img.style.opacity = 0.9;
                                        img.style.position = "absolute";
                                        e.target.body.appendChild(img);
                                    }
                                };
                                elementContainer.onmouseleave = function (e) {
                                    try {
                                        e.target.body.remove();
                                    } catch (e2) {
                                        sc.D.e(e2);
                                    }
                                };
                                elementContainer.onmousemove = function (e) {
                                    if (e.y > window.innerHeight / 2) {
                                        e.target.body.style.top = "10px";
                                        e.target.body.style.height = e.y + "px";
                                    } else {
                                        e.target.body.style.top = e.y + "px";
                                        e.target.body.style.height = window.innerHeight - 40 - e.y + "px";
                                    }
                                    if (e.x > window.innerWidth / 2) {
                                        e.target.body.style.width = e.x + "px";
                                        e.target.body.style.left = 30 + "px";
                                    } else {
                                        e.target.body.style.width = window.innerWidth - e.x - 30 + "px";
                                        e.target.body.style.left = e.x + "px";
                                    }
                                };
                            }
                        } catch (e) {
                            sc.D.e(e);
                        }
                    }
                }
                btn.arr = arr;
            } else {

                btn.ref.remove();
            }*/
        }

        static recent(btn, frommenu = true, filter = '') {
            /* sc.D.l(location.host + " bar.recent", 3);
             function update() {
                 if (btn.enabled) {
                     if (btn.keepUpdated !== undefined && btn.keepUpdated) {
                         var array = sc.G.g(sc.c.sI.GS.eventstorage, new Array(0), 0);
                         for (var i = array.length - 1; i > -1; i--) {
                             if (array[i].host.indexOf(btn.filtervalue) === -1) {
                                 array.remI(i);
                             }
                         }
                         if (length !== array.length) {
                             recentevent(btn, true, btn.filtervalue);
                             recentevent(btn, true, btn.filtervalue);
                         } else {
                             sc.D.sT(update, 2000);
                         }
                     } else {
                         sc.D.sT(update, 2000);
                     }
                 } else {
                     return;
                 }
             }
             btn.enabled = !btn.enabled;
             btn.innerText = btn.enabled === false ? sc.c.sI.GS.eventstorage : "remove";
             btn.style.backgroundColor = btn.enabled === false ? "lightgreen" : "red";
             if (btn.enabled) {
                 var start = btn.start ? btn.start : 0;
                 var ar = sc.G.g(sc.c.sI.GS.eventstorage, new Array(0), 0);
                 for (var i = ar.length - 1; i > -1; i--) {
                     if (ar[i].host.indexOf(filter) === -1) {
                         ar.remI(i);
                     }
                 }
                 var amount = sc.c.recent_notifications_amount;
                 if (frommenu) {
                     start = ar.length - amount < 0 ? 0 : ar.length - amount;
                 }
                 console.log(ar);
                 var values = 8;
                 var width = (window.innerWidth - 20) / values;
                 var length = ar.length;
                 var end = start + amount > ar.length ? ar.length : start + amount;
                 var height = (window.innerHeight - 45) / (end - start);
                 var arr = new Array(ar.length * values + 2);
                 var colorarray = new Array(0);
                 var namesarray = new Array(0);
                 btn.ref = document.body.appendChild(document.createElement("arrayContainer"));
                 var buttons = 1;
                 if (ar.length > amount) {
                     buttons += 2;
                 }

                 var filterbtn = sc.DOM.crTF(btn.ref, btn.filtervalue ? btn.filtervalue : "filter", function (a, text) {
                     btn.filtervalue = text;
                     recentevent(btn, true, text);
                     recentevent(btn, true, text);
                 });
                 filterbtn.style.width = (window.innerWidth - 20) / buttons + "px";
                 filterbtn.style.position = "fixed";
                 filterbtn.style.height = 18 + "px";
                 filterbtn.style.zIndex = zIndex - 45;
                 filterbtn.style.top = window.innerHeight - 45 + "px";
                 filterbtn.style.left = window.innerWidth - 20 - ((window.innerWidth - 20) / buttons) + "px";
                 filterbtn.style.backgroundColor = "white";
                 btn.filterbtnbtn = filterbtn;
                 var cB = sc.DOM.crCB(btn.ref, function (cb, var2) {
                     var2.ref.keepUpdated = cb;
                 });
                 if (btn.keepUpdated !== undefined) {
                     cB.checked = btn.keepUpdated;
                 }
                 cB.ref = btn;
                 cB.style.position = "fixed";
                 cB.style.top = window.innerHeight - 45 + "px";
                 cB.style.left = (window.innerWidth - 20) / buttons - 10 + "px";
                 cB.style.width = "20px";
                 cB.style.height = 20 + "px";
                 cB.style.zIndex = zIndex - 1;
                 if (ar.length > amount) {
                     var top = sc.DOM.crIN(btn.ref, "previous : " + (start - amount < 1 ? 1 : start - amount) + " - " + ((start - amount < 1 ? 1 : start - amount) + amount) + " / " + ar.length, function () {
                         btn.start = start - amount < 0 ? 0 : start - amount;
                         recentevent(btn, false, filter);
                         recentevent(btn, false, filter);
                     });
                     top.style.width = (window.innerWidth - 20) / buttons - 10 + "px";
                     top.style.position = "fixed";
                     top.style.height = 20 + "px";
                     top.style.zIndex = zIndex - 45;
                     top.style.top = window.innerHeight - 45 + "px";
                     top.style.left = "0px";
                     top.style.backgroundColor = "white";
                     btn.topbtn = top;
                     var bottom = sc.DOM.crIN(btn.ref, "next : " + (end > ar.length - amount ? ar.length - amount : end) + " - " + (end + amount > ar.length - 1 ? ar.length : end + amount) + " / " + ar.length, function () {
                         btn.start = end > ar.length - amount ? ar.length - amount : end;
                         recentevent(btn, false, filter);
                         recentevent(btn, false, filter);
                     });
                     bottom.style.top = window.innerHeight - 45 + "px";
                     bottom.style.width = (window.innerWidth - 20) / buttons - 10 + "px";
                     bottom.style.position = "fixed";
                     bottom.style.height = 20 + "px";
                     bottom.style.zIndex = zIndex - 45;
                     bottom.style.left = (window.innerWidth - 20) / buttons + 10 + "px";
                     bottom.style.backgroundColor = "white";
                     btn.bbtn = bottom;
                 }
                 for (var i = start; i < end; i++) {
                     arr[i] = new Array(values);
                     var color;
                     var iurl = ar[i].host;
                     var index;
                     if (iurl === undefined || iurl === "") {
                         iurl = "undefinediurl";
                     }
                     index = namesarray.f(iurl);
                     debugger;
                     if (index !== -1) {
                         color = colorarray[index];
                     } else {
                         color = scripts.ANIM.color("");
                         namesarray.push(ar[i].host);
                         colorarray.push(color);
                     }
                     for (var j = 0; j < values; j++) {
                         var text;
                         if (j === 0) {
                             text = (i + 1) + " : " + ar[i].title;
                         } else if (j === 1) {
                             text = ar[i].iurl;
                         } else if (j === 2) {
                             text = ar[i].body;
                         } else if (j === 3) {
                             text = ar[i].fnc;
                         } else if (j === 4) {
                             text = ar[i].url;
                         } else if (j === 5) {
                             text = ar[i].timeout + "";
                         } else if (j === 6) {
                             text = ar[i].host;
                         } else if (j === 7) {
                             text = ar[i].timestamp + " " + "\n" + sc.T.D(ar[i].timestamp);
                         }
                         arr[i][j] = sc.DOM.crIN(btn.ref, text);
                         arr[i][j].style.position = "fixed";
                         arr[i][j].style.top = (i - start) * height + "px";
                         arr[i][j].style.left = j * width + "px";
                         arr[i][j].style.width = width + "px";
                         arr[i][j].style.height = height + "px";
                         arr[i][j].style.zIndex = 1999999999;
                         if (ar[i].host === "www.youtube.com" && j === 0) {
                             var colortl = "";
                             var channels = sc.G.g("channels", new Array(0), 0);
                             for (var ij = 0; ij < channels.length; ij++) {
                                 if (channels[ij].channel === ar[i].title) {
                                     colortl = channels[ij].color;
                                     break;
                                 }
                             }
                             if (colortl === "") {
                                 colortl = color;
                             }
                             arr[i][j].style.backgroundColor = colortl;
                         } else {
                             if (j === 6) {
                                 var backColor = null;
                                 var colorarray2 = sc.G.g("colors", new Array(0), 0);
                                 for (var i4 = 0; i4 < colorarray2.length; i4++) {
                                     if (colorarray2[i4].host === ar[i].host) {
                                         backColor = colorarray2[i4].color;
                                         break;
                                     }
                                 }
                                 arr[i][j].style.backgroundColor = backColor;
                             } else {
                                 arr[i][j].style.backgroundColor = color;
                             }
                         }
                         if (j === 4 || j === 0) {
                             arr[i][j].href = ar[i].url;
                             arr[i][j].onclick = function (e) {
                                 if (e.target.href) {
                                     sc.D.o(e.target.href);
                                 }
                             };
                         }
                         if (j < 5 || j === 6) {//0-4+6
                             arr[i][j].ref = btn.ref;
                             arr[i][j].bodytext = text;
                             arr[i][j].indexj = j;
                             arr[i][j].onmouseenter = function (e) {
                                 e.target.body = sc.DOM.crIN(e.target.ref, e.target.bodytext);
                                 if (e.y > window.innerHeight / 2) {
                                     e.target.body.style.top = "10px";
                                     e.target.body.style.height = e.y + "px";
                                 } else {
                                     e.target.body.style.top = e.y + "px";
                                     e.target.body.style.height = window.innerHeight - 40 - e.y + "px";
                                 }
                                 if (e.x > window.innerWidth / 2) {
                                     e.target.body.style.width = e.x + "px";
                                     e.target.body.style.left = 30 + "px";
                                 } else {
                                     e.target.body.style.width = window.innerWidth - e.x - 30 + "px";
                                     e.target.body.style.left = e.x + "px";
                                 }
                                 e.target.body.style.backgroundColor = "white";
                                 e.target.body.style.borderRadius = 200 + "px";
                                 e.target.body.style.zIndex = zIndex;
                                 e.target.body.style.position = "fixed";
                                 e.target.body.style.opacity = 0.92;
                                 if (e.target.indexj === 1) {
                                     var img = document.createElement("img");
                                     img.src = e.target.bodytext;
                                     img.onload = function () {
                                         if (img.naturalHeight < img.naturalWidth) {
                                             img.style.width = e.target.body.style.width.split("px")[0] / 2 + "px";
                                             img.style.height = e.target.body.style.height.split("px")[0] / 2 + "px";
                                         } else {
                                             img.style.width = e.target.body.style.width.split("px")[0] / 2 + "px";
                                             img.style.height = e.target.body.style.height.split("px")[0] / 2 + "px";
                                         }
                                         img.style.top = e.target.body.style.height.split("px")[0] / 2 - (img.height / 2) + "px";
                                         img.style.left = e.target.body.style.width.split("px")[0] / 2 - (img.width / 2) + "px";
                                     };
                                     img.style.zIndex = zIndex + 1;
                                     img.style.opacity = 0.9;
                                     //img.style.top=0+"px";
                                     //img.style.borderTopLeftRadius="20px";
                                     //img.style.borderBottomLeftRadius="20px";
                                     img.style.position = "absolute";
                                     e.target.body.appendChild(img);
                                 }
                             };
                             arr[i][j].onmouseleave = function (e) {
                                 try {
                                     e.target.body.remove();
                                 } catch (e2) {
                                     sc.D.e(e2);
                                 }
                             };
                             arr[i][j].onmousemove = function (e) {
                                 if (e.y > window.innerHeight / 2) {
                                     e.target.body.style.top = "10px";
                                     e.target.body.style.height = e.y + "px";
                                 } else {
                                     e.target.body.style.top = e.y + "px";
                                     e.target.body.style.height = window.innerHeight - 40 - e.y + "px";
                                 }
                                 if (e.x > window.innerWidth / 2) {
                                     e.target.body.style.width = e.x + "px";
                                     e.target.body.style.left = 30 + "px";
                                 } else {
                                     e.target.body.style.width = window.innerWidth - e.x - 30 + "px";
                                     e.target.body.style.left = e.x + "px";
                                 }
                             };
                         }

                     }
                 }
                 btn.arr = arr;
                 update(filter);
             } else {
                 for (var i2 = btn.ref.children.length - 1; i2 > -1; i2--) {
                     // btn.ref.children[i2].remove();
                 }
                 btn.ref.remove();
             }
        */
        }
    }
    exports.Table = Table;
});

define('sc/Anim/Animations', ['require', 'exports', 'environment'], function (require, exports, environment_3) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Animations {
        constructor(sc) {
            this.sc = sc;
            this.toggled = 0;
        }
        gettoggled(btn) {
            let parent = btn.parentElement;
            try {
                Animations.setcolor(parent.children[this.toggled], false);
            }
            catch (e) {
                environment_3.Environment.sc.D.e(e);
            }
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i] === btn) {
                    this.toggled = i;
                    environment_3.Environment.sc.D.l(i);
                    Animations.setcolor(btn, true);
                    //a[tFIndex - 1].value = i === 0 ? "volume " + document.getElementsByClassName("video-stream html5-main-video")[0].volume : "speed " + document.getElementsByClassName("video-stream html5-main-video")[0].playbackRate;
                }
            }
        }
        static setcolor(btn, dark, value = 0.9, overwrite = false) {
            let t = Animations.color(btn.style.backgroundColor).split('rgb(')[1].split(')')[0].split(', ');
            if (overwrite) {
                t = Animations.color('').split('rgb(')[1].split(')')[0].split(', ');
            }
            if (dark) {
                for (let p = 0; p < t.length; p++) {
                    if (t[p] > 128) {
                        t[p] = Math.round(JSON.parse(t[p]) * value);
                    }
                    else {
                        t[p] = Math.round(JSON.parse(t[p]) / value);
                    }
                }
            }
            else {
                for (let p = 0; p < t.length; p++) {
                    if (t[p] < 125) {
                        t[p] = Math.round(JSON.parse(t[p]) * value);
                    }
                    else {
                        t[p] = Math.round(JSON.parse(t[p]) / value);
                    }
                }
            }
            btn.style.backgroundColor = 'rgb(' + t[0] + ', ' + t[1] + ', ' + t[2] + ')';
        }
        static color(cstring) {
            if (cstring === '' || cstring === undefined) {
                let abc = Math.floor(Math.random() * 3);
                let col = new Array(3);
                col[abc] = 230;
                abc += 1 + Math.floor(Math.random() * 2);
                if (abc >= col.length) {
                    abc -= col.length;
                }
                col[abc] = Math.random() * 255;
                for (let i = 0; i < col.length; i++) {
                    if (col[i] === undefined) {
                        col[i] = 255 - col[abc];
                    }
                }
                return 'rgb(' + Math.floor(col[0]) + ', ' + Math.floor(col[1]) + ', ' + Math.floor(col[2]) + ')';
            }
            else if (cstring.indexOf('rgb(') > -1) {
                return cstring;
            }
            else if (cstring.indexOf('white') > -1) {
                return 'rgb(255, 255, 255)';
            }
            else if (cstring.indexOf('lightgreen') > -1) {
                return 'rgb(144, 238, 144)';
            }
            else if (cstring.indexOf('green') > -1) {
                return 'rgb(0, 128, 0)';
            }
            else if (cstring.indexOf('red') > -1) {
                return 'rgb(255, 0, 0)';
            }
            else if (cstring.indexOf('green') > -1) {
                return 'rgb(0, 128, 0)';
            }
            else if (cstring.indexOf('orange') > -1) {
                return 'rgb(255, 165, 0)';
            }
            else if (cstring.indexOf('lightgrey') > -1) {
                return 'rgb(211, 211, 211)';
            }
            else {
                alert(':' + cstring + '; new color');
            }
            return null;
        }
    }
    exports.Animations = Animations;
});
define('Bar/Menu', ['require', 'exports', 'environment', 'Bar/Bar', 'sc/Anim/Animations'], function (require, exports, environment_4, Bar_1, Animations_1) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Menu {
        constructor(menuContainer, elementsContainer, name = 'standard_menu_string', arrayBt) {
            this.menuContainer = menuContainer;
            this.visibility = 'hidden';
            if (!menuContainer) {
                menuContainer = environment_4.Environment.mainContainer;
            }
            if (elementsContainer == undefined) {
                elementsContainer = Bar_1.Bar.barElementContainer;
            }
            if (arrayBt == undefined) {
                arrayBt = [];
            }
            this.name = name.replace(' ', '_');
            this.container = menuContainer.insertBefore(document.createElement('divmenu_' + name), menuContainer.children[0]);
            this.menuElements = new Array(0);
            for (let i = 0; i < arrayBt.length; i++) {
                if (arrayBt[i][0] === undefined || arrayBt[i][0] === null) {
                    arrayBt[i][0] = 'crIN';
                }
                if (arrayBt[i].constructor.name === 'Menu') {
                    this.menuElements.push(arrayBt[i].parent);
                    this.menuContainer.appendChild(arrayBt[i].parent);
                    arrayBt[i].level = 2;
                    for (let j = Bar_1.Bar.barElementContainer.length - 1; i > -1; i--) {
                        if (Bar_1.Bar.barElementContainer[j] === arrayBt[i].parent) {
                            Bar_1.Bar.barElementContainer.remI(j);
                            break;
                        }
                    }
                }
                else {
                    this.menuElements.push(environment_4.Environment.sc.DOM[arrayBt[i][0]](this.container, arrayBt[i][1], arrayBt[i][2], arrayBt[i][3], arrayBt[i][4], arrayBt[i][5], arrayBt[i][6]));
                }
            }
            let instance = this;
            this.parent = environment_4.Environment.sc.DOM.crIN(menuContainer, name, null, (function (btn) {
                return Menu.menu(btn, instance.menuElements, true);
            }), (function (btn) {
                return Menu.menu(btn, instance.menuElements, false);
            }));
            Bar_1.Bar.barElementContainer.push(this.parent);
            //in case i want to add elements afterwards;
            this.name = name;
            this.visibility = 'hidden';
            this.parent.menuIndex = name;
            Bar_1.Bar.menus[name] = this;
            Bar_1.Bar.repaintBar();
            return this;
        }
        setVisibility() {
            Menu.menu(this.parent, this.menuElements, this.visibility === 'visible');
        }
        addElement(element) {
            this.container.appendChild(element);
            this.menuElements.push(element);
            return element;
        }
        static menufy(element, ar) {
            environment_4.Environment.sc.D.aL(element, 'mouseenter', function (btn) {
                return Menu.menu(btn, ar, true);
            });
            environment_4.Environment.sc.D.aL(element, 'mouseleave', function (btn) {
                return Menu.menu(btn, ar, false);
            });
        }
        static menu(btn, b, visible) {
            let instance = this;
            environment_4.Environment.sc.D.l(location.host + ' menu', 3);
            if (btn.menuIndex !== undefined) {
                Bar_1.Bar.menus[btn.menuIndex].visibility = visible ? 'visible' : 'hidden';
            }
            for (let i = 0; i < b.length; i++) {
                b[i].mParent = btn;
                if (visible) {
                    b[i].style.visibility = 'visible';
                    b[i].style.zIndex = environment_4.Environment.zIndex;
                    b[i].onmouseover = (function () { });
                    b[i].onmouseenter = (function (i) {
                        return function () {
                            instance.menu(btn, b, true);
                            Animations_1.Animations.setcolor(b[i], true);
                        };
                    }(i));
                    b[i].onmouseleave = (function (i) {
                        return function () {
                            Animations_1.Animations.setcolor(b[i], false);
                            instance.menu(btn, b, false);
                        };
                    }(i));
                }
                else {
                    b[i].style.visibility = 'hidden';
                }
            }
            return btn;
        }
        static addSubMenu(parentMenu, text, children = []) {
            /*children : {
                    text:displayText:String
                    onclick:function(btn,this)
                }
            */
            let parent = environment_4.Environment.sc.DOM.crIN(parentMenu.container, text, undefined, undefined, undefined);
            parent['level'] = 2;
            this.menufy(parent, children);
            let menu = new Menu(parent, undefined);
            menu.parent.remove();
            Bar_1.Bar.barElementContainer = Bar_1.Bar.barElementContainer.filter(el => el != menu.parent);
            menu.name = text;
            menu.menuElements = children;
            menu.parent = parent;
            parentMenu.addElement(menu.parent);
            Bar_1.Bar.repaintBar();
            return menu;
        }
        /*static addSubMenu(parentMenu, text, children): Menu {
            /*children : {
                    text:displayText:String
                    onclick:function(btn,this)
                }

            return Menu.addToMenu1(text, undefined, this.onSubMenuEnter(children), function (e) { e.children[0].remove(); });
        }

        static addToMenu1(text, fnc, enter, leave, el = "crIN", indx = 0) {
            var obj = Environment.sc.DOM[el](Bar.menus.menu1.parent, text, fnc, enter, leave);
            Bar.menus.menu1.menuElements.push(obj);
            Bar.repaintBar();
            return obj;
        }*/
        static onSubMenuEnter(children) {
            return function (a, b) {
                debugger;
                function removemenu(c, d) {
                    for (let i in Bar_1.Bar.menus) {
                        if (c.parentElement.nodeName.toLowerCase() === 'divmenu_' + Bar_1.Bar.menus[i].name) {
                            Bar_1.Bar.menus[i] = undefined;
                        }
                    }
                    c.parentElement.remove();
                    Bar_1.Bar.repaintBar();
                }
                function menuclick(c, d) {
                    removemenu(c, d);
                    for (let i in children) {
                        if (children[i].text === c.innerText.split(': ')[1].trim()) {
                            children[i].onclick(c, children[i]);
                        }
                    }
                }
                let menuar = [];
                let changed = false;
                for (let i in children) {
                    menuar.push([null, i + ' :     ' + children[i].text, menuclick, undefined, undefined, undefined, { style: { textAlign: 'left', backgroundColor: 'red' } }]);
                }
                //a.constructor.name = "Menu";
                a.level = 2;
                let men = new Menu(a, null, 'choose_tempalte', menuar);
                men.parent.remove();
                Menu.menufy(a, men.menuElements);
                debugger;
                /* for (let j: number = Bar.menus.length - 1; j > -1; j--) {
                     if (Bar.menus[j] === men.parent) {
                         Bar.menus.remI(j);
                         break;
                     }
                 }
                 for (let menu in Bar.menus) {
                     if (menu === men.parent) {
                         Bar.menus
                     }
                 }*/
                men.parent = a;
                men.visibility = 'hidden';
                Bar_1.Bar.repaintBar();
            };
        }
    }
    Menu.menuList = []; //m
    exports.Menu = Menu;
});

define('Bar/Bar', ['require', 'exports', 'environment', 'Bar/Table', 'sc/find'], function (require, exports, environment_5, Table_1, find_2) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Bar {
        constructor(e = environment_5.Environment.mainContainer) {
            this.buttonContainer = [];
            this.isEnabled = true;
            this.OnOffTimer = -1;
            this.offset = {
                off: false,
                x: 0,
                y: 0,
                sx: 0,
                sy: 0,
                activity: environment_5.Environment.sc.T.n(),
                hidden: false
            };
            let instance = this;
            // @ts-ignore
            Bar.barElementContainer.push(environment_5.Environment.sc.DOM.crIN(e, '', null, null, null));
            let cb = environment_5.Environment.sc.DOM.crIN(e, 'ON', this.switchEnabled, function () {
                instance.isEnabled = false;
                instance.switchEnabled(undefined, false);
            }); //button enables bar
            cb.draggable = true;
            cb.ondragstart = this.onOffDragStart;
            cb.ondragend = this.onOffDragEnd;
            //TODO
            // Environment.sc.D.aL(cb, "mouseenter", this.contextmenu);
            // @ts-ignore
            Bar.barElementContainer.push(cb);
            // @ts-ignore-start
            Bar.barElementContainer.push(environment_5.Environment.sc.DOM.crCB(e, (function (e) {
                instance.offset.off = e;
                if (e === false) {
                    instance.offset.x = 0;
                    instance.offset.y = 0;
                }
                // @ts-ignore
                instance.repaintBar(Bar.barElementContainer, Bar.menus);
            })));
            // @ts-ignore
            Bar.barElementContainer.push(environment_5.Environment.sc.DOM.crIN(e, '', this.restart, null, null, null, [['style.backgroundColor', 'red'], ['style.borderRadius', '2000px']]));
            // @ts-ignore
            Bar.bar = this;
        }
        onOffDragStart(event) {
            this.offset.sx = event.x;
            this.offset.sy = event.y;
        }
        onOffDragEnd(event) {
            this.offset.x += event.x - this.offset.sx; //e.offsetX;
            this.offset.y += event.y - this.offset.sy; //e.offsetY;
            this.repaintBar();
        }
        reload() {
            environment_5.Environment.sc.S.s('youtube_notification_depths', 0);
            location.reload();
        }
        restart() {
            if (this.offset) {
                setTimeout(function () {
                    this.reload();
                }, 1000);
            }
            else {
                let scriptCodes = {};
                environment_5.Environment.sc.D.aL('GM', environment_5.Environment.sc.c.sI.GS.scriptcomm, function (name, old, newval, remote) {
                    if (newval !== 'idle' && newval.mode === 'scriptreturn') {
                        if (newval.file === 'customnorealerrors') {
                            for (let i = document.body.children.length - 1; i > -1; i--) {
                                if (document.body.children[i].nodeName === 'DIVCUSTOM') {
                                    document.body.children[i].remove();
                                }
                                if (document.body.children[i].nodeName === 'ARRAYCONTAINER') {
                                    document.body.children[i].remove();
                                }
                            }
                            if (Bar.menus.menu1 && Bar.menus.menu1[Table_1.Table.recentEventIndex].enabled) {
                                Table_1.Table.recent(Bar.menus.menu1[Table_1.Table.recentEventIndex]);
                            }
                            //if (Bar.menus.menu1 && spamindx && Bar.menus.menu1[spamindx].enabled) {
                            //   bar.spam_switch(m.menu1[spamindx]);
                            //}
                            for (let i = 0; i < environment_5.Environment.sc.c.listenercontainer.length; i++) {
                                if (environment_5.Environment.sc.c.listenercontainer[i].constructor.name === 'Array') {
                                    eval(environment_5.Environment.sc.c.listenercontainer[i][0]).removeEventListener(environment_5.Environment.sc.c.listenercontainer[i][1], eval(environment_5.Environment.sc.c.listenercontainer[i][2]));
                                }
                                else {
                                    window['GM_removeValueChangeListener'](environment_5.Environment.sc.c.listenercontainer[i]);
                                }
                            }
                            environment_5.Environment.sc.c.listenercontainer = new Array(0);
                            for (let i = 0; i < this.buttonContainer.length; i++) {
                                this.buttonContainer[i].remove();
                            }
                            this.buttonContainer = [];
                            environment_5.Environment.sc.S.s('youtube_notification_depths', environment_5.Environment.sc.S.g('youtube_notification_depths', 0) + 1);
                            console.log('reset');
                            environment_5.Environment.sc.G.s(environment_5.Environment.sc.c.sI.GS.scriptcomm, 'idle');
                            for (let i in scriptCodes) {
                                newval.code = newval.code.replace('eval(GM_getResourceText("' + i + '"));', scriptCodes[i]);
                            }
                            eval(newval.code);
                        }
                        else {
                            scriptCodes[newval.file] = newval.code;
                        }
                    }
                });
                environment_5.Environment.sc.G.s(environment_5.Environment.sc.c.sI.GS.scriptcomm, 'idle');
                environment_5.Environment.sc.G.s(environment_5.Environment.sc.c.sI.GS.scriptcomm, { mode: 'getcode', file: 'libraries' });
                environment_5.Environment.sc.D.sT(function () {
                    environment_5.Environment.sc.G.s(environment_5.Environment.sc.c.sI.GS.scriptcomm, { mode: 'getcode', file: 'libfuncitons' });
                    environment_5.Environment.sc.D.sT(function () {
                        environment_5.Environment.sc.G.s(environment_5.Environment.sc.c.sI.GS.scriptcomm, { mode: 'getcode', file: 'customnorealerrors' });
                    }, 200);
                }, 200);
            }
        }
        /*contextmenu(a, b, width = 200, height = 200) {
            function line(rotation, distance = 1) {
                let lineObj = Environment.sc.DOM.crIN(btn, "");
                lineObj.deg = rotation;
                lineObj.style.backgroundColor = "black";
                lineObj.style.position = "fixed";
                lineObj.style.width = "2px";
                lineObj.style.height = width / 2 + "px";
                lineObj.style.top = y - (width / 2) * distance + "px";
                lineObj.style.left = x + "px";
                lineObj.style.border = "0px";
                lineObj.style.padding = "0px";
                lineObj.origColor = "black";
                let bottom = document.createElement("DIVcenter");
                lineObj.append(bottom);
                bottom.style.position = "absolute";
                bottom.style.top = (width / 2) * distance + "px";
                lineObj.rotate = function (deg) {
                    if (deg > 90 || deg < 0) {
                        return -1;
                    }
                    let prev = lineObj.children[0].getBoundingClientRect();
                    lineObj.style.transform = "rotateZ(" + deg + "deg)";
                    let after = lineObj.children[0].getBoundingClientRect();
                    lineObj.style.left = lineObj.style.left.unpx() + (prev.left - after.left) + "px";
                    lineObj.style.top = lineObj.style.top.unpx() + (prev.top - after.top) + "px";
                };
                lineObj.highlight = function () {
                    lineObj.style.width = "3px";
                    lineObj.style.backgroundColor = "blue";
                };
                lineObj.reset = function () {
                    debugger;
                    lineObj.style.width = "2px";
                    lineObj.style.padding = "0px";
                    lineObj.style.backgroundColor = lineObj.origColor;

                };
                lineObj.ready = function () {
                    debugger;
                    lineObj.style.width = "3px";
                    lineObj.style.backgroundColor = "green";
                    lineObj.origColor = "green";
                };
                lineObj.rotate(rotation);
                return lineObj;
            }
            function hasFilter(menu, button) {
                if (button[menu.filter] === undefined) {
                    return button.parentElement === document.body ? false : hasFilter(menu, button.parentElement);
                }
                if (menu.filterValue && button[menu.filter] !== menu.filterValue) {
                    return button.parentElement === document.body ? false : hasFilter(menu, button.parentElement);
                }
                return true;
            }
            let menuct = find("divMenuContainer");
            if (!height) {
                height = width;
            }
            if (!menuct) {
                menuct = sc.menuct = document.createElement("divMenuContainer");
                container.appendChild(menuct);
                menuct.set = function set(btn) {
                    if (menuct.btn) {
                        menuct.btn.remove();
                    }
                    menuct.btn = btn;
                    return btn;
                };
            }
            if (sc.c.customMenu && sc.c.customMenu.length > 0) {
                let btn = menuct.set(sc.DOM.crIN(menuct, ""));// circle in background
                btn.style.position = "fixed";
                btn.style.height = height + "px";
                btn.style.width = width + "px";
                btn.style.backgroundColor = "white";
                btn.style.borderRadius = width / 2 + "px";
                let y = window.innerHeight - 27;
                btn.top = y - (width / 2);
                let x = 2;
                btn.left = x - (width / 2);
                btn.style.top = btn.top + "px";
                btn.style.left = btn.left + "px";
                btn.style.zIndex = zIndex - 2000;
                btn.calculateIndex = function (ev) {
                    let radius = btn.style.width.unpx() / 2;
                    var center = new sc.M.Vector2(btn.style.left.unpx() + radius, btn.style.top.unpx() + radius);
                    var no = new sc.M.Vector2(ev.x, ev.y).sub(center).normalized();
                    no.y *= -1;
                    var deg = Math.atan2(no.y, no.x) * 180 / Math.PI;
                    if (deg < 0) {
                        deg += 360;
                    }
                    var ar = this.ar;
                    var index = 0;
                    for (var i = 0; i < ar.length; i++) {
                        if (deg > ar[i].deg) {
                            index = i + 1;
                        } else {
                            break;
                        }
                    }
                    return index;
                };
                btn.onclick = function (e) {
                    var obj = this.ar[this.calculateIndex(e)];
                    if (obj) {
                        if (obj.menu) {
                            var menu = obj.menu;
                            var object = e.target;
                            var p1 = object.parentElement;
                            var p2 = p1.parentElement;
                            if ((object.btn2 && object.btn2.menu === menu.name) || (p1.btn2 && p1.btn2.menu === menu.name) || (p2.btn2 && p2.btn2.menu === menu.name)) {
                                return;
                            }
                            btn.clicked = true;
                            console.log("new button");
                            var btn2 = btn.btn2 = sc.DOM.crIN(btn, "");
                            btn2.menu = menu.name;
                            btn2.style.position = "fixed";
                            btn2.style.height = height + 200 + "px";
                            btn2.style.width = width + 200 + "px";
                            btn2.style.backgroundColor = "rgba(255, 255, 255, 0.94)";
                            btn2.style.borderRadius = 200 + (width / 2) + "px";
                            btn2.style.top = y - (width + 200 / 2) + 100 + "px";
                            btn2.style.left = x - (width + 200 / 2) + 100 + "px";
                            btn2.style.zIndex = zIndex - 2000;
                            btn2.onmouseleave = function () {
                                if (sc.menuct && sc.menuct.btn) {
                                    sc.menuct.btn.remove();
                                }
                            };
                            var nextline = new line(90, 2);
                            for (var i = 0; i < menu.ar.length; i++) {
                                menu.ar[i].leftLine = nextline;
                                var deg = 90 - (90 / menu.ar.length) * (i + 1);
                                menu.ar[i].rightLine = nextline = new line(deg, 2);
                                menu.ar[i].deg = (90 / menu.ar.length) * (i + 1);
                                menu.ar[i].position = { index: i, amount: menu.ar.length };
                                var name = sc.DOM.crIN(btn2, menu.ar[i].textContent);
                                for (var j in menu.ar[i].style) {
                                    name.style[j] = menu.ar[i].style[j];
                                }
                                name.style.visibility = "visible";
                                name.style.transform = "rotate(" + (deg - 90) + "deg)";
                                name.style.border = 0;
                                name.style.padding = 0;
                                name.style.zIndex = zIndex;
                                var textdeg = (((90 / menu.ar.length) * (i + i + 1)));
                                name.style.left = x + ((Math.cos(textdeg * Math.PI / 360) * (0.8 * width)) - name.clientWidth / 2) + "px";
                                name.style.top = y - ((Math.sin(textdeg * Math.PI / 360) * (0.8 * width)) - name.clientHeight / 2) + "px";
                                name.onmouseenter = function (a) {
                                    a.target.bColor = a.target.style.backgroundColor;
                                    a.target.style.backgroundColor = "grey";
                                };
                                name.onmouseleave = function () {
                                    this.style.backgroundColor = this.bColor;
                                };
                                name.fnc = menu.ar[i].childNodes[0].onclick;
                                name.hrefs = menu.ar[i].hrefs;
                                name.onclick = function (e) {
                                    this.fnc(e);
                                };
                            }
                        } else {
                            obj.fnc(e, a);
                        }
                    }
                };
                btn.onmousemove = function (e) {
                    if (this.ar[this.calculateIndex(e)] && this.ar[this.calculateIndex(e)].menu) {
                        var menu = this.ar[this.calculateIndex(e)].menu;
                        var object = e.target;
                        var p1 = object.parentElement;
                        var p2 = p1.parentElement;
                        if ((object.btn2 && object.btn2.menu === menu.name) || (p1.btn2 && p1.btn2.menu === menu.name) || (p2.btn2 && p2.btn2.menu === menu.name)) {
                            return;
                        }
                        btn.clicked = true;
                        console.log("new button");
                        var btn2 = btn.btn2 = sc.DOM.crIN(btn, "");
                        btn2.menu = menu.name;
                        btn2.style.position = "fixed";
                        btn2.style.height = height + 200 + "px";
                        btn2.style.width = width + 200 + "px";
                        btn2.style.backgroundColor = "rgba(255, 255, 255, 0.94)";
                        btn2.style.borderRadius = 200 + (width / 2) + "px";
                        btn2.style.top = y - (width + 200 / 2) + 100 + "px";
                        btn2.style.left = x - (width + 200 / 2) + 100 + "px";
                        btn2.style.zIndex = zIndex - 2000;
                        btn2.onmouseleave = function () {
                            if (sc.menuct && sc.menuct.btn) {
                                sc.menuct.btn.remove();
                            }
                        };
                        var nextline = new line(90, 2);
                        for (var i = 0; i < menu.ar.length; i++) {
                            menu.ar[i].leftLine = nextline;
                            var deg = 90 - (90 / menu.ar.length) * (i + 1);
                            menu.ar[i].rightLine = nextline = new line(deg, 2);
                            menu.ar[i].deg = (90 / menu.ar.length) * (i + 1);
                            menu.ar[i].position = { index: i, amount: menu.ar.length };
                            var name = sc.DOM.crIN(btn2, menu.ar[i].textContent);
                            for (var j in menu.ar[i].style) {
                                name.style[j] = menu.ar[i].style[j];
                            }
                            name.style.visibility = "visible";
                            name.style.transform = "rotate(" + (deg - 90) + "deg)";
                            name.style.border = 0;
                            name.style.padding = 0;
                            name.style.zIndex = zIndex;
                            textdeg = (((90 / menu.ar.length) * (i + i + 1)));
                            name.style.left = x + ((Math.cos(textdeg * Math.PI / 360) * (0.8 * width)) - name.clientWidth / 2) + "px";
                            name.style.top = y - ((Math.sin(textdeg * Math.PI / 360) * (0.8 * width)) - name.clientHeight / 2) + "px";
                            name.onmouseenter = function (a) {
                                a.target.bColor = a.target.style.backgroundColor;
                                a.target.style.backgroundColor = "grey";
                            };
                            name.onmouseleave = function () {
                                this.style.backgroundColor = this.bColor;
                            };
                            name.fnc = menu.ar[i].childNodes[0].onclick;
                            name.hrefs = menu.ar[i].hrefs;
                            name.onclick = function (e) {
                                this.fnc(e);
                            };
                        }
                    } else {
                        for (var i = 0; i < this.ar.length; i++) {
                            this.ar[i].reset();
                        }
                        this.ar[this.calculateIndex(e)].highlight();
                    }
                };
                btn.onmouseleave = function () {
                    if (sc.menuct && sc.menuct.btn) {
                        sc.menuct.btn.remove();
                    }
                };
                sc.D.aL(document, "click", function () {
                    try {
                        if (menuct.btn && !menuct.btn.clicked) {
                            menuct.btn.remove();
                        }
                    } catch (err) {

                    }
                });
                var nextline = new line(90);
                btn.ar = sc.c.customMenu.slice();

                for (var i = btn.ar.length - 1; i > -1; i--) {
                    if (btn.ar[i].filter) {
                        if (hasFilter(btn.ar[i], a.target) === false) {
                            btn.ar.remI(i);
                        }
                    }
                }
                debugger;
                for (var i = 0; i < btn.ar.length; i++) {
                    btn.ar[i].leftLine = nextline;
                    var deg = 90 - (90 / btn.ar.length) * (i + 1);
                    btn.ar[i].rightLine = nextline = new line(deg);
                    btn.ar[i].deg = (90 / btn.ar.length) * (i + 1);
                    btn.ar[i].position = { index: i, amount: btn.ar.length };
                    var name = sc.DOM.crIN(btn, btn.ar[i].displayName || btn.ar[i].name, undefined, undefined, undefined, undefined, btn.ar[i].style);
                    sc.c.customMenu[i].btn = name;
                    name.style.border = 0;
                    name.style.padding = 0;

                    textdeg = 90 - ((btn.ar[i].leftLine.deg + btn.ar[i].rightLine.deg) / 2);
                    name.style.left = x + ((Math.cos(textdeg * Math.PI / 180) * (0.6 * width / 2)) - name.clientWidth / 2) + "px";//
                    name.style.top = y - (Math.sin(textdeg * Math.PI / 180) * (0.6 * width / 2)) - name.clientHeight / 2 + "px";//
                    name.style.transform = "rotate(" + (-textdeg) + "deg)";
                }
                sc.D.sT(function () {
                    try {
                        if (menuct.btn && !menuct.btn.clicked) {
                            //menuct.btn.remove();
                        }
                    } catch (err) {
                    }
                }, 1000);
            }
        }*/
        switchEnabled(a, isClick = true) {
            let ago = environment_5.Environment.sc.T.n() - 1000;
            // @ts-ignore
            if (isClick == true || Bar.bar.OnOffTimer < ago) {
                // @ts-ignore
                Bar.bar.OnOffTimer = environment_5.Environment.sc.T.n();
                // @ts-ignore
                Bar.bar.isEnabled = !Bar.bar.isEnabled;
                // @ts-ignore
                if (Bar.bar.isEnabled === false) {
                    // @ts-ignore
                    Bar.bar.offset.x = 0;
                    // @ts-ignore
                    Bar.bar.offset.y = 0;
                }
                if (Bar.menus.menu1 && Bar.menus.menu1.menuElements[Table_1.Table.recentEventIndex].enabled) {
                    Table_1.Table.recent(Bar.menus.menu1.menuElements[Table_1.Table.recentEventIndex]);
                }
                //if (m.menu1 && spamindx && m.menu1.ar[spamindx].enabled) {
                //    bar.spam_switch(Bar.menus.menu1.ar[spamindx]);
                //}
                // @ts-ignore
                Bar.bar.repaintBar(Bar.barElementContainer, Bar.menus);
            }
        }
        // @ts-ignore
        repaintBar(a = Bar.barElementContainer, menuA = Bar.menus) {
            if (a === undefined) {
                // @ts-ignore
                a = Bar.barElementContainer;
            }
            let width;
            let backgroundcolor = 'white';
            let txtcolor = '#333'; //black
            let barcolor = '#333';
            let ontop = 4;
            let standardElementHeight = 23;
            if (a.length > 0) {
                width = (window.innerWidth - 120) / (a.length - ontop);
            }
            if (location.href.indexOf('twitter') > -1) {
                backgroundcolor = '#1DA1F2';
            }
            else if (location.href.indexOf('kissanime') > -1) {
                backgroundcolor = '#161616';
                txtcolor = '#d5f406';
                barcolor = '#111111';
            }
            else if (location.href.indexOf('kissmanga') > -1) {
                backgroundcolor = '#161616';
                txtcolor = '#72cefe';
                barcolor = '#111111';
            }
            else if (location.href.indexOf('instagram') > -1) {
                backgroundcolor = '#fafafa';
                barcolor = '#333';
            }
            else if (location.href.indexOf('facebook') > -1) {
                backgroundcolor = '#fafafa';
                barcolor = '#333';
            }
            else if (location.href.indexOf('youtube') > -1) {
                backgroundcolor = '#fafafa';
                barcolor = '#333';
            }
            else if (location.href.indexOf('bs.to') > -1) {
                backgroundcolor = '#07559a';
                barcolor = '#333';
            }
            else if (location.href.indexOf('cine.to') > -1) {
                backgroundcolor = '#fff';
                //barcolor="#333";
            }
            for (let i = 0; i < a.length; i++) {
                let height;
                a[i].style.position = 'fixed';
                a[i].style.color = txtcolor;
                a[i].style.border = '0px';
                if (i === 0) { //bar
                    height = standardElementHeight + 2;
                    a[i].style.zIndex = environment_5.Environment.zIndex - 1;
                    a[i].style.left = '0px';
                    a[i].style.width = window.innerWidth + 'px';
                    a[i].style.backgroundColor = barcolor;
                    a[i].style.visibility = this.isEnabled ? 'visible' : 'hidden';
                }
                else if (i === 1 || i === 2 || i === 3) { //stay on top
                    height = standardElementHeight;
                    a[i].style.zIndex = environment_5.Environment.zIndex;
                    a[i].style.left = ((this.isEnabled ? 0 : this.offset.x) + 5 + (i - 1) * 40).toString() + 'px';
                    a[i].style.width = '40px';
                    if (i === 1) {
                        a[i].children[0].textContent = Bar.getonoff();
                        if (a[i].update === undefined) {
                            a[i].style.backgroundColor = backgroundcolor;
                        }
                    }
                    if (i === 3) {
                        a[i].style.width = height + 'px';
                    }
                }
                else {
                    height = standardElementHeight;
                    a[i].style.zIndex = environment_5.Environment.zIndex;
                    a[i].style.left = (10 + (width * (i - ontop)) + 105).toString() + 'px';
                    a[i].style.width = a[i].type === 'text' ? width - 10 + 'px' : width - 5 + 'px';
                    if (a[i].children[0] === undefined) {
                        a[i].style.backgroundColor = backgroundcolor;
                    }
                    else {
                        //slider as children of button
                    }
                    a[i].style.visibility = this.isEnabled ? 'visible' : 'hidden';
                }
                let top = (window.innerHeight - height) + 1;
                try {
                    if (document.body.scrollWidth + 17 > window.innerWidth) {
                        //sc.D.l(document.body.scrollWidth+"+17 > "+window.innerWidth,0);
                        //top-=20;
                    }
                }
                catch (e) {
                    environment_5.Environment.sc.D.e(e);
                }
                if (find_2.default.W().innerHeight === 637) {
                    if (location.href.indexOf('http://movpod.in/') > -1 || location.href.indexOf('asfsaaasfdghjkl') > -1 || location.href.indexOf('asfasfasf') > -1) {
                        //top -= 18;
                    }
                }
                if (location.href.indexOf('asdfghjk') > -1 || location.href.indexOf('asfsaaasfdghjkl') > -1 || location.href.indexOf('asfasfasf') > -1) {
                    top += 20;
                }
                if (this.offset.off && this.offset.x > 0 && this.offset.y > 0) {
                    top -= 20;
                }
                a[i].style.height = height + 'px';
                a[i].style.top = (this.isEnabled ? 0 : this.offset.y) + top + 'px';
            }
            for (let k in menuA) {
                if (k === 'size' || menuA[k] === undefined) {
                    continue;
                }
                try {
                    menuA[k].setVisibility();
                }
                catch (error) {
                }
                try {
                    let parentElementTop = menuA[k].parent.style.top.replace('px', '') - 0;
                    let parentElementHeight = menuA[k].parent.style.height.replace('px', '') - 0;
                    let parentLeft = menuA[k].parent.style.left.replace('px', '') - 0;
                    let parentWidth = menuA[k].parent.style.width.replace('px', '') - 0;
                    for (let ij = 0; ij < menuA[k].menuElements.length; ij++) {
                        let heightk = standardElementHeight;
                        let element;
                        if (menuA[k].menuElements[ij].isMenu === true) {
                            element = menuA[k].parent;
                        }
                        else {
                            element = menuA[k].menuElements[ij];
                        }
                        element.style.position = 'fixed';
                        element.style.height = heightk + 1 + 'px';
                        element.style.width = width - 3 + 'px';
                        element.style.zIndex = environment_5.Environment.zIndex;
                        //element.style.backgroundColor = backgroundcolor;
                        element.style.color = txtcolor;
                        element.style.border = '1px solid';
                        element.style.borderColor = barcolor;
                        element.style.top = parentElementTop - ((parentElementHeight + 1) * (ij + 1)) - 1 + 'px';
                        if (menuA[k].level === 2 || menuA[k].parent.level === 2) {
                            let left = parentLeft;
                            if (left < (window.innerWidth / 2)) {
                                left += parentWidth;
                            }
                            else {
                                left -= parentWidth;
                            }
                            element.style.left = left + 'px';
                        }
                        else {
                            element.style.left = parentLeft + 'px';
                        }
                    }
                }
                catch (error) {
                    continue;
                }
            }
        }
        getonoff() {
            return this.isEnabled ? 'ON' : 'OFF';
        }
        static setEnabled(enabled = true) {
            // @ts-ignore
            this.bar.isEnabled = enabled;
        }
        static switchEnabled() {
            // @ts-ignore
            this.bar.switchEnabled();
        }
        static reload() {
            // @ts-ignore
            this.bar.reload();
        }
        // @ts-ignore
        static repaintBar(a = Bar.barElementContainer, menuA = Bar.menus) {
            // @ts-ignore
            if (this.bar) {
                // @ts-ignore
                this.bar.repaintBar(a, menuA);
            }
        }
        static getonoff() {
            // @ts-ignore
            return this.bar.getonoff();
        }
        static getTabs(menu) {
            [
                {
                    text: 'reset',
                    onclick: () => {
                        environment_5.Environment.sc.G.s(environment_5.Environment.sc.c.sI.GS.currentTabs, []);
                        menu.menuElements = [];
                        Bar.repaintBar();
                    }
                },
                {
                    text: 'open all',
                    onclick: () => {
                        for (let tab of environment_5.Environment.sc.G.g(environment_5.Environment.sc.c.sI.GS.currentTabs, [])) {
                            if (tab.url != location.href) {
                                environment_5.Environment.sc.D.o(tab.url);
                            }
                        }
                    }
                }, ...environment_5.Environment.sc.G.g(environment_5.Environment.sc.c.sI.GS.currentTabs, []).map((tab) => {
                    return {
                        text: tab.text,
                        onclick: () => { console.log(tab.url); }
                    };
                })
            ].forEach(el => menu.addElement(environment_5.Environment.sc.DOM.crIN(menu.container, el.text, el.onclick)));
        }
    }
    Bar.menus = {};
    exports.Bar = Bar;
});

define('sc/debug', ['require', 'exports', 'environment', 'sc/find'], function (require, exports, environment_6, find_3) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Debug {
        constructor(sc) {
            this.sc = sc;
            this.d = 5; //loglevel
            this.c = true;
            this.n = 0;
            this.sites = 0;
        }
        aL(object, string, fn, value1) {
            let instance = this;
            let stackTrace;
            try {
                throw Error('location');
            }
            catch (e) {
                stackTrace = e;
            }
            function runcaught(a, b) {
                try {
                    fn(a, b, value1);
                }
                catch (e) {
                    e.cause = stackTrace;
                    instance.e(e);
                }
            }

            if (object === 'GM') {
                if (value1 && value1.target.script === 'sec') {
                    find_3.default.W()['sec'].l(string, runcaught, value1);
                }
                else {
                    this.sc.c.listenercontainer.push(this.sc.G.l(string, runcaught, value1));
                }
            }
            else if (string === 'att') {
                let obs = new MutationObserver(runcaught);
                obs.observe(object, { attributes: true, childList: true, characterData: true, subtree: true });
            }
            else {
                this.sc.c.listenercontainer.push([object, string, runcaught]);
                object.addEventListener(string, runcaught);
            }
        }
        o(url, indexurl = location.href, focus = this.sc.G.g('standardopeninnewtab', true), sametab = false) {
            if (sametab) {
                location.href = url;
                return window;
            }
            else {
                if (!focus) {
                    let win = window['GM_openInTab'](url, { active: false, insert: false }); //active ~focused insert: append at end or after the current tab
                    win.name = window.name;
                    if (win == undefined) {
                        alert('didnt open tab :o');
                    }
                    return win;
                }
                else {
                    let win = find_3.default.W()['opencopy'](url);
                    if (win) {
                        win.url = indexurl;
                    }
                    return win;
                }
            }
        }
        s(object, identifier, attribute) {
            let instance = this;
            if (attribute.constructor.name === 'Function') {
                object[identifier] = function () {
                    if (this.c) {
                        try {
                            attribute();
                        }
                        catch (error) {
                            instance.e(error);
                        }
                    }
                    else {
                        attribute();
                    }
                };
            }
            else {
                object[identifier] = attribute;
            }
        }
        e(text, callstack = '', value = 5, prefix = '') {
            let instance = this;
            function getLine(line) {
                let returnString = '';
                let lineArray = line.split('id=')[1];
                let values;
                if (line.includes('<anonymous>')) {
                    returnString += 'other:';
                    returnString += line.split('at ')[1].split(' (eval')[0];
                    values = lineArray.split('<anonymous>')[1].split(')')[0].split(':');
                }
                else {
                    returnString += 'main:';
                    returnString += line.split('at ')[1].split(' (eval')[0];
                    values = lineArray.split(')')[0].split(':');
                }
                //1858 -5  ,1779 -5 1592 -5 522 -5  54 -5   -> -5 on customnorealerrors.js ?
                let lineNumberInFile;
                let lineIndex = environment_6.Environment.startLine;
                let currentScriptName = null;
                let scriptContent = window['GM_getResourceText']('main');
                let previousStartLine = lineIndex;
                let scripts = scriptContent.split('define(\"');
                for (let index = 1; index < scripts.length; index++) {
                    let scriptContent = scripts[index];
                    let scriptName = scriptContent.split('\", [')[0];
                    let lines = scriptContent.split('\n');
                    let previousStartLine = lineIndex;
                    lineIndex += lines.length - 1;
                    console.log(scriptName + ' starts at ' + previousStartLine);
                    if (lineIndex > values[1]) {
                        lineNumberInFile = values[1] - previousStartLine;
                        let line = lines[lineNumberInFile];
                        if (!line) {
                            line = '';
                        }
                        returnString = 'file: ' + scriptName;
                        if (instance.sites == 1) {
                            // @ts-ignore
                            returnString += '\n' + instance.lastSiteRun.href.toString();
                        }
                        returnString += ' / line:' + line.trim();
                        break;
                    }
                }
                return returnString;
            }
            if (this.d <= value) {
                let line = '';
                let consoleString = '';
                if (text.stack === undefined) {
                    line = '';
                }
                else if (text.stack.indexOf('Error') === -1) {
                    line = text.stack;
                    consoleString = text.stack;
                }
                else {
                    line = 'line:';
                    let foundLine = false;
                    let lines = text.stack.split('\n');
                    if (text.cause) {
                        let cause = text.cause.stack.split('\n');
                        lines = [...lines, 'cause:' + cause[1]];
                    }
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].includes('id=')) {
                            consoleString += getLine(lines[i]) + ' - ' + lines[i].split(' (')[0] + '\n';
                            if (!foundLine) {
                                line += getLine(lines[i]);
                                foundLine = true;
                            }
                        }
                    }
                }
                debugger;
                console.log(location.href + '\n' + prefix + consoleString + '\n' + text);
                this.sc.DOM.GMnot(prefix + location.href, line.substr(0, 44) + '\n' + text, 'https://www.shareicon.net/data/128x128/2017/06/21/887388_energy_512x512.png', function () {
                    instance.sc.G.toClipboard(text.stack);
                });
                try {
                    console.error(line + '\n' + this.sc.T.n() + ' ; ' + prefix + text.stack + '\n' + callstack);
                }
                catch (e) {
                    this.e(e);
                }
            }
        }
        l(text, value = 5, stack = false) {
            if (this.d <= value) {
                if (stack) {
                    let array = new Array(0);
                    try {
                        array[1] = array[2][2];
                    }
                    catch (e) {
                        try {
                            console.trace(this.sc.T.n() + '; ' + text + '\n' + e.stack.replace(e.message, '').replace('TypeError:', '').replace('\n', '').replace(' ', ''));
                        }
                        catch (er) {
                            this.e(er);
                        }
                    }
                }
                else {
                    try {
                        console.trace(this.sc.T.n() + '; ' + text);
                    }
                    catch (er) {
                        this.e(er);
                    }
                }
            }
        }
        sT(fnc, time, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
            let instance = this;
            let fnst = fnc.toString();
            this.sc.c.timers = this.sc.c.timers.filter((timer) => {
                if (timer.fcn == fnst) {
                    clearTimeout(timer.id);
                    return false;
                }
                return true;
            });
            let id = setTimeout(function scDsTTimeout(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
                if (instance.sc.D.c) {
                    /* fnccopy = fnc;
                     var spl = (fnccopy + "").split("{");
                     func = "return " + spl[0] + "{\n try";
                     for (var i = 1; i < spl.length; i++) {
                     func += "{" + spl[i];
                     }
                     func += "catch(error){\n\tsc.D.e(error);\n}};";
                     new Function(func)()(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);*/
                    try {
                        fnc(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
                    }
                    catch (error) {
                        instance.e(error);
                    }
                }
                else {
                    fnc(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
                }
            }, time, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
            this.sc.c.timers.push({ id: id, fnc: fnst });
            return id;
        }
        rek(string, fnc, timeout = 200) {
            let instance = this;
            function rec(string, fnc) {
                if (find_3.default(string)) {
                    fnc();
                }
                else {
                    instance.sT(rec, timeout, string, fnc);
                }
            }
            this.sT(rec, timeout, string, fnc);
        }
    }
    exports.Debug = Debug;
});
// @ts-ignore
define('sc/constants', ['require', 'exports'], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Constants {
        constructor() {
            this.sI = {
                LS: {
                    instantrefresh: 'now',
                    blockhost: 'notallowed',

                    cine_lastvideo_index: 'cinelastvideo',
                    countdown_refreshtimer: 'refreshtimer',
                    rabbit_volume: 'rabbit_volume'
                },
                SS: {
                    crossdomainstorage: 'name',
                    timer_checking: 'checking',
                    timer_paused: 'pause'
                },
                SSCD: {
                    historylog: 'history',
                },
                GS: {
                    eventstorage: 'recentevents',
                    whatsappgroupchats: 'whatsappchats',
                    scriptcomm: 'communication',
                    scriptcomm2: 'communication2',
                    timed_notifications: 'notificationstimed',
                    cinewatchlist: 'watchlist',
                    kissanimecaptcha: 'kissanimecaptchafinished',
                    recentNovels: 'novelplanet',
                    ewatchopenedvideos: 'openedvideos',
                    sitemanager: 'sitemanager',
                    siteurls: 'siteurls',
                    currentTabs: 'currentTabs',
                    sec: {
                        hostsNotAllowedToOpenNewWindows: 'hostsNotAllowedToOpenNewWindows'
                    },
                    mitAlterEgoLastLink: 'mitAlterEgoLastLink'
                }
            };
            this.c = {
                t: {
                    video: 'player-video',
                    textfield: 'tw-textarea',
                    chatcontainer: 'chat-list__lines',
                    whispercontainer: 'conversations-manager ember-view',
                    chatmessage: 'chat-line__message',
                    username: 'top-nav-user-menu__username'
                }
            };
            this.u = {
                cale: 'cale.html?'
            };
            //needs to be same order as require statements for line number
            this.userscripts = ['libraries', 'fnc_bar', 'fnc', 'environment', 'video', 'sites', 'rotate', 'table'];
            this.buttonsfornextinstance = 'nextinstancebuttons';
            this.youtube_save_duration = 48; //how long to save youtube vidoes
            this.followed_csgo_teams = ['fnatic', 'GODSENT', 'FaZe'];
            this.matching_icons = [
                'data:image/png;base64,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',
                'data:image/jpeg;base64,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'
            ]; //to followed_csgo_teams
            this.notification_awareness_string = 'now\nhere';
            this.recent_notifications_amount = 20;
            this.notification_save_duration = 24; //how long to save notifications
            this.notification_check_interval = 1;
            this.twitch_emotes_replacer = ['shrug', ['#', 175, 92, 95, 40, 12484, 41, 95, 47, 175], 'sad', 'BibleThump'];
            this.chat_bot = [['hallo', 'o/ hallo', 'chat'], ['hello', 'o/ hello', 'chat'], ['Kreygasm', 'Kreygasm', 'chat'], ['command', () => { }, 'command']];
            this.twitch_chat_color_timeout = 1000 * 60 * 2;
            this.twitch_chat_bot_coms = [['time', 'sc.T.m2D(sc.T.n() - sc.T.rt)'], ['lottery', '"you have "+(Math.random()>0.5?"won":"lost")']];
            this.twitch_chat_bot_difficulty = 9;
            this.GS_function_call_string = [];
            this.reloadtime = 30 + ((Math.random() - 0.5) * 5); //minutes
            this.checkingtime = 10; //days
            this.setting_completed_to_last_link = false; //sets all completed+unwatched animes+to newest link (might trigger spam/ddos filter)
            this.checkingfornewAnimeenabled = true;
            this.main_runs = 5;
            this.main_sites = [];
            this.site_checkurls = ['http://kissanime.ru/BookmarkList', 'http://kissmanga.com/BookmarkList', 'https://www.hltv.org/'];
            this.site_check_time = 120; //minutes until recheck
            this.scripts = ['lib', 'fnc', 'main'];
            this.timers = [];
            this.customMenu = [];
            this.listenercontainer = [];
            this.circularmenu = null;
            this.menu = {
                backgroundColor: 'white'
            };
            this.chatbot = true;
            this.icons = {
                volume: 'data:image/jpeg;base64,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',
                duration: 'data:image/png;base64,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',
                speed: 'data:image/png;base64,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'
            };
        }
    }
    exports.Constants = Constants;
});
// @ts-ignore
define('sc/time', ['require', 'exports'], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Time {
        constructor(sc) {
            this.sc = sc;
            this.aT = false;
            this.rt = new Date().valueOf();
        }
        n() {
            return new Date().valueOf();
        }
        D(a) {
            try {
                a = JSON.parse(a);
            }
            catch (e) {
                this.sc.D.e(e);
            }
            let t = new Date();
            t.setMilliseconds(t.valueOf() * -1);
            t.setMilliseconds(a);
            return t.toLocaleString();
        }
        m2D(a) {
            let negative = false;
            if (a < 0) {
                negative = true;
                a *= -1;
            }
            let timestamp = a;
            let output = '';
            let time = 0;
            while (timestamp >= 1000 * 60 * 60 * 24 * 365) {
                time++;
                timestamp -= 1000 * 60 * 60 * 24 * 365;
            }
            if (time !== 0) {
                output += time + ' years, ';
            }
            time = 0;
            while (timestamp >= 1000 * 60 * 60 * 24 * 1) {
                time++;
                timestamp -= 1000 * 60 * 60 * 24 * 1;
            }
            if (time !== 0) {
                output += time + ' days, ';
            }
            time = 0;
            while (timestamp >= 1000 * 60 * 60 * 1) {
                time++;
                timestamp -= 1000 * 60 * 60 * 1;
            }
            if (time !== 0) {
                output += time + ' hours, ';
            }
            time = 0;
            while (timestamp >= 1000 * 60 * 1) {
                time++;
                timestamp -= 1000 * 60 * 1;
            }
            if (time !== 0) {
                output += time + ' minutes, ';
            }
            time = 0;
            while (timestamp >= 1000 * 1) {
                time++;
                timestamp -= 1000 * 1;
            }
            output += time + ' seconds';
            if (negative) {
                return '- ' + output;
            }
            return output;
        }
        timeString2milli(timeString) {
            //"1.1.1970, 01:59:59":0
            let rn = this.sc.T.D(this.sc.T.n()).split(', ')[0];
            function date(a) {
                let days = a.split(', ')[0].split('.');
                let t = 0;
                t += (days[0] - 9) * 24 * 60 * 60 * 1000;
                let c = days[1] - 0;
                if (c === 1 || c === 3 || c === 5 || c === 7 || c === 8 || c === 10 || c === 12) {
                    t += (c + 1) * 31 * 24 * 60 * 60 * 1000;
                }
                else if (c === 2) {
                    if (days[2] % 4 === 0) {
                        t += (c + 1) * 29 * 24 * 60 * 60 * 1000;
                    }
                    else {
                        t += (c + 1) * 28 * 24 * 60 * 60 * 1000;
                    }
                }
                else {
                    t += (c + 1) * 30 * 24 * 60 * 60 * 1000;
                }
                t += (days[2] - 1970) * 364 * 24 * 60 * 60 * 1000;
                return t;
            }
            function day(a) {
                let hour = a;
                let t = 0;
                let sec = hour.split(':')[2];
                let min = hour.split(':')[1];
                let orgmin = min;
                let hours = hour.split(':')[0];
                if (sec === '59') {
                    sec = 0;
                }
                else {
                    sec++;
                    min--;
                }
                if (min === '59') {
                    min = 0;
                }
                else {
                    min++;
                    hours--;
                }
                if (hours === '00') {
                    debugger;
                    hours = 23;
                    rn = rn.replace(rn.split('.')[0] + '.' + rn.split('.')[1], (+rn.split('.')[0] - 1) + '.' + rn.split('.')[1]);
                }
                else {
                    hours -= 1;
                }
                t += sec * 1000;
                t += (min) * 60 * 1000;
                t += hours * 60 * 60 * 1000;
                return t;
            }
            let t = 0;
            if (timeString.indexOf(', ') > -1) {
                t += day(timeString.split(', ')[1]);
                t += date(timeString.split(', ')[0]);
            }
            else {
                t += day(timeString);
                t += date(rn);
            }
            return t;
            //TODO:
        }
        t(delay, object, startTime, instantonly = false, refresh = '', preString = '') {
            this.sc.D.l(location.host + ' sc.T.t ' + (startTime + delay - this.n()), 3);
            this.aT = true;
            if (refresh !== '') {
                delay = this.sc.L.g(refresh, '', 0);
                if (delay < 0) {
                    if (object.type === 'text') {
                        object.value = 'disabled';
                    }
                    else {
                        object.innerHTML = 'disabled';
                    }
                    this.aT = false;
                    return;
                }
            }
            else {
                if (delay < 0) {
                    this.aT = false;
                    return;
                }
            }
            if (this.sc.S.g(this.sc.c.sI.SS.timer_checking, 0, 0) !== 1) {
                try {
                    if (object.type === 'text' && !object.isclicked) {
                        object.value = preString + this.m2D(startTime + delay - this.n()) + ' seconds until refresh';
                    }
                    else {
                        object.innerHTML = preString + this.m2D(startTime + delay - this.n()) + ' seconds until refresh';
                    }
                    //commented on ts migration
                    //bar.updateswitch();
                }
                catch (e) {
                    this.sc.D.e(e);
                    this.sc.D.l(this.m2D(startTime + delay - this.n()) + ' seconds until refresh instnatonly :' + instantonly, 0);
                }
                if (location.href === this.sc.L.g(this.sc.c.sI.LS.instantrefresh, -1, 0)) {
                    this.sc.D.l('refreshing on instant ');
                    this.sc.L.s(this.sc.c.sI.LS.instantrefresh, -1, 0);
                    this.aT = false;
                    location.reload();
                }
                if (this.n() > startTime + delay && !instantonly) {
                    var lastreload = this.sc.G.g('lastreload', 0);
                    var reloadtimeout = 2; //minutes
                    if (lastreload[0] + (1000 * 60 * reloadtimeout) < this.n()) {
                        this.sc.G.s('lastreload', [this.n(), location.href]);
                        this.sc.D.l('reloading');
                        location.reload();
                        this.aT = false;
                        return;
                    }
                    else {
                        console.log('last reload < ' + reloadtimeout + ' from ' + lastreload[1] + 'difference: ' + (lastreload[0] + (1000 * 60 * reloadtimeout)) + ' now : ' + this.n());
                        console.log('next check in ' + this.m2D((lastreload[0] + (1000 * 60 * reloadtimeout)) - this.n()));
                        this.sc.D.sT(this.t, (lastreload[0] + (1000 * 60 * reloadtimeout)) - this.n(), delay, object, startTime, instantonly, refresh, preString);
                        return;
                    }
                }
                else {
                    this.sc.D.sT(this.t, 1000, delay, object, startTime, instantonly, refresh, preString);
                }
            }
            else {
                if (object.type === 'text' && !object.isclicked) {
                    object.value = 'checking disabled';
                }
                else {
                    object.innerHTML = 'currently checking';
                }
                if (!this.sc.S.g('final', false)) {
                    this.sc.D.sT(this.t, 1000, delay + 1000, object, startTime, instantonly, refresh, preString);
                }
                else {
                    this.aT = false;
                    return;
                }
            }
        }
    }
    exports.Time = Time;
});
// @ts-ignore
define('sc/DOM/DOM', ['require', 'exports', 'environment'], function (require, exports, environment_9) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class DOM {
        constructor(sc) {
            this.sc = sc;
        }
        style(btn, style) {
            if (style) {
                if (style.constructor.name === 'Object') {
                    for (let j in style) {
                        if (style[j].constructor.name === 'Object') {
                            for (let k in style[j]) {
                                btn[j][k] = style[j][k];
                            }
                        }
                        else {
                            btn[j] = style[j];
                        }
                    }
                }
                else {
                    for (let i = 0; i < style.length; i++) {
                        eval('btn.' + style[i][0] + '=' + JSON.stringify(style[i][1]));
                    }
                }
            }
        }

        textFieldKeyDown(onEnter, object) {
            return function (e) {
                try {
                    environment_9.Environment.sc.D.l(e);
                    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                        onEnter(object, object.value, 0);
                    }
                }
                catch (err) {
                    environment_9.Environment.sc.D.e(err);
                }
            };
        }
        textFieldOnClick(purging, object) {
            return function (e) {
                try {
                    if (purging === true || object.value === purging) {
                        object.value = '';
                    }
                    object.isclicked = true;
                }
                catch (err) {
                    environment_9.Environment.sc.D.e(err);
                }
            };
        }
        sliderInput(onclick) {
            return function (e) {
                environment_9.Environment.sc.D.l(e);
                try {
                    onclick(e.target, (e.target.value), 1);
                }
                catch (err) {
                    environment_9.Environment.sc.D.e(err);
                }
            };
        }
        crSL(appendto, onclick, startvalue, icon, runOnclickOnBuild = true) {
            // @ts-ignore
            let background = this.crIN(appendto, ' ');
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
            let obs = new MutationObserver((function (a, b) {
                let element = a[0].target;
                // @ts-ignore
                let w = element.style.width;
                // @ts-ignore
                element.children[0].style.width = (+w.replace('px', '') - 20) + 'px';
            }));
            obs.observe(background, { attributes: true });
            object.type = 'range';
            object.id = 'custom_script' + this.sc.D.n++;
            object.value = startvalue;
            if (onclick !== null && onclick !== undefined) {
                object.oninput = this.sliderInput(onclick);
                try {
                    if (runOnclickOnBuild) {
                        onclick(object, (object.value), 1);
                    }
                }
                catch (err) {
                }
            }
            return background;
        }
        InFrame() {
            try {
                return window.self !== window.top;
            }
            catch (e) {
                return true;
            }
        }
        fireEvent(object, key) {
            let event = document.createEvent('Event');
            event.initEvent('keydown', true, true);
            event['keyCode'] = key;
            object.dispatchEvent(event);
            let oEvent = document.createEvent('KeyboardEvent');
            let k = 32;
            Object.defineProperty(oEvent, 'keyCode', {
                get: function () {
                    return k;
                }
            });
            Object.defineProperty(oEvent, 'which', {
                get: function () {
                    return k;
                }
            });
            oEvent.initKeyboardEvent('input', true, true, document.defaultView, k + '', k, k + '', false, k + '');
            oEvent['keyCodeVal'] = k;
            object.dispatchEvent(oEvent);
        }
        not(title, iconurl, body, onclick, openurl, timeout = 8, actuallysend = false, host = location.host) {
            let instance = this;
            function recenteventsadding(note) {
                let ar2 = instance.sc.G.g(instance.sc.c.sI.GS.eventstorage, new Array(0));
                if (title !== instance.sc.c.notification_awareness_string) {
                    ar2.push(note);
                }
                instance.sc.G.s(instance.sc.c.sI.GS.eventstorage, ar2);
            }
            this.sc.D.l(location.host + ' ' + 'this.sc.DOM.notification(pushes notification to array)', 3);
            if (body === null || body === undefined) {
                body = '';
            }
            if (title === this.sc.c.notification_awareness_string) {
                host = 'undefined_host';
            }
            let timestamp = this.sc.T.n();
            let note = {
                title: title,
                iurl: iconurl,
                body: body,
                fnc: onclick,
                url: openurl,
                timeout: timeout,
                host: host,
                timestamp: timestamp,
                toString: title + ' ' + body + ' ' + host + ' ' + openurl
            };
            if (this.sc.G.g('topbig', new Array(0)).length > 0 || true && !(iconurl && iconurl.indexOf('whatsapp') > -1)) {
                this.normalnotification(title, iconurl, body, onclick, openurl, timeout, actuallysend, host);
            }
            else {
                let ar = this.sc.G.g('events', new Array(0));
                ar.push(note);
                this.sc.G.s('events', ar);
            }
            this.sc.D.sT(recenteventsadding, 100, note);
        }
        normalnotification(title, iconurl = '', body = '', onclick, openurl, timeout = 7, actuallysend = false, host = location.host) {
            let not;
            let options = {};
            options.body = body + (host !== location.host ? '\n' + host : '');
            if (iconurl !== null && iconurl !== '') {
                options.image = iconurl;
                options.onclick = (function (href, onclick) {
                    if (openurl) {
                        return function () {
                            this.sc.D.o(href);
                        };
                    }
                    else if (onclick !== undefined && onclick !== null) {
                        return function () {
                            onclick.call();
                        };
                    }
                })(openurl, onclick);
            }
            // @ts-ignore
            not = this.GMnot(title, body, options);
        }

        validateInput(object, type = 'input', key = 17) {
            let oEvent = document.createEvent('KeyboardEvent');
            Object.defineProperty(oEvent, 'keyCode', {
                get: function () {
                    return key;
                }
            });
            Object.defineProperty(oEvent, 'which', {
                get: function () {
                    return key;
                }
            });
            Object.defineProperty(oEvent, 'code', {
                get: function () {
                    if (key == 32) {
                        return 'Space';
                    }
                    return key;
                }
            });
            Object.defineProperty(oEvent, 'key', {
                get: function () {
                    if (key == 32) {
                        return ' ';
                    }
                    return key;
                }
            });
            //oEvent.initKeyboardEvent(type, true, true, document.defaultView, false, false, false, false, key, key);
            oEvent.initKeyboardEvent('input', true, true, document.defaultView, key + '', key, key + '', false, key + '');
            oEvent['keyCodeVal'] = key;
            object.dispatchEvent(oEvent);
        }
        checkBoxOnClick(onclickf, object) {
            return function (e) {
                this.sc.D.l(e);
                try {
                    onclickf.call(this, object.checked, object, e);
                }
                catch (err) {
                    environment_9.Environment.sc.D.e(err);
                }
            };
        }
        crCB(appendto, onclickf) {
            let object = document.createElement('input');
            appendto.appendChild(object);
            object.type = 'checkbox';
            object.id = 'custom_script' + this.sc.D.n++;
            object.style.webkitAppearance = 'checkbox';
            object.style.opacity = '100';
            object.style.margin = '0px';
            object.onclick = this.checkBoxOnClick(onclickf, object);
            return object;
        }
        crTF(appendto, text, onEnter, purging = true, val, style) {
            let object = document.createElement('input');
            appendto.appendChild(object);
            object['val'] = val;
            object.type = 'width';
            object.value = text;
            object.id = 'custom_script' + this.sc.D.n++;
            object.onkeydown = this.textFieldKeyDown(onEnter, object);
            object.onclick = this.textFieldOnClick(purging, object);
            object.onmouseleave = function (e) {
                object['isclicked'] = false;
            };
            this.style(object, style);
            return object;
        }

        addMenu(name = 'test', fnc, filter, filtervalue, style) {
            if (!fnc) {
                fnc = () => { };
            }
            function menuEl(name, fnc) {
                this.filter = filter;
                this.filterValue = filtervalue;
                this.style = style;
                if (name.constructor.name === 'Menu') {
                    this.name = name.name;
                    this.displayName = name.name;
                    this.menu = name;
                }
                else {
                    this.name = name;
                    this.fnc = function (a, b, c, d) {
                        console.log(this.name);
                        fnc(a, b, c, d);
                    };
                }
                this.reset = function () {
                    this.leftLine.reset();
                    this.rightLine.reset();
                };
                this.highlight = function () {
                    this.leftLine.highlight();
                    this.rightLine.highlight();
                };
            }
            let menuElemnt = new menuEl(name, fnc);
            return environment_9.Environment.sc.c.customMenu.push(menuElemnt) - 1;
        }
        onButtonClick(fncclick, btn) {
            let instance = this;
            return function (event) {
                if (event.target['clickts'] + 500 > event.timeStamp) {
                    console.log(event.timeStamp + ' blocked');
                    return;
                }
                console.log(event.timeStamp);
                event.target['clickts'] = event.timeStamp;
                if (fncclick !== null && fncclick !== undefined) {
                    if (environment_9.Environment.sc.D.c) {
                        try {
                            fncclick(btn);
                        }
                        catch (error) {
                            environment_9.Environment.sc.D.e(error);
                        }
                    }
                    else {
                        fncclick(btn);
                    }
                }
            };
        }
    }
    exports.DOM = DOM;
});
// @ts-ignore
define('sc/Vector2', ['require', 'exports'], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Vector2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.length = Math.sqrt(this.x * this.x + (this.y * this.y));
        }
        sub(vec2) {
            return new Vector2(this.x - vec2.x, this.y - vec2.y);
        }
        normalized() {
            return new Vector2(this.x / this.length, this.y / this.length);
        }

    }
    exports.Vector2 = Vector2;
});
// @ts-ignore
define('Security', ['require', 'exports', 'Bar/Menu', 'environment', 'sc/find'], function (require, exports, Menu_1, environment_10, find_4) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Security {
        constructor(sc, menuParent) {
            this.m2 = [];
            this.m2.push(['crIN', 'removelast', environment_10.Environment.sc.sec.removelast]);
            this.m2.push(['crIN', (find_4.default.W()['sec'].get('enabled') ? 'disable' : 'enable') + ' autoclosescript', environment_10.Environment.sc.sec.switchsec, null, null, null, [['style.backgroundColor', find_4.default.W()['sec'].get('enabled') ? 'red' : 'green'], ['property', 'enabled'], ['propertystring', ' tabclosing'], ['script', 'sec'], ['propertystring', ' autoclose']]]);
            this.m2.push(['crIN', (find_4.default.W()['sec'].get('closenew') ? 'disable' : 'enable') + ' autoclosenew', environment_10.Environment.sc.sec.switchsec, null, null, null, [['style.backgroundColor', find_4.default.W()['sec'].get('closenew') ? 'red' : 'green'], ['property', 'closenew'], ['script', 'sec'], ['propertystring', ' autoclosenew']]]);
            this.m2.push(['crIN', (find_4.default.W()['sec'].get('standardopeninnewtab') ? 'disable' : 'enable') + ' newtabfocus', environment_10.Environment.sc.sec.switchsec, null, null, null, [['style.backgroundColor', find_4.default.W()['sec'].get('standardopeninnewtab') ? 'red' : 'green'], ['property', 'standardopeninnewtab'], ['propertystring', ' newtabfocus'], ['script', 'this']]]);
            var allowed = sc.G.g('allowopen', 1);
            var notallowed = find_4.default.W()['sec'].get('notallowed');
            var res = notallowed.find(el => el == location.host);
            if (res) {
                this.m2.push(['crIN', 'unblockthis', function () {
                    var notallowedSites = find_4.default.W()['sec'].get('notallowed', []);
                    notallowedSites.remI(notallowedSites.f(location.host));
                    find_4.default.W()['sec'].set('notallowed', notallowedSites);
                }]);
            }
            else {
                this.m2.push(['crIN', 'blockthis', environment_10.Environment.sc.sec.block]);
            }
            var Bcolor;
            var text = '';
            if (allowed === 0) {
                text = 'blocked - open only with check';
                Bcolor = 'red';
            }
            else if (allowed === 1) {
                text = 'check - all open allowed';
                Bcolor = 'orange';
            }
            else {
                text = 'open - blocking all open';
                Bcolor = 'green';
            }
            this.m2.push(['crIN', text, environment_10.Environment.sc.sec.switchopen, null, null, null, [['style.backgroundColor', Bcolor], ['property', 'allowopen']]]);
            if (sc.G.g(sc.c.sI.GS.sec.hostsNotAllowedToOpenNewWindows).find(el => el == location.host)) {
                this.m2.push(['crIN', 'aloow Opening', () => {
                    sc.G.filter(sc.c.sI.GS.sec.hostsNotAllowedToOpenNewWindows, (el) => el != location.host);
                }, null, null, null, [['style.backgroundColor', Bcolor], ['property', 'allowopen']]]);
            }
            else {
                this.m2.push(['crIN', 'stopFromOpening', () => {
                    sc.G.p(sc.c.sI.GS.sec.hostsNotAllowedToOpenNewWindows, location.host);
                }, null, null, null, [['style.backgroundColor', Bcolor], ['property', 'allowopen']]]);
            }
        }
        toMenu() {
            return new Menu_1.Menu(undefined, undefined, 'Security', this.m2);
        }
        static libMethods() {
            return {
                removelast: function () {
                    try {
                        //sec is interface to other script
                        var ar = window['sec'].get('restore', new Array(0));
                        var last = window['sec'].get('lastadded', new Array(0));
                        ar.push(last[last.length - 1]);
                        window['sec'].set('restore', ar);
                        last.remI(last.length - 1);
                        window['sec'].set('lastadded', last);
                        environment_10.Environment.sc.DOM.GMnot(last[last.length - 1]);
                    }
                    catch (e) {
                        environment_10.Environment.sc.D.e(e);
                    }
                },
                switchsec: function (btn, overwrite) {
                    try {
                        var prop;
                        if (btn.script === 'sec') {
                            prop = !window['sec'].get(btn.property);
                        }
                        else {
                            prop = !environment_10.Environment.sc.G.g(btn.property);
                        }
                        if (overwrite !== undefined) {
                            prop = overwrite;
                        }
                        else {
                            if (btn.script === 'sec') {
                                window['sec'].set(btn.property, prop);
                            }
                            else {
                                environment_10.Environment.sc.G.s(btn.property, prop);
                            }
                        }
                        btn.innerText = (prop ? 'disable' : 'enable') + btn.propertystring;
                        //btn.innerText = find.W().sec.switchSecurity() ? "disable" : "enable";
                        btn.style.backgroundColor = prop ? 'red' : 'green';
                    }
                    catch (e) {
                        environment_10.Environment.sc.D.e(e);
                    }
                },
                block: function block() {
                    var ar = environment_10.Environment.sc.L.g(environment_10.Environment.sc.c.sI.LS.blockhost, new Array(0));
                    ar.push(location.host);
                    environment_10.Environment.sc.L.s(environment_10.Environment.sc.c.sI.LS.blockhost, ar);
                },
                switchopen: function switchproperty(btn, overwriteval) {
                    var allowed = environment_10.Environment.sc.G.g(btn.property, 1) + 1;
                    debugger;
                    if (allowed > 2) {
                        allowed = 0;
                    }
                    if (overwriteval !== undefined) {
                        allowed = overwriteval;
                    }
                    else {
                        environment_10.Environment.sc.G.s(btn.property, allowed);
                    }
                    var color;
                    var text = '';
                    if (allowed === 0) {
                        text = 'blocked - open only with check';
                        color = 'red';
                    }
                    else if (allowed === 1) {
                        text = 'check - all open allowed';
                        color = 'orange';
                    }
                    else {
                        text = 'open - blocking all open';
                        color = 'green';
                    }
                    btn.innerText = text;
                    btn.style.backgroundColor = color;
                }
            };
        }
    }
    exports.Security = Security;
});
// @ts-ignore
define('sc/Video', ['require', 'exports', 'environment', 'sc/find'], function (require, exports, environment_11, find_6) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Video {
        static getcontainer() {
            let vidCon;
            try {
                if (location.href.indexOf('twitch') > -1) {
                    if (find_6.default(environment_11.Environment.sc.c.c.t.video)) {
                        vidCon = find_6.default(environment_11.Environment.sc.c.c.t.video).children[0];
                    }
                    else {
                        return;
                    }
                }
                else if (location.href.indexOf('/OpenLoad') > -1) {
                    vidCon = document.getElementsByClassName('videocontainer')[0].children[3].children[0];
                }
                else {
                    vidCon = document.getElementsByClassName('video-stream html5-main-video')[0];
                }
            }
            catch (e) {
                environment_11.Environment.sc.D.e(e);
                return;
            }
            return vidCon;
        }
        static un_pause(btn) {
            let vidCon = this.getcontainer();
            if (!vidCon.paused) {
                btn.innerHTML = 'play';
                voldown_up(true, vidCon);
            }
            else {
                btn.innerHTML = 'pause';
                vidCon.volume = Video.volumeset = 0;
                vidCon.click();
                environment_11.Environment.sc.D.sT(voldown_up, 100, false, vidCon);
            }
            function voldown_up(_down, video_, started = false) {
                if (_down) {
                    if (JSON.parse(video_.volume) <= 0) {
                        video_.click(); //pausing
                        environment_11.Environment.sc.D.sT(function () {
                            video_.volume = Video.volumemax;
                        }, 500);
                    }
                    else {
                        video_.volume = Video.volumeset = +JSON.stringify((JSON.parse(video_.volume) - 0.01) < 0 ? 0 : JSON.parse(video_.volume) - 0.01);
                        console.log(video_.volume);
                        environment_11.Environment.sc.D.sT(voldown_up, 100, _down, video_, started);
                    }
                }
                else {
                    if (JSON.parse(video_.volume) <= Video.volumemax) {
                        if (JSON.parse(video_.volume) === 0) {
                            video_.volume = Video.volumeset = 0.001;
                            console.log(video_.volume);
                            environment_11.Environment.sc.D.sT(voldown_up, 200, _down, video_, started);
                        }
                        else {
                            if (JSON.parse(video_.volume) > 0.05) {
                                video_.volume = Video.volumeset = +JSON.stringify((JSON.parse(video_.volume) + 0.05) > 1 ? 1 : JSON.parse(video_.volume) + 0.05);
                                console.log(video_.volume);
                                environment_11.Environment.sc.D.sT(voldown_up, 200, _down, video_, started);
                            }
                            else {
                                video_.volume = Video.volumeset = +JSON.stringify((JSON.parse(video_.volume) * 2) > 1 ? 1 : JSON.parse(video_.volume) * 2);
                                console.log(video_.volume);
                                environment_11.Environment.sc.D.sT(voldown_up, 200, _down, video_, started);
                            }
                        }
                    }
                }
            }
        }
    }
    Video.volumeset = 0.5;
    Video.volumemax = 0.5;
    exports.Video = Video;
});
// @ts-ignore
define('Sites/sites', ['require', 'exports', 'Bar/Site', 'environment', 'sc/Video', 'Bar/Bar', 'Bar/Table', 'Sites/twitter', 'sc/find'], function (require, exports, Site_1, environment_13, Video_1, Bar_3, Table_2, twitter_1, find_8) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Sites {
        static init() {
            new Site_1.Site('www.muenchner-bank.de/banking-private/portal', function () {
                if (find_8.default('stackedFrontletTitle') != undefined && find_8.default('stackedFrontletTitle').innerText == 'Umsatzanzeige' && find_8.default('lblUmsaetzeVonValue') != undefined) {
                    let vonDate = +new Date(find_8.default('lblUmsaetzeVonValue').innerText.split('.').reverse().join('.'));
                    let toDate = +new Date(find_8.default('lblUmsaetzeBisValue').innerText.split('.').reverse().join('.'));
                    if ((toDate - vonDate) / (1000 * 60 * 60 * 24) > 10) {
                        environment_13.Environment.sc.DOM.crIN(find_8.default('cntSalden'), 'archiv', undefined, undefined, undefined, 'https://www.muenchner-bank.de/banking-private/portal?menuId=Postfach', { style: { position: 'absolute', left: '240px', top: '300px', height: '27px', width: '100px', backgroundColor: '#50e61c' } });
                        let elements = find_8.default('tblUmsaetze').children[2].children;
                        let monatlich = 0;
                        let essen = 0;
                        let rest = 0;
                        let gehalt = 0;
                        for (let i = 0; i < elements.length; i++) {
                            let obj = elements[i];
                            let booking = obj.innerText;
                            let amounts = booking.trim().split('\n')[5].split('\t');
                            let amount = amounts[0].replace('.', '').replace(',', '.') - 0;
                            debugger;
                            if (amounts[2].includes('S')) {
                                if (booking.includes('E-CENTER SCHULER FUERT')) {
                                    essen += amount;
                                    obj.style.backgroundColor = 'orange';
                                }
                                else if (booking.includes('VERKEHRS AG NUERNBERG/NUERN')) {
                                    monatlich += amount;
                                    obj.style.backgroundColor = 'aqua';
                                }
                                else if (booking.includes('Miete')) {
                                    monatlich += amount;
                                    obj.style.backgroundColor = 'aqua';
                                }
                                else if (booking.includes('GAA-AUSZAHLUNG')) {
                                    monatlich += amount;
                                    obj.style.backgroundColor = 'aqua';
                                }
                                else {
                                    rest += amount;
                                    obj.style.backgroundColor = 'red';
                                }
                            }
                            else if (booking.includes('LOHN/GEHALT')) {
                                gehalt += amount;
                                obj.style.backgroundColor = 'green';
                            }
                        }
                        let elementWidth = 130;
                        let cssWidth = elementWidth + 'px';
                        let sndWidth = 2 * elementWidth + 'px';
                        let trdWidth = 3 * elementWidth + 'px';
                        environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'monat: ' + monatlich, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: '0px', width: cssWidth, top: '0px' } });
                        environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'essen: ' + Math.round(essen * 100) / 100, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: cssWidth, width: cssWidth, top: '0px' } });
                        environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'rest: ' + Math.round(rest), undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: sndWidth, width: cssWidth, top: '0px' } });
                        let ges = (rest + essen + monatlich);
                        let gesamt = environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'gesamt: ' + Math.round(ges), undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: trdWidth, width: cssWidth, top: '0px' } });
                        environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: '0px', width: cssWidth, top: '23px', backgroundColor: 'green' } });
                        environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: trdWidth, width: cssWidth, top: '23px', backgroundColor: 'green' } });
                        let differenz = environment_13.Environment.sc.DOM.crIN(find_8.default('breadcrumb'), 'diff: ' + Math.round(gehalt - ges), undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: trdWidth, top: '46px', width: cssWidth } });
                        if (gehalt < ges) {
                            gesamt.style.backgroundColor = 'orange';
                            differenz.style.backgroundColor = 'red';
                        }
                        else {
                            gesamt.style.backgroundColor = 'green';
                            differenz.style.backgroundColor = 'green';
                        }
                    }
                }
            });
            new Site_1.Site('kissmanga', function kissmanga() {
                environment_13.Environment.sc.D.sT(function () {
                    if (location.href.indexOf('Manga') > -1 && location.href.indexOf('?id=') > 0) {
                        environment_13.Environment.sc.S.s(environment_13.Environment.sc.c.sI.SS.timer_checking, 1, 0);
                        find_8.default.W().onkeydown = function (e) {
                            if (e.shiftKey) {
                                if (e.key === 'ArrowRight') {
                                    try {
                                        document.getElementById('containerRoot').children[3].children[0].children[1].children[1]['click']();
                                    }
                                    catch (er) {
                                        environment_13.Environment.sc.D.e(er);
                                        location.href = 'http://kissmanga.com/BookmarkList';
                                    }
                                }
                                else if (e.key === 'ArrowLeft') {
                                    try {
                                        history.back();
                                    }
                                    catch (er) {
                                        environment_13.Environment.sc.D.e(er);
                                    }
                                }
                            }
                        };
                        let img = document.getElementById('divImage').children;
                        for (let i = 0; i < img.length; i++) {
                            if (img[i].tagName == 'P') {
                                environment_13.Environment.sc.D.s(img[i], 'onclick', function () {
                                    let next = document.getElementById('containerRoot').children[3].children[0].children[1].children[1];
                                    if (next) {
                                        next['click']();
                                    }
                                    else {
                                        environment_13.Environment.sc.D.l('no further episodes');
                                    }
                                });
                            }
                        }
                        environment_13.Environment.sc.DOM.crIF(document.body, 'http://kissmanga.com/BookmarkList', function onl(If) {
                            return;
                            let list = If.contentDocument.getElementsByClassName('listing')[0].children[0].children;
                            for (let ind = 1; ind < list.length; ind++) {
                                if (list[ind].children[2].children[1].style.display === 'inline') {
                                    if (list[ind].children[1].innerText !== 'Completed' && list[ind].children[1].children[0].href === window.location.href) {
                                        console.log(list[ind].children[0].innerText);
                                        list[ind].children[2].children[1].click();
                                        environment_13.Environment.sc.L.s(environment_13.Environment.sc.c.sI.LS.instantrefresh, 'http://kissmanga.com/BookmarkList');
                                        break;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                            environment_13.Environment.sc.D.sT((function () {
                                If.parentElement.removeChild(If);
                                if (location.href.indexOf('Side-Story---A-Tender-Way-to-Dispel-Magic') > -1) {
                                    let mangalist = find_8.default.C('selectChapter')[0].children;
                                    for (let inx = 0; inx < mangalist.length; inx++) {
                                        if (mangalist[inx].value.indexOf('Chapter-221-005') > -1) {
                                            location.href = mangalist[inx - 1].value;
                                        }
                                    }
                                }
                            }), 1000);
                        });
                    }
                }, 500);
            }, false, 0);
            new Site_1.Site('kissanime', function (urlParams, menuArray) {
                let rootUrl = 'http://kissanime.ru';
                function showcaptcha(btn) {
                    let array = environment_13.Environment.sc.G.g('kissanimecaptchafinished');
                    let custom = array;
                    for (let i in array) {
                        let amount = 3;
                        custom[i][2] = array[i].tags[0];
                        custom[i][1] = array[i].tags[1];
                        if (custom[i].url) {
                            custom[i][3] = [];
                            custom[i][3][0] = array[i].url;
                            custom[i][3].icon = array[i].url;
                            amount++;
                        }
                        custom[i].length = amount;
                    }
                    btn.preparedarray = custom;
                    btn.arrayString = 'kissanimecaptchafinished';
                    btn.resourcetype = 'GS';
                    Table_2.Table.spam_switch(btn, true, false, true);
                }
                function episodes() {
                    function onl(If) {
                        let list = If.contentDocument.getElementsByClassName('listing')[0].children[0].children;
                        let hrefs = environment_13.Environment.sc.G.g('originalhref', new Array(0));
                        for (let ind = 2; ind < list.length; ind++) {
                            if (list[ind].children[2].innerText === ' Unwatched') {
                                if (list[ind].children[1].innerText !== 'Completed' && list[ind].children[1].children[0].href === hrefs[If.index][0]) {
                                    console.log(list[ind].children[0].innerText);
                                    list[ind].children[2].children[1].click();
                                    environment_13.Environment.sc.D.sT((function () {
                                        If.remove();
                                        environment_13.Environment.sc.L.s(environment_13.Environment.sc.c.sI.LS.instantrefresh, rootUrl + '/BookmarkList');
                                    }), 1000);
                                    return;
                                }
                            }
                            else {
                                break;
                            }
                        }
                        hrefs.remI(If.index);
                        environment_13.Environment.sc.G.s('originalhref', hrefs);
                    }
                    function set(i) {
                        let iF = environment_13.Environment.sc.DOM.crIF(document.body, location.origin + '/BookmarkList', onl);
                        iF['index'] = i;
                    }
                    try {
                        function captchasite() {
                            let container = find_8.default.I('formVerify');
                            if (!container) {
                                return;
                            }
                            let images = container.children[1].children[2].children;
                            let tags = container.children[0].children[1].children;
                            let tagcontainer = [];
                            let currentImage = null;
                            for (let i of tags) {
                                if (i.localName === 'span') {
                                    i['draggable'] = true;
                                    let singletags = i.textContent.split(', ');
                                    tagcontainer.push(singletags);
                                }
                            }
                            let database = environment_13.Environment.sc.G.g('kissanimecaptchafinished', []);
                            let contarray = new Array(images.length);
                            let clicked = false;
                            for (let k = 0; k < images.length; k++) {
                                function check(img, valid, index) {
                                    let found = false;
                                    let imagedata;
                                    for (let i = 0; i < database.length; i++) {
                                        if (img[index][3].data === database[i].imgdata) {
                                            for (let ind = tagcontainer.length - 1; ind > -1; ind--) {
                                                if (database[i].tags.f(tagcontainer[ind][0]) > -1 && database[i].tags.f(tagcontainer[ind][1]) > -1) {
                                                    found = true;
                                                    tagcontainer.splice(ind, 1);
                                                }
                                            }
                                            let tagstring = '';
                                            for (let ind in database[i].tags) {
                                                tagstring += database[i].tags[ind] + ', ';
                                            }
                                            let btn = environment_13.Environment.sc.DOM.crIN(img[index][3].parentElement, tagstring);
                                            btn.style.position = 'absolute';
                                            btn.style.top = img[index][3].offsetTop + img[index][3].offsetHeight + 'px';
                                            btn.style.left = img[index][3].offsetLeft + (img[index][3].offsetWidth / 2) - 50 + 'px';
                                            img[index][3].btnref = btn;
                                            let btn2 = environment_13.Environment.sc.DOM.crIN(img[index][3].parentElement, img[index][3].data.substr(img[index][3].data.length - 15));
                                            btn2.style.position = 'absolute';
                                            btn2.style.top = img[index][3].offsetTop + img[index][3].offsetHeight + 30 + 'px';
                                            btn2.style.left = img[index][3].offsetLeft + (img[index][3].offsetWidth / 2) - 50 + 'px';
                                            imagedata = database[i];
                                            break;
                                        }
                                    }
                                    img[index][3].checked = true;
                                    if (!found) {
                                        img[index][3].tags = tagcontainer;
                                        img[index][3].onclick = function (evnt) {
                                            let tag = evnt.target.tags;
                                            if (valid === true) {
                                                environment_13.Environment.sc.S.p('captcha', [evnt.target.data, tag, evnt.target.src], []);
                                            }
                                        };
                                        environment_13.Environment.sc.D.sT(function (img) {
                                            let ct = 0;
                                            let indx = -1;
                                            for (let imgs in img) {
                                                if (img[imgs][3].btnref) {
                                                    ct++;
                                                }
                                                else {
                                                    indx = +imgs;
                                                }
                                            }
                                            if (ct === 4) {
                                                environment_13.Environment.sc.D.sT(function () {
                                                    if (clicked === false) {
                                                        if (img[indx]) {
                                                            img[indx][3].click();
                                                            clicked = true;
                                                        }
                                                    }
                                                }, 3000);
                                            }
                                        }, 1000, img);
                                    }
                                    else {
                                        let t = container.children[0].children[1].children;
                                        for (let n = 1; n < t.length; n++) {
                                            if (imagedata.tags.f(t[n].textContent.split(', ')[0]) > -1 && imagedata.tags.f(t[n].textContent.split(', ')[1]) > -1) {
                                                t[n].style.color = 'green';
                                                //t[n].remove();
                                            }
                                        }
                                        img[index][3].click();
                                    }
                                    for (let m in img) {
                                        if (!img[m][3].checked) {
                                            return;
                                        }
                                    }
                                    console.log('all checked');
                                }

                                contarray[k] = new Array(4);
                                contarray[k][0] = new Image();
                                contarray[k][0].src = images[k].children[0].src;
                                contarray[k][1] = document.createElement('canvas');
                                contarray[k][1].width = contarray[k][0].width;
                                contarray[k][1].height = contarray[k][0].height;
                                contarray[k][2] = contarray[k][1].getContext('2d');
                                contarray[k][0].img = images[k].children[0];
                                contarray[k][0].index = k;
                                contarray[k][3] = images[k].children[0];
                                contarray[k][0].arrayc = contarray;
                                contarray[k][0].onload = function (event) {
                                    contarray[event.target.index][2].drawImage(event.target, 0, 0);
                                    event.target.style.display = 'none';
                                    let pixel = contarray[event.target.index][2].getImageData(Math.floor(event.target.width / 2), Math.floor(event.target.height / 2), 10, 10);
                                    let data = pixel.data;
                                    let valid = false;
                                    let cimg = contarray[event.target.index][2].getImageData(0, 0, event.target.width, event.target.height);
                                    let cdata = cimg.data;
                                    for (let i in data) {
                                        if (data[i] !== 255 && data[i] !== 0) {
                                            valid = true;
                                            event.target.img.data = data.toString();
                                            break;
                                        }
                                    }
                                    for (let i in cdata) {
                                        if (cdata[i] !== 255 && cdata[i] !== 0) {
                                            event.target.img.data += 'first:' + i; //also pushes first valid entry
                                            break;
                                        }
                                    }
                                    check(event.target.arrayc, valid, event.target.index);
                                };
                            }
                        }
                        function confirmcaptcha() {
                            let captcha = environment_13.Environment.sc.S.g('captcha', []);
                            debugger;
                            let previous = environment_13.Environment.sc.L.g('kissanimecaptcha', []);
                            for (let j in captcha) {
                                let found = false;
                                for (let i = 0; i < previous.length; i++) {
                                    if (previous[i].imgdata === captcha[j][0]) {
                                        found = true;
                                        let newtags = captcha[j][1];
                                        let foundar = [];
                                        for (let m in previous[i].tags) {
                                            for (let n in newtags) {
                                                if (previous[i].tags[m].f(newtags[n][0]) > -1 && previous[i].tags[m].f(newtags[n][1]) > -1) {
                                                    foundar.push(newtags[n][0]);
                                                    foundar.push(newtags[n][1]);
                                                }
                                            }
                                        }
                                        if (foundar.length === 2) {
                                            let finished = environment_13.Environment.sc.G.g('kissanimecaptchafinished', []);
                                            let foundf = false;
                                            for (let ind in finished) {
                                                if (finished[ind][0] === previous[i].imgdata) {
                                                    let tagstring = '';
                                                    for (let tg in foundar) {
                                                        if (finished[ind].tags.f(foundar[tg]) === -1) {
                                                            finished[ind].tags.push(foundar[tg]);
                                                        }
                                                    }
                                                    for (let tg in finished[ind].tags) {
                                                        tagstring += finished[ind].tags[tg] + ', ';
                                                    }
                                                    foundf = true;
                                                    environment_13.Environment.sc.G.s('kissanimecaptchafinished', finished);
                                                    environment_13.Environment.sc.DOM.GMnot('same image ' + ind + ' ' + tagstring);
                                                    break;
                                                }
                                            }
                                            if (foundf === false) {
                                                new Audio('https://notificationsounds.com/message-tones/relentless-572' + '/download/mp3').play();
                                                environment_13.Environment.sc.DOM.GMnot('new match ' + foundar[0] + ', ' + foundar[1], undefined, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSrvby8wIzSOpsjn16RHZPtkZHVOo32l5RDPui4gt18Mg5-5X-PQ');
                                                environment_13.Environment.sc.G.p('kissanimecaptchafinished', { imgdata: previous[i].imgdata, 0: previous[i].imgdata, tags: foundar, 1: foundar, url: previous[i].url }, []);
                                            }
                                            previous.remI(i);
                                            environment_13.Environment.sc.L.s('kissanimecaptcha', previous);
                                        }
                                    }
                                }
                                if (!found) {
                                    let object = { imgdata: captcha[j][0], 0: captcha[j][0], tags: captcha[j][1], 1: captcha[j][1] };
                                    if (captcha[j][2]) {
                                        object.url = captcha[j][2];
                                    }
                                    if (captcha[j][1].length === 1) {
                                        object.tags = object.tags[0];
                                        object[1] = object[1][0];
                                        let finished = environment_13.Environment.sc.G.g('kissanimecaptchafinished', []);
                                        let foundf = false;
                                        for (let ind in finished) {
                                            if (finished[ind][0] === object.imgdata) {
                                                for (let tg in object.tags) {
                                                    if (finished[ind].tags.f(object.tags[tg]) === -1) {
                                                        finished[ind].tags.push(object.tags[tg]);
                                                    }
                                                }
                                                let tagstring = '';
                                                for (let tg in finished[ind].tags) {
                                                    tagstring += finished[ind].tags[tg] + ', ';
                                                }
                                                foundf = true;
                                                environment_13.Environment.sc.G.s('kissanimecaptchafinished', finished);
                                                environment_13.Environment.sc.DOM.GMnot('same image ' + ind + ' ' + tagstring);
                                                break;
                                            }
                                        }
                                        if (foundf === false) {
                                            environment_13.Environment.sc.DOM.GMnot('new match 2 ' + object.tags);
                                            environment_13.Environment.sc.G.p('kissanimecaptchafinished', object, []);
                                        }
                                    }
                                    else {
                                        let pr = environment_13.Environment.sc.L.g('kissanimecaptcha', []);
                                        let foundo = false;
                                        for (let pri in pr) {
                                            if (pr[pri].imgdata === object.imgdata) {
                                                foundo = true;
                                            }
                                        }
                                        if (foundo === false) {
                                            environment_13.Environment.sc.L.p('kissanimecaptcha', object);
                                            environment_13.Environment.sc.DOM.GMnot('pushing for ' + object.tags, object.imgdata);
                                        }
                                    }
                                }
                            }
                            console.log('done');
                            environment_13.Environment.sc.S.s('captcha', []);
                        }
                        if (document.body.children[1].textContent.split('\n')[1] === 'Please wait 5 seconds...') {
                            return;
                        }
                        let href = location.href;
                        if (href.indexOf('/Special/') > -1) {
                            href = location.origin + href.split('Url=')[1].replace(/%2f/g, '/').replace(/%3d/g, '=').replace(/%3f/g, '?').replace(/%26/g, '&');
                        }
                        environment_13.Environment.sc.G.p('originalhref', [href], new Array(0));
                        if (location.href.indexOf('/Special/AreYouHuman2?reUrl=') > -1) {
                            captchasite();
                        }
                        else if (!location.href.includes('BookmarkList')) {
                            confirmcaptcha();
                            let ar = [...find_8.default('selectEpisode').children];
                            ar.forEach(element => {
                                element.value += '&s=beta';
                            });
                        }
                    }
                    catch (e) {
                        environment_13.Environment.sc.D.e(e);
                    }
                }
                if ((location.href.indexOf('/Anime/') > -1 && location.href.indexOf('?id=') > -1)) {
                    menuArray.menu1.menuElements.push(environment_13.Environment.sc.DOM.crIN(menuArray.menu1.parent, 'captcha', showcaptcha, null, null, null, []));
                    episodes();
                }
                else if (location.href.indexOf('/Special/AreYouHuman') > -1) {
                    document.body.children[1]['click']();
                    environment_13.Environment.sc.S.s('captcha', []);
                }
                else {
                    episodes();
                    if (location.href.includes('Url=')) {
                        document.title = location.href.split('Url=')[1].split('%2f')[2].replace(/-/g, ' ');
                    }
                }
            }, false, 1);

            new Site('app.socialdear.de', function socialDearTest() {
                async function testPlanPost(interceptor) {
                    //switch to planning tab
                    find('mat-tab-label-0-0').click();
                    //open add view
                    var planBtn = await get('post-card add-post mat-card');
                    planBtn.click();
                    //set text
                    var text = await get('message mat-input-element');
                    text.value = 'messageðŸŒ¹' + Math.random();
                    var oEvent = document.createEvent('KeyboardEvent');
                    //event.initKeyboardEvent("keydown",undefined,undefined,undefined,32);
                    var k = 32;
                    Object.defineProperty(oEvent, 'keyCode', {
                        get: function () {
                            return k;
                        }
                    });
                    Object.defineProperty(oEvent, 'which', {
                        get: function () {
                            return k;
                        }
                    });
                    oEvent.initKeyboardEvent('input', true, true, document.defaultView, false, false, false, false, k, k);
                    oEvent.keyCodeVal = k;
                    text.dispatchEvent(oEvent);
                    //open date picker
                    (await get('date-picker-input')).click();
                    //get days
                    var days = await get('mat-calendar-body-cell', await get('mat-calendar-table'));
                    //pick last
                    days[days.length - 1].click();
                    //open time picker;
                    (await get('mat-select-arrow-wrapper', await get('time-picker'))).click();
                    var times = await get('mat-option', await get('ng-trigger-transformPanel', undefined, 'DIV'));
                    times[times.length - 1].click();
                    var promise = interceptor.register('https://app.socialdear.de/someposts/');
                    (await get('schedule-button')).click();
                    var resposne = await promise;
                    if (resposne.returnCode != 201) {
                        alert('wrong returnCode for testPlan' + resposne.returnCode + ' :' + JSON.stringify(resposne.data));
                    }
                }
                async function deleteAll(interceptor) {
                    var posts = await get('sd-scheduled-posts');
                    for (var i = 1; i < posts.children.length; i++) {
                        debugger;
                        var post = posts.children[i];
                        //press options
                        (await get('card-menu-button', post)).click();
                        (await get('delete-button')).click();
                        var promise = interceptor.register('https://app.socialdear.de/someposts/');
                        (await get('dialog-submit-button')).click();
                        var response = await promise;
                        debugger;
                    }
                }
                debugger;
                GM_registerMenuCommand('run tests', async function () {
                    var interceptor = {
                        registered: [],
                        register: function (url) {
                            var res;
                            var promise = new Promise(resolve => {
                                res = resolve;
                            });
                            this.registered.push({ url: url, resolver: res });
                            return promise;
                        },
                        listener: function (e, a, b) {
                            for (var i of interceptor.registered) {
                                if (e.target.responseURL.includes(i.url)) {
                                    var data;
                                    debugger;
                                    try {
                                        data = JSON.parse(e.target.responseText);
                                    } catch (e) {
                                    }
                                    i.resolver({ status: e.target.status, data: data });
                                }
                            }
                        },
                        init: function () {
                            var origListenerAdding = XMLHttpRequest.prototype.addEventListener;
                            Object.defineProperty(XMLHttpRequest.prototype, 'addEventListener', {
                                enumerable: false,
                                value: function addEventListener(e, listener, a) {
                                    origListenerAdding.call(this, e, interceptor.listener, a);
                                    return origListenerAdding.call(this, e, listener, a);
                                }
                            });
                        }
                    };
                    //debugger;
                    interceptor.init();
                    await deleteAll(interceptor);
                    await testPlanPost(interceptor);

                });
            });
        }
    }
});
// @ts-ignore
define('Overrides/CustomObject', ['require', 'exports', 'environment', 'sc/find'], function (require, exports, environment_14, find_9) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class CustomObject extends Object {
        findO(f, equal = false, path = '', first = true) {
            return null;
        }
        static init(sc) {

            if (!Element.prototype['appendChildc']) {
                Element.prototype['appendChildc'] = Element.prototype.appendChild;
                Element.prototype.appendChild = function (a) {
                    // debugger;
                    if (a.localName === 'iframe') {
                        if (a['src'].indexOf('https://alargery.com/') > -1) {
                            return;
                        }
                    }
                    if (a.localName === 'script') {
                        //debugger;
                    }
                    // @ts-ignore
                    let obj = this.appendChildc(a);
                    obj.tttimsetamp = environment_14.Environment.sc.T.n();
                    if (a.localName === 'iframe') {
                        if (location.href.indexOf('https://openload.co/embed') > -1 && false) {
                            //blocks the script that opens the window
                            function newappendiF(a, b, c, d) {
                                if (a.localName === 'script') {
                                    environment_14.Environment.sc.G.p(environment_14.Environment.sc.c.sI.GS.eventstorage, {
                                        title: 'blocked script',
                                        body: location.href,
                                        host: 'security',
                                        timeout: 10,
                                        url: '',
                                        iurl: '',
                                        fnc: null,
                                        timestamp: environment_14.Environment.sc.T.n()
                                    });
                                    return;
                                }
                                return e.body.appendChildcopy(a, b, c, d);
                            }
                            let e = obj['contentDocument'] || obj['contentWindow']['document'];
                            e.body.appendChildcopy = e.body.appendChild;
                            e.body.appendChild = newappendiF;
                            return obj;
                        }
                        else {
                            //rewrites the method that opens windows to filter by url
                            if (obj.contentWindow) {
                                obj.contentWindow.opencopy = open;
                                obj.contentWindow.open = function (url, b, c) {
                                    if (url === 'about:blank') {
                                        return;
                                    }
                                    environment_14.Environment.sc.DOM.GMnot('blocked window');
                                    debugger;
                                    return this.opencopy(url, b, c);
                                };
                                function newappendiF(a, b, c, d) {
                                    if (a.localName === 'script') {
                                        environment_14.Environment.sc.G.p(environment_14.Environment.sc.c.sI.GS.eventstorage, {
                                            title: 'blocked script',
                                            body: location.href,
                                            host: 'security',
                                            timeout: 10,
                                            url: '',
                                            iurl: '',
                                            fnc: null,
                                            timestamp: environment_14.Environment.sc.T.n()
                                        });
                                        return;
                                    }
                                    return e.body.appendChildcopy(a, b, c, d);
                                }
                                let e = obj['contentDocument'] || obj['contentWindow']['document'];
                                e.body.appendChildcopy = e.body.appendChild;
                                e.body.appendChild = newappendiF;
                            }
                            return obj;
                        }
                    }
                    else {
                        return obj;
                    }
                    return obj;
                };
                document['createElementc'] = document.createElement;
                document.createElement = function (a, b) {
                    // @ts-ignore
                    let obj = this.createElementc(a, b);
                    obj.aactttimsetamp = environment_14.Environment.sc.T.n();
                    return obj;
                };
            }
            this.overrideWindowOpen(sc);
        }
        static overrideEventListeners() {
        }
        static overrideWindowOpen(sc) {
            if (!find_9.default.W()['opencopy']) {
                find_9.default.W()['opencopy'] = window.open;
                find_9.default.W().open = function (url, a, b) {
                    function dontopen() {
                        console.log('didnt open ' + url);
                        //sc.DOM.GMnot("didnt open " + url, undefined, undefined, undefined, undefined, 1000);
                        return null;
                    }
                    let dontOpenOnSites = sc.G.g(sc.c.sI.GS.sec.hostsNotAllowedToOpenNewWindows, []);
                    for (let ind in dontOpenOnSites) {
                        if (location.host.indexOf(dontOpenOnSites[ind]) > -1) {
                            return dontopen();
                        }
                    }
                    let dont = ['abourselfi.com', 'about:blank', 'https://cine.to/#', 'diamong', 'streamcloud', 'ad-srv.net'];
                    for (let ind in dont) {
                        if (url.indexOf(dont[ind]) > -1) {
                            return dontopen();
                        }
                    }
                    debugger;
                    let allowed = [];
                    try {
                        allowed = find_9.default.W()['sec'].get('allowed');
                    }
                    catch (error) {
                    }
                    for (let j = 0; j < allowed.length; j++) {
                        if (url.substring(0, 40).indexOf(allowed[j]) > -1) {
                            return this.opencopy(url, a, b);
                        }
                    }
                    let openmode = sc.G.g('allowopen', 0);
                    if (openmode === 2) {
                        return this.opencopy(url, a, b); //repalced find.W() with this
                    }
                    else if (openmode === 1) {
                        if (confirm('allow ? ' + url)) {
                            return this.opencopy(url, a, b);
                        }
                        return dontopen();
                    }
                    else {
                        environment_14.Environment.sc.G.s(sc.c.sI.GS.scriptcomm2, {
                            target: 'http://localhost:8080/docs',
                            fnc: 'sc.DOM.not("blocked ' + url + '",null,null,null,null,2)',
                            value: location.href
                        });
                        return dontopen();
                    }
                };
            }
        }
    }
    exports.CustomObject = CustomObject;
});
// @ts-ignore
define('Sites/Videos', ['require', 'exports', 'Bar/Site', 'environment', 'Bar/Menu', 'Bar/Bar', 'sc/Video', 'sc/Anim/CicularMenu', 'sc/find'], function (require, exports, Site_2, environment_15, Menu_2, Bar_4, Video_2, CicularMenu_1, find_10) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Videos {
        static register(sc) {
            let instance = this;
            new Site_2.Site('', function (query, menus, sc) {
                if ((!location.href.includes('https://www.facebook.com/') || location.href.includes('videos/'))) {
                    function menu() {
                        var vid = find_10.default.T('video', document.body);
                        if (vid) {
                            //vid.menustarted = true;
                            instance.videomenu();
                        }
                        else {
                            sc.D.sT(menu, 500);
                        }
                    }
                    sc.D.sT(menu, 1000);
                }
            });
            new Site_2.Site(['mywatchseries.to', 'dwatchseries.to', 'watchseries.to', (sc.G.g(sc.c.sI.GS.siteurls, {}).series).site], function watchs(hashobj, menus, sc) {

                try {
                    find_10.default('modal-backdrop in').remove();
                    alert('removed');
                }
                catch (e) {
                }
                if (location.href.indexOf(sc.c.u.cale) > -1) {
                    let t = find_10.default.C('push_button blue');
                    if (!t) {
                        setTimeout(watchs, 10, hashobj);
                    }
                    sc.G.p('tempSS', { url: t.href, identifier: sc.c.buttonsfornextinstance, content: sc.S.CD.g(sc.c.buttonsfornextinstance) }, []);
                    sc.G.p('tempSS', { url: t.href, identifier: 'autoplay', content: sc.S.CD.g('autoplay') }, []);
                    location.href = t.href;
                }
                else if (location.href.indexOf('/episode/') > -1) {
                    //
                }
                else if (location.href.indexOf('serie/') > -1 && location.hash.indexOf('open=1') > -1) {
                    var t = find_10.default('listings show-listings', undefined, false);
                    var season = t.length;
                    var episode = find_10.default('listing_' + season).children[0].children[0].content;
                    if (hashobj.ep) {
                        var s = hashobj.ep.split('E');
                        season = s[0].replace('S', '');
                        episode = s[1];
                    }
                    var t = find_10.default('listing_' + season);
                    if (t) {
                        for (var i = 0; i < t.children.length; i++) {
                            if (t.children[i].children[0].content === episode) {
                                let st = t.children[i];
                                if (find_10.default('a', st).style.color === 'rgb(170, 170, 170)') {
                                }
                                else {
                                    var links = find_10.default('b', st).innerText.split(' links')[0].replace('(', '');
                                    if (links > 10) {
                                        location.href = find_10.default('a', st).href + '#autoplay=1';
                                    }
                                }
                            }
                        }
                        sc.D.sT(function () {
                            location.reload();
                        }, 1000 * 60 * 30);
                    }
                }
            }, false, 4);
            new Site_2.Site(['openload.co/', 'oload.tv'], function () {
                let reloadDiv = find_10.default('vjs-modal-dialog-content');
                if (reloadDiv && reloadDiv.innerText.indexOf('The media could not be loaded,') > -1 && reloadDiv.parentElement.className.indexOf('hidden=true') === -1) {
                    // location.reload();
                }
                let warn = find_10.default.C('col-xs-12 col-md-6 col-md-offset-3 content-blocked');
                if (!warn) {
                    warn = find_10.default('col-xs-12 content-404');
                }
                if (find_10.default('vjs-error-display') && !find_10.default('vjs-error-display').className.includes('hidden')) {
                    warn = true;
                }
                if (!warn) {
                    try {
                        let textFields = find_10.default('h3');
                        for (let i in textFields) {
                            if (textFields[i].innerText.indexOf('Sorry!') > -1) {
                                warn = true;
                            }
                        }
                    }
                    catch (e) {
                    }
                }
                if (warn) {
                    debugger;
                    Videos.notThisHoster();
                    return;
                }
                find_10.default.a('vjs-tech').then((vidElement) => {
                    let video = find_10.default.I('olvideo_html5_api');
                    if (window['eventListenerArray']) {
                        debugger;
                        window['eventListenerArray'].forEach(element => {
                            if (element.object == document || element.object == document.body || element.object.tagName == 'video') {
                                element.object.removeEventListener(element.name, element.fnc);
                            }
                        });
                    }
                    // videos.check(video);
                    // videos.videomenu();
                    function newappend(a, b, c, d) {
                        function newappendiF(a, b, c, d) {
                            if (a.localName === 'script') {
                                sc.G.p(sc.c.sI.GS.eventstorage, { title: 'blocked script', body: location.href, host: 'security', timeout: 10, url: '', iurl: '', fnc: null, timestamp: sc.T.n() });
                                return;
                            }
                            return e.body.appendChildcopy(a, b, c, d);
                        }
                        if (a.localName === 'iframe') {
                            var t = document.body['appendChildcopy'](a, b, c, d);
                            var e = t['contentDocument'] || t['contentWindow']['document'];
                            e.body.appendChildcopy = e.body.appendChild;
                            e.body.appendChild = newappendiF;
                            return t;
                        }
                        return document.body['appendChildcopy'](a, b, c, d);
                    }
                    document.body['appendChildcopy'] = document.body.appendChild;
                    // document.body.appendChild = newappend;
                    // find("vjs-big-play-button").click();
                    /*  while (find('videooverlay').style.display != 'none') {
                          find('videooverlay').click()
                      }*/
                    sc.D.sT(function () {
                        try {
                            find_10.default('mgbox').remove();
                            // find.I("videooverlay").click();
                        }
                        catch (err) {
                        }
                        try {
                            find_10.default.C('vjs-poster')['remove']();
                        }
                        catch (err) {
                        }
                        let video = find_10.default('vjs-tech');
                        function playAsync() {
                            video.play();
                            //sc.D.sT(playAsync, 200);
                        }
                        playAsync();
                    }, 900);
                });
            });
            new Site_2.Site('powvideo', function () {
                if (sc.g('alert') && sc.g('alert').innerText) {
                    instance.notThisHoster();
                }
                sc.D.rek('vplayer', function () {
                    instance.videomenu();
                });
            });
        }

        static notThisHoster() {
            let localbuttons = environment_15.Environment.sc.S.CD.g(environment_15.Environment.sc.c.buttonsfornextinstance, new Array(0));
            for (let i in localbuttons) {
                if (localbuttons[i][2]) {
                    let hs = environment_15.Environment.sc.S.CD.g('history');
                    for (let h = hs.length - 1; h > -1; h--) {
                        if (hs[h].indexOf(environment_15.Environment.sc.c.u.cale) > -1) {
                            environment_15.Environment.sc.S.CD.p('exclude', hs[h], []);
                            break;
                        }
                    }
                    location.href = localbuttons[i][2];
                    return;
                }
            }
        }
        static async videomenu(videoElement = undefined) {
            async function getVideo() {
                let video = await find_10.default.a('video', undefined, undefined, find_10.default.T);
                if (video == undefined) {
                    video = find_10.default('video');
                }
                if (video instanceof HTMLCollection) {
                    let videoElements = [...video];
                    return videoElements.filter((element) => !element.className.includes('hidden'))[0];
                }
                return video;
            }
            let vid = await getVideo();
            console.log('videomenu');
            var menuArray = [[null, 'play/pause', async function () {
                var video = await getVideo();
                if (video.paused === true) {
                    video.play();
                }
                else {
                    video.pause();
                }
            }, undefined, undefined, undefined, { style: { backgroundColor: 'rgb(204, 204, 204)', opacity: '1' } }], [null, 'slow play/pause', Video_2.Video.un_pause], [null, 'fullscreen', function () {
                var video = getVideo();
                video['webkitRequestFullscreen']();
            }], ['crSL', async function (a, b) {
                debugger;
                var percent = b / 100;
                var video = await getVideo();
                if (video && video.duration.toString() !== 'NaN') {
                    video.currentTime = video.duration * percent;
                }
            }, vid.currentTime * 100 / vid.duration, environment_15.Environment.sc.c.icons.duration, false],
            ['crSL', async function (a, b) {
                if (!a.hasDoneFirstCall) {
                    a.hasDoneFirstCall = true;
                    environment_15.Environment.sc.D.sT(((b) => {
                        return async () => {
                            var percent = b / 100;
                            var video = await getVideo();
                            environment_15.Environment.sc.S.CD.s('youtube_volume', percent * 100);
                            if (video) {
                                video.volume = percent;
                            }
                        };
                    })(b), 500);
                    return;
                }
                var percent = b / 100;
                var video = await getVideo();
                environment_15.Environment.sc.S.CD.s('youtube_volume', percent * 100);
                if (video) {
                    video.volume = percent;
                }
            }, environment_15.Environment.sc.S.CD.g('youtube_volume', 50), environment_15.Environment.sc.c.icons.volume],
            ['crSL', async function (a, b) {
                var speed = (b / 50) * (b / 50);
                var video = await getVideo();
                environment_15.Environment.sc.S.CD.s('youtube_speed', b);
                if (video) {
                    video.playbackRate = speed;
                }
            }, environment_15.Environment.sc.S.CD.g('youtube_speed', 50), environment_15.Environment.sc.c.icons.speed],
            ['crTF', 'goto next end - ' + environment_15.Environment.sc.S.CD.g('sectorefresh', Videos.timeout) + 's', function (a, b) {
                //go to next b seconds before the end
                environment_15.Environment.sc.S.s('sectorefresh', JSON.parse(b));
                a.value = b + ' seconds';
            }], ['crTF', 'createPoint', async function (a, b) {
                var vid = await getVideo();
                var name = 'next';
                var fstring;
                if (a.value === 'next') {
                    fstring = 'find.W().next();';
                }
                else if (a.value === 'del') {
                    debugger;
                }
                else {
                    fstring = 'vid.currentTime+=' + a.value + ';';
                    name = 'jump ' + a.value + ' at around ' + vid.currentTime;
                }
                a.value = name + ' pt';
                environment_15.Environment.sc.S.CD.p('videopoints', { functionString: name, data: vid['audioBuffer'], evalString: fstring });
            }]];
            var custompoints = environment_15.Environment.sc.S.CD.g('videopoints', []);
            for (var i = 0; i < custompoints.length; i++) {
                var fnc = custompoints[i].functionCString;
                menuArray.push(['crTF', custompoints[i].functionString + ' pt', function (a) {
                    if (a.value === 'del') {
                        let array = environment_15.Environment.sc.S.CD.g('videopoints', []);
                        for (var i = 0; i < array; i++) {
                            if (array[i].audioPoint === a.val) {
                                array.remI(i);
                                break;
                            }
                        }
                        environment_15.Environment.sc.S.CD.s('videopoints', array);
                        a.remove();
                        Bar_4.Bar.repaintBar();
                    }
                }, true, custompoints[i].audioPoint]);
            }
            new Menu_2.Menu(undefined, undefined, 'videoctrl', menuArray);
            try {
                //video.currentTime = 0;
                function shouldAddListeners() {
                    if (vid['menustarted']) {
                        return false;
                    }
                    if (location.href.includes('twitch') && !location.href.includes('videos/')) {
                        return false;
                    }
                    return true;
                }
                if (shouldAddListeners()) {
                    environment_15.Environment.sc.D.aL(document.body, 'keydown', async function (ev) {
                        let vid = await getVideo();
                        if (vid) {
                            if (ev.keyCode === 39) {
                                vid.currentTime += 5;
                            }
                            else if (ev.keyCode === 37) {
                                vid.currentTime -= 5;
                            }
                        }
                        else {
                            vid = find_10.default.T('object');
                            if (ev.keyCode === 39) {
                                vid['_events'].time[0].context['seek'](vid['_events'].time[0].context._events.all[0].context.attributes.position + 5);
                            }
                            else if (ev.keyCode === 37) {
                                vid['_events'].time[0].context['seek'](vid['_events'].time[0].context._events.all[0].context.attributes.position - 5);
                            }
                        }
                    });
                    environment_15.Environment.sc.D.aL(document.body, 'keypress', async function (ev) {
                        debugger;
                        if (ev.target.contentEditable || ev.target.className == 'textArea') {
                            return;
                        }
                        Bar_4.Bar.bar.offset.activity = environment_15.Environment.sc.T.n();
                        var vid = await getVideo();
                        var type = 'html';
                        if (!vid) {
                            vid = find_10.default.T('object');
                            type = 'swf';
                        }
                        if (!vid || !vid.className) {
                            return;
                        }
                        if (ev.keyCode === 32) {
                            debugger;
                            if (type === 'html') {
                                if (vid.paused) {
                                    vid.play();
                                    vid['webkitRequestFullscreen']();
                                }
                                else {
                                    vid.pause();
                                }
                            }
                            else if (type === 'swf') {
                                if (vid['_events'].seek[0].context.state === 'paused') {
                                    vid['_events'].seek[0].context.play();
                                }
                                else {
                                    vid['_events'].seek[0].context.play();
                                }
                            }
                        }
                        else if (ev.keyCode === 110) {
                            try {
                                find_10.default.W()['next']();
                            }
                            catch (e) {
                            }
                        }
                        else if (ev.keyCode === 112) {
                            try {
                                find_10.default.W()['previous']();
                            }
                            catch (e) {
                            }
                        }
                        else if (ev.keyCode === 43) {
                            if (type === 'html') {
                                vid.playbackRate += 0.1;
                                Bar_4.Bar.barElementContainer[1].textContent = vid.playbackRate;
                                environment_15.Environment.sc.S.s('playbackRate', vid.playbackRate);
                                environment_15.Environment.sc.D.sT(function () {
                                    if (environment_15.Environment.sc.T.n() - Bar_4.Bar.bar.offset.activity > 900) {
                                        Bar_4.Bar.barElementContainer[1].textContent = Bar_4.Bar.getonoff();
                                    }
                                }, 1000);
                            }
                        }
                        else if (ev.keyCode === 45) {
                            if (type === 'html') {
                                vid.playbackRate -= 0.1;
                                Bar_4.Bar.barElementContainer[1].textContent = vid.playbackRate;
                                environment_15.Environment.sc.S.s('playbackRate', vid.playbackRate);
                                environment_15.Environment.sc.D.sT(function () {
                                    if (environment_15.Environment.sc.T.n() - Bar_4.Bar.bar.offset.activity > 900) {
                                        Bar_4.Bar.barElementContainer[1].textContent = Bar_4.Bar.getonoff();
                                    }
                                }, 1000);
                            }
                        }
                    });
                    Videos.registerAudioListener(vid);
                }
            }
            catch (error) {
            }
            //renderFrame();
            Videos.check(undefined, true, videoElement);
            if (!vid['menustarted']) {
                vid['menustarted'] = true;
            }
            environment_15.Environment.sc.D.sT(function () {
                vid.play();
            }, 2);
        }
        static registerAudioListener(vid) {
            return;
            var audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
            var destination = audioCtx.destination;
            var source = audioCtx.createMediaElementSource(vid);
            source.connect(destination);
            var analyser = audioCtx.createAnalyser(vid);
            source.connect(analyser);
            analyser.fftSize = 2048;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            function draw() {
                requestAnimationFrame(draw);
                analyser.getByteTimeDomainData(dataArray);
                var audio = [];
                for (var t of dataArray) {
                    audio.push(t);
                }
                vid.audioBuffer = audio;
            }
            draw();
        }
        static check(vid, v, vidstr) {
            function callNext() {
                if (location.href.indexOf('http://www.nowvideo.to/video/') > -1 || location.href.indexOf('https://thevideo.me') > -1) {
                    environment_15.Environment.sc.G.s(environment_15.Environment.sc.c.sI.GS.scriptcomm2, { target: ['https://ewingoset.info/', 'https://suspents.info/'], fnc: 'find.W().next', value: location.href });
                    environment_15.Environment.sc.D.sT(function () {
                        environment_15.Environment.sc.G.s(environment_15.Environment.sc.c.sI.GS.scriptcomm2, 'idle');
                    }, 2000);
                }
                else {
                    try {
                        find_10.default.W()['next']();
                    }
                    catch (err) {
                        //sc.D.e(err);
                    }
                }
            }
            if (vid) {
                vid.current = vid.currentTime;
                if (vid.current === undefined) {
                    try {
                        vid.vid2 = vid._events.time[0].context._events.all[0].context.attributes;
                        vid.current = vid.vid2.position;
                    }
                    catch (err) {
                        environment_15.Environment.sc.D.sT(Videos.check, 2000, vid, v, vidstr);
                        return;
                    }
                }
                vid.dur = vid.duration;
                if (vid.dur === undefined) {
                    vid.dur = vid.vid2.duration;
                }
                if (vid.current === undefined) {
                    vid.times = vid.innerText.split('\n');
                    if (vid.times.length === 1) {
                        environment_15.Environment.sc.D.sT(Videos.check, 2000, vid, v, vidstr);
                        return;
                    }
                    else {
                        vid.temp = [];
                        for (let i = 0; i < vid.times.length; i++) {
                            if (vid.times[i].indexOf(':') > -1) {
                                let tar = vid.times[i].replace('Current Time ', '').replace('Duration Time ', '').split(':');
                                vid.temp.push((tar[0] * 60) - 0 + (tar[1] - 0));
                            }
                        }
                        if (vid.temp.length === 2) {
                            vid.current = vid.temp[0];
                            vid.dur = vid.temp[1];
                        }
                        else if (vid.temp.length === 0) {
                            environment_15.Environment.sc.D.sT(Videos.check, 2000, vid, v, vidstr);
                            return;
                        }
                    }
                }
                function contains(dataArray, i, audioPoint) {
                    let sampleArray = audioPoint.data;
                    let counted = 0;
                    for (let j in sampleArray) {
                        if (dataArray[i + (+j - 0)]) {
                            if (sampleArray[j] !== dataArray[i + (+j - 0)]) {
                                return false;
                            }
                            counted++;
                        }
                    }
                    if (counted < 20) {
                        return false;
                    }
                    console.log('found point eval: ' + audioPoint.evalString);
                    try {
                        eval(audioPoint.evalString);
                    }
                    catch (error) {
                        environment_15.Environment.sc.D.e(error);
                    }
                }
                let audioPoints = environment_15.Environment.sc.S.CD.g('videopoints', []);
                for (let audioPoint of audioPoints) {
                    for (let i = 0; i < vid.audioBuffer.length; i++) {
                        contains(vid.audioBuffer, i, audioPoint);
                    }
                }
                let tim = Videos.timeout; //seconds until dur before refresh
                tim = environment_15.Environment.sc.S.CD.g('sectorefresh', tim);
                if (vid.current > vid.dur - tim && vid.dur > 100) {
                    environment_15.Environment.sc.G.s('tempSS', []);
                    callNext();
                }
                else {
                    environment_15.Environment.sc.D.sT(Videos.check, 2000, vid, v, vidstr);
                }
            }
            else {
                let video = find_10.default.T('video', document.body);
                if (!video) {
                    video = find_10.default.T('object');
                }
                if (!video && vidstr !== undefined) {
                    video = find_10.default(vidstr);
                }
                if (video) {
                    //video.webkitRequestFullscreen();
                }
                window.onresize = function () {
                    // video.style.width=window.innerWidth+"px";
                    // video.style.height=window.innerHeight+"px";
                };
                environment_15.Environment.sc.D.sT(Videos.check, 2000, video, v, vidstr);
            }
        }
    }
    Videos.timeout = 1;
    exports.Videos = Videos;
});
// @ts-ignore
define('Overrides/Listeners', ['require', 'exports', 'Bar/Bar', 'environment', 'Bar/Table', 'sc/Anim/Animations', 'sc/find'], function (require, exports, Bar_6, environment_17, Table_3, Animations_3, find_12) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Listeners {
        static register(sc) {
            find_12.default.W().onunload = function (message) {
                let currentTabs = sc.G.g(sc.c.sI.GS.currentTabs);
                currentTabs = currentTabs.filter((tab) => tab.url != message.currentTarget.location.href);
                sc.G.s(sc.c.sI.GS.currentTabs, currentTabs);
            };
            find_12.default.W().onhashchange = function (event) {
                let currentTabs = sc.G.g(sc.c.sI.GS.currentTabs);
                currentTabs = currentTabs.filter((tab) => tab.url != event.oldURL);
                currentTabs.push({ text: document.title, url: event.newURL });
                sc.G.s(sc.c.sI.GS.currentTabs, currentTabs);
            };
            find_12.default.W().onresize = function resize() {
                sc.D.l(location.host + ' ' + 'onresize', 3);
                Bar_6.Bar.repaintBar();
                if ((window.innerHeight === 638 || window.innerHeight === 768) && !sc.DOM.InFrame()) {
                    Listeners.events(0, window.innerHeight);
                }
            };
            find_12.default.W()['sendmessage'] = function (message) {
                var ar = sc.G.g('messages', []);
                ar.push(message);
                sc.G.s('messages', ar);
            };
            sc.D.aL('GM', sc.c.sI.GS.scriptcomm, (text, a, b) => {
                if (a == 'getTabs') {
                    sc.G.p('tabs', location.href);
                }
            });
        }
        static events(mainct, wheight = window.innerHeight) {
            environment_17.Environment.sc.D.l(location.host + ' ' + 'events', 3);
            function getButton(position, depths, wndheight, mainct = 0, intermediate = false) {
                if (intermediate === true) {
                    let timeout = environment_17.Environment.sc.c.notification_check_interval;
                    if (Bar_6.Bar.menus.menu1) {
                        Bar_6.Bar.menus.menu1.menuElements[Table_3.Table.clearRecentEventsIndex].style.backgroundColor = Animations_3.Animations.color();
                    }
                    environment_17.Environment.sc.D.sT(getButton, timeout * 1000, position, depths, wndheight, mainct, !intermediate);
                }
                else {
                    if (environment_17.Environment.sc.S.g('youtube_notification_depths', 0) === depths && wndheight === window.innerHeight) {
                        let timeout = environment_17.Environment.sc.c.notification_check_interval;
                        //console.log("topsmall : " + sc.G.g("topsmall", [])[0]);
                        if (environment_17.Environment.sc.G.g('topsmall', [])[0] === location.href && !environment_17.Environment.sc.G.g('youtube_checking', true)) {
                            let ar = environment_17.Environment.sc.G.g('events', []);
                            //console.log("topbig : " + sc.G.g("topbig", []) + " length: " + ar.length);
                            if (Bar_6.Bar.menus.menu1) {
                                Bar_6.Bar.menus.menu1.menuElements[Table_3.Table.clearRecentEventsIndex].innerText = 'clear events ' + ar.length;
                                Bar_6.Bar.menus.menu1.menuElements[Table_3.Table.clearRecentEventsIndex].style.backgroundColor = Animations_3.Animations.color();
                            }
                            if (ar.length > position - 1) {
                                if (environment_17.Environment.sc.G.g('topbig', []).length > 0) {
                                    environment_17.Environment.sc.G.p('notificationredirect', ar[position - 1], []);
                                    if (ar[position - 1].timeout - environment_17.Environment.sc.c.notification_check_interval > timeout) {
                                        timeout = ar[position - 1].timeout - environment_17.Environment.sc.c.notification_check_interval;
                                    }
                                    ar = environment_17.Environment.sc.G.g('events');
                                    ar.remI(position - 1);
                                    environment_17.Environment.sc.G.s('events', ar);
                                    environment_17.Environment.sc.D.sT(getButton, timeout * 1000, position, depths, wndheight);
                                    return;
                                }
                                else {
                                    let br;
                                    let width = 300;
                                    let height = 100;
                                    if (ar[position - 1].timeout - environment_17.Environment.sc.c.notification_check_interval > timeout) {
                                        timeout = ar[position - 1].timeout - environment_17.Environment.sc.c.notification_check_interval;
                                    }
                                    if (location.href.indexOf('twitch.tv') > -1) {
                                        if (document.getElementsByClassName('player-overlay player-fullscreen-overlay js-control-fullscreen-overlay')[0] !== undefined) {
                                            ar = environment_17.Environment.sc.G.g('events', []);
                                            /*Environment.sc.DOM.createnot(ar, height, width, position, timeout, false, function () {
                                                return getButton(position, depths, wndheight, mainct, intermediate);
                                            });*/
                                            ar.remI(position - 1);
                                            environment_17.Environment.sc.G.s('events', ar);
                                            //sc.D.sT(getButton, timeout * 1000, position, depths, wndheight);
                                        }
                                        else {
                                            environment_17.Environment.sc.D.sT(getButton, 2000, position, depths, wndheight);
                                            return;
                                        }
                                    }
                                    else {
                                        ar = environment_17.Environment.sc.G.g('events');
                                        /*Environment.sc.DOM.createnot(ar, height, width, position, timeout, false, function () {
                                            return getButton(position, depths, wndheight, mainct, intermediate);
                                        });*/
                                        ar.remI(position - 1);
                                        environment_17.Environment.sc.G.s('events', ar);
                                        //sc.D.sT(getButton, timeout * 1000, position, depths, wndheight);
                                    }
                                }
                            }
                            else {
                                environment_17.Environment.sc.D.sT(getButton, timeout * 1000, position, depths, wndheight);
                            }
                        }
                        else {
                            if ((window.innerHeight === wndheight)) {
                                environment_17.Environment.sc.D.sT(getButton, (timeout + 2) * 1000, position, depths, wndheight);
                            }
                            else {
                                environment_17.Environment.sc.DOM.GMnot('height !== stopping on ' + location.href);
                                console.log('height != heigt');
                            }
                        }
                    }
                    else {
                        console.log('running out due to only one instance');
                    }
                }
            }
            if (mainct === 0) {
                console.log('starting event check');
                getButton(1, environment_17.Environment.sc.S.g('youtube_notification_depths', 0), wheight, mainct);
            }
            //sc.D.sT(getButton,500*sc.c.notification_check_interval,2);
            //getButton(3);
        }
    }
    exports.Listeners = Listeners;
});
// @ts-ignore
define('environment', ['require', 'exports', 'startLine', 'sc/libraries', 'Bar/Bar', 'Bar/Menu', 'Bar/Table', 'Sites/sites', 'Sites/rotate', 'Sites/Videos', 'Overrides/CustomObject', 'Overrides/Listeners', 'Security', 'sc/find'], function (require, exports, startLine_1, libraries_1, Bar_7, Menu_4, Table_4, sites_1, rotate_1, Videos_1, CustomObject_1, Listeners_1, Security_2, find_13) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    class Environment {
        static register() {
            console.log('env register -----------------------');
            find_13.default.W()['sc'] = this.sc;
            CustomObject_1.CustomObject.init(this.sc);
            try {
                sites_1.Sites.init();
                rotate_1.Rotate.register(this.sc);
                Listeners_1.Listeners.register(this.sc);
                Videos_1.Videos.register(this.sc);
                this.sc.G.p(this.sc.c.sI.GS.currentTabs, { url: location.href, text: document.title }, []);
                if (!this.sc.DOM.InFrame()) {
                    this.main(this.sc);
                }
                else {
                    for (let z = 0; z < this.sc.c.main_runs; z++) {
                        for (let zi in this.sc.c.main_sites) {
                            if (this.sc.c.main_sites[zi].runAtIndex === z + 1 && this.sc.c.main_sites[zi].runInFrame === true) {
                                console.log('checking for ' + this.sc.c.main_sites[zi].href + 'runat ' + (z + 1) + 'with iframe true');
                                if (this.sc.c.main_sites[zi].isRunning()) {
                                    this.sc.c.main_sites[zi].run();
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
                this.sc.D.e(e);
            }
            /*function setLoaded() {
                sc.DOMloaded = true;
                sc.runatloaded();
            }
            sc.D.aL(document, "DOMContentLoaded", setLoaded);
            sc.D.aL(document, "Loaded", setLoaded);*/
        }
        static async main(sc) {
            console.log('env main -----------------------');
            if (!(location.href.indexOf('facebook') > -1 && location.href.indexOf('oauth?app_id=') > -1)) {
                sc.S.CD.p(sc.c.sI.SSCD.historylog, location.href, []);
            }
            await find_13.default.a('body');
            if (!document.body) {
                console.log('no ducument body');
                //return;
            }
            this.setupstart();
            let bar = new Bar_7.Bar();
            let m3ind;
            //if (!onlyonce) {
            //	onlyOnce();
            //}
            //e => mainContainer
            let m3 = [];
            this.sc.S.s(sc.c.sI.SS.timer_checking, 0);
            let m1 = new Menu_4.Menu(this.mainContainer, Bar_7.Bar.barElementContainer, 'menu1', []);
            // sc.bar.editor();
            Table_4.Table.recentEventIndex = m1.menuElements.push(sc.DOM.crIN(m1.parent, 'get recent events', Table_4.Table.recent, null, null, null, [['style.backgroundColor', 'lightgreen']])) - 1;
            Table_4.Table.clearRecentEventsIndex = m1.menuElements.push(sc.DOM.crIN(m1.parent, 'clear events', Table_4.Table.clearevents)) - 1;
            m1.menuElements.push(sc.DOM.crIN(m1.parent, 'customlog', Table_4.Table.getcustom));
            for (let i = 0; i < sc.c.GS_function_call_string.length; i += 2) {
                m1.menuElements.push(sc.DOM.crIN(m1.parent, 'show' + sc.c.GS_function_call_string[i], Table_4.Table.clearevents, null, null, null, [['arrayString', sc.c.GS_function_call_string[i + 1]]]));
            }
            let e2 = this.mainContainer.insertBefore(document.createElement('div'), this.mainContainer.children[0]);
            if (find_13.default.W()['sec']) {
                let security = new Security_2.Security(this.sc, e2);
                security.toMenu();
            }
            else {
                //sc.D.l("sec = undefined");
            }
            new Menu_4.Menu(undefined, undefined, 'test2');
            let added = false;
            if (rotate_1.Rotate.starttimer(this.mainContainer)) {
                added = true;
            }
            //Bar.barElementContainer.push(initcountdown(Environment.sc.DOM.crTF(e, Environment.sc.L.g(Environment.sc.c.sI.LS.countdown_refreshtimer, -1), setCountdown)));
            for (let z = 0; z < Environment.sc.c.main_runs; z++) {
                if (z === 0) {
                    /*if (location.href.indexOf("http://localhost:8080/docs/") > -1) {
                        sc.D.aL("GM", sc.c.sI.GS.scriptcomm, function (name, old, newval, remote) {
                            if (newval !== "idle") {
                                if (newval.mode === "getcode") {
                                    console.log("getting script from file");
                                    sc.X.g("http://localhost:8080/docs/JsLibrary/src/" + newval.file + ".js", [], function (e) {
                                        console.log("writing script to storage");
                                        sc.G.s(sc.c.sI.GS.scriptcomm, {
                                            mode: "scriptreturn",
                                            code: e,
                                            file: newval.file
                                        });
                                    });
                                } else if (newval.mode === "open") {
                                    sc.D.o(newval.open);
                                    sc.G.s(sc.c.sI.GS.scriptcomm, "idle");
                                }
                            }

                        });
                        sc.G.s(sc.c.sI.GS.scriptcomm, "idle");
                    }
                    if (location.href.indexOf("https://drive.google.com/") > -1 && location.href.indexOf("/view") > -1) {
                        scripts.MYO.usage();
                        Myo.on('wave_out', function () {
                            move(false, true);
                            //this.vibrate();
                        });
                        Myo.on('wave_in', function () {
                            move(true, true);
                            //this.vibrate();
                        });
                        Myo.on('fist', function () {
                            sc.bar.switchEnabled();
                        });
                    }
                    if ((window.innerHeight === 638 || window.innerHeight === 637 || window.innerHeight === 768)) {
                        //monitor specific stuffs
                        events(mainct);
                    } else if (window.outerHeight === 920) { }
                    else { }
                    sc.bar.templatefield(m1);*/
                }
                else if (z === 2) {
                    //create buttons from CrossDomain-SessionStorage
                    let localbuttons = sc.S.CD.g(sc.c.buttonsfornextinstance, []);
                    for (let i = localbuttons.length - 1; i > -1; i--) {
                        if (localbuttons[i].length > 1) {
                            let btn = sc.DOM.crIN(this.mainContainer, localbuttons[i][0], function (e) {
                                find_13.default.W()[e.innerText]();
                            }, null, null);
                            Bar_7.Bar.barElementContainer.push(btn);
                            find_13.default.W()[localbuttons[i][0]] = (function (url) {
                                return function () {
                                    location.href = url;
                                };
                            })(localbuttons[i][1]);
                        }
                        else {
                            if (localbuttons[i][0].addVideoButtons) {
                                Bar_7.Bar.barElementContainer.push(sc.DOM.crIN(this.mainContainer, 'not this hoster', function () {
                                    Videos_1.Videos.notThisHoster();
                                }));
                                if (sc.S.CD.g('autoplay', false) === true) {
                                    Bar_7.Bar.barElementContainer.push(sc.DOM.crIN(this.mainContainer, 'disable autoplay', async function () {
                                        sc.S.CD.s('autoplay', false);
                                    }));
                                }
                            }
                        }
                    }
                }
                sc.D.sites = 1;
                let Sites = Environment.sc.c.main_sites;
                for (let zi in Sites) {
                    if (Sites[zi].runAtIndex === z + 1 && Sites[zi].runInFrame === false) {
                        if (Sites[zi].isRunning()) {
                            Sites[zi].run();
                        }
                    }
                }
                sc.D.sites = 2;
            }
            new Menu_4.Menu(undefined, undefined, 'test');
            let tabs = Menu_4.Menu.addSubMenu(m1, 'tabs');
            Bar_7.Bar.getTabs(tabs);
            if (m3ind) {
                Bar_7.Bar.barElementContainer[m3ind].menuIndex = 'm3menu';
                Bar_7.Bar.menus['m3menu'] = {
                    menuElements: m3,
                    menuID: 'menu3',
                    parent: Bar_7.Bar.barElementContainer[m3ind]
                };
                Menu_4.Menu.menufy(Bar_7.Bar.barElementContainer[m3ind], m3);
            }
            else {
                sc.D.l('no menu 3', 4);
            }
            bar.repaintBar();
            sc.D.sT(function () {
                var ar2 = sc.G.g(sc.c.sI.GS.eventstorage, []);
                ar2 = ar2.filter((event) => !(event.timestamp === undefined || event.timestamp + (1000 * 60 * 60 * sc.c.notification_save_duration) < sc.T.n()));
                sc.G.s(sc.c.sI.GS.eventstorage, ar2);
            }, 1000 * 60 * 2);
            sc.D.sT(() => {
                Bar_7.Bar.switchEnabled();
            }, 5);
        }
        static setupstart() {
            if (document.body.children[0] && document.body.children[0].nodeName === 'DIVCUSTOM') {
                document.body.children[0].remove();
            }
            let e = document.createElement('divCustom');
            document.body.insertBefore(e, document.body.children[0]);
            Environment.mainContainer = e;
            Bar_7.Bar.menus = {};
            Bar_7.Bar.barElementContainer = [];
            return e;
        }
    }
    Environment.startLine = startLine_1.StartLine.line();
    Environment.zIndex = 2099999999;
    Environment.sc = new libraries_1.libraries();
    //m=> Bar.menus
    //cta =Bar.barElementContainer
    //recebnt => bar.recent
    //clearbutton=>Table.clearRecentEventsIndex
    Environment.mainContainer = document.body; //container|e
    exports.Environment = Environment;
    Environment.register();
});
