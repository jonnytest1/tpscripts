(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var routes = [];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n#myCanvas{\r\n    width:100%;\r\n    height:-webkit-fill-available;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0lBQ0ksVUFBVTtJQUNWLDZCQUE2QjtBQUNqQyIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiNteUNhbnZhc3tcclxuICAgIHdpZHRoOjEwMCU7XHJcbiAgICBoZWlnaHQ6LXdlYmtpdC1maWxsLWF2YWlsYWJsZTtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\r\n\r\n<div #myCanvas id=\"myCanvas\"></div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _p5_initialite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./p5-initialite */ "./src/app/p5-initialite.ts");
/* harmony import */ var _terrain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./terrain */ "./src/app/terrain.ts");
/* harmony import */ var _player_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player/player */ "./src/app/player/player.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent() {
        var _this = _super.call(this) || this;
        _this.title = 'globalwebpage';
        return _this;
    }
    AppComponent.prototype.getContainer = function () {
        return this.container.nativeElement;
    };
    AppComponent.prototype.setup = function () {
        this.p5.createCanvas(this.width, this.height, this.p5.WEBGL);
        this.player = new _player_player__WEBPACK_IMPORTED_MODULE_3__["Player"](this.p5);
        this.terrain = new _terrain__WEBPACK_IMPORTED_MODULE_2__["Terrain"](this.p5);
        // @ts-ignore
        this.container.nativeElement.children[0].requestPointerLock();
    };
    AppComponent.prototype.draw = function () {
        var pos = this.p5.createVector(0, 0, 60);
        this.sphere(pos, 50);
        this.terrain.draw(this.p5.createVector(-1000, -1000, -100));
        this.player.draw();
        this.p5.noCursor();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('myCanvas'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], AppComponent.prototype, "container", void 0);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}(_p5_initialite__WEBPACK_IMPORTED_MODULE_1__["p5Initialize"]));



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/p5-initialite.ts":
/*!**********************************!*\
  !*** ./src/app/p5-initialite.ts ***!
  \**********************************/
/*! exports provided: p5Initialize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p5Initialize", function() { return p5Initialize; });
/* harmony import */ var _p5Module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./p5Module */ "./src/app/p5Module.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var p5Initialize = /** @class */ (function (_super) {
    __extends(p5Initialize, _super);
    function p5Initialize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    p5Initialize.prototype.p5Init = function (p5) {
        var _this = this;
        p5.draw = function () { return _this.draw.call(_this); };
        p5.setup = function () { return _this.setup.call(_this); };
        p5.keyPressed = function () { return _this.keyPressed.call(_this); };
    };
    p5Initialize.prototype.keyPressed = function () {
    };
    p5Initialize.prototype.setup = function () {
        this.p5.createCanvas(this.width, this.height);
    };
    p5Initialize.prototype.ngAfterViewInit = function () {
        var _this = this;
        var comp = this.getContainer();
        this.height = comp.offsetHeight;
        this.width = comp.offsetWidth;
        //@ts-ignore
        this.p5 = this.add(new this.p5(function (p) { return _this.p5Init.call(_this, p); }, comp));
    };
    return p5Initialize;
}(_p5Module__WEBPACK_IMPORTED_MODULE_0__["p5Module"]));



/***/ }),

/***/ "./src/app/p5Module.ts":
/*!*****************************!*\
  !*** ./src/app/p5Module.ts ***!
  \*****************************/
/*! exports provided: p5Module */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p5Module", function() { return p5Module; });
//@ts-ignore
var p5I = __webpack_require__(/*! ../../node_modules/p5/lib/p5.js */ "./node_modules/p5/lib/p5.js");
var p5Module = /** @class */ (function () {
    function p5Module() {
        this.p5 = this.add(p5I);
    }
    p5Module.prototype.circle = function (pos, radius) {
        return this.p5.circle(pos.x, pos.y, radius);
    };
    p5Module.prototype.sphere = function (pos, radius) {
        this.p5.translate(pos);
        this.p5.sphere(radius);
        return this.p5.translate(pos.mult(-1));
    };
    p5Module.prototype.directionFromInput = function () {
        var y = 0;
        var x = 0;
        if (this.p5.keyIsDown(65)) {
            x--;
        }
        if (this.p5.keyIsDown(68)) {
            x++;
        }
        if (this.p5.keyIsDown(87)) {
            y++;
        }
        if (this.p5.keyIsDown(83)) {
            y--;
        }
        return this.p5.createVector(x, y);
    };
    p5Module.prototype.add = function (p5) {
        var _this = this;
        var p5Original = p5;
        p5Original.crcl = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            return (_a = _this.circle).call.apply(_a, [_this].concat(args));
        };
        p5Original.sphre = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            return (_a = _this.sphere).call.apply(_a, [_this].concat(args));
        };
        p5Original.directionFromInput = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            return (_a = _this.directionFromInput).call.apply(_a, [_this].concat(args));
        };
        return p5Original;
    };
    return p5Module;
}());



/***/ }),

/***/ "./src/app/player/actions/action.ts":
/*!******************************************!*\
  !*** ./src/app/player/actions/action.ts ***!
  \******************************************/
/*! exports provided: Action */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Action", function() { return Action; });
var Action = /** @class */ (function () {
    function Action(p5) {
        this.p5 = p5;
    }
    Action.prototype.isValid = function (player) {
        return true;
    };
    return Action;
}());



/***/ }),

/***/ "./src/app/player/actions/mouse-action.ts":
/*!************************************************!*\
  !*** ./src/app/player/actions/mouse-action.ts ***!
  \************************************************/
/*! exports provided: MouseAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MouseAction", function() { return MouseAction; });
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action */ "./src/app/player/actions/action.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var MouseAction = /** @class */ (function (_super) {
    __extends(MouseAction, _super);
    function MouseAction(p5) {
        var _this = _super.call(this, p5) || this;
        _this.DOWN = _this.p5.createVector(0, -1, 0);
        _this.UP = _this.p5.createVector(0, 1, 0);
        return _this;
    }
    MouseAction.prototype.execute = function (player) {
        if (!this.mouseX) {
            this.mouseX = this.p5.mouseX;
        }
        if (!this.mouseY) {
            this.mouseY = this.p5.mouseY;
        }
        var diffY = this.p5.mouseY - this.mouseY;
        var yLerp = this.UP.copy();
        if (diffY < 0) {
            yLerp = this.DOWN.copy();
        }
        var percentY = this.toPercent(diffY);
        player.look.lerp(yLerp.x, yLerp.y, yLerp.z, percentY * 0.5);
        var diffX = this.p5.mouseX - this.mouseX;
        var xLerp = player.look.copy().cross(this.UP.copy());
        if (diffX < 0) {
            xLerp = player.look.copy().cross(this.DOWN.copy());
        }
        var percentX = this.toPercent(diffX);
        player.look.lerp(xLerp.x, xLerp.y, xLerp.z, percentX * 0.5);
        this.mouseX = this.p5.mouseX;
        this.mouseY = this.p5.mouseY;
    };
    MouseAction.prototype.toPercent = function (diff) {
        return this.p5.map(Math.abs(diff), 0, 200, 0, 1);
    };
    return MouseAction;
}(_action__WEBPACK_IMPORTED_MODULE_0__["Action"]));



/***/ }),

/***/ "./src/app/player/actions/move-action.ts":
/*!***********************************************!*\
  !*** ./src/app/player/actions/move-action.ts ***!
  \***********************************************/
/*! exports provided: MoveAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MoveAction", function() { return MoveAction; });
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action */ "./src/app/player/actions/action.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var MoveAction = /** @class */ (function (_super) {
    __extends(MoveAction, _super);
    function MoveAction(p5) {
        return _super.call(this, p5) || this;
    }
    MoveAction.prototype.execute = function (player) {
        player.move(this.p5.directionFromInput());
    };
    return MoveAction;
}(_action__WEBPACK_IMPORTED_MODULE_0__["Action"]));



/***/ }),

/***/ "./src/app/player/player.ts":
/*!**********************************!*\
  !*** ./src/app/player/player.ts ***!
  \**********************************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony import */ var _actions_move_action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/move-action */ "./src/app/player/actions/move-action.ts");
/* harmony import */ var _actions_mouse_action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions/mouse-action */ "./src/app/player/actions/mouse-action.ts");


var Player = /** @class */ (function () {
    function Player(p5) {
        this.p5 = p5;
        this.speed = 100;
        this.position = p5.createVector();
        this.velocity = p5.createVector();
        this.speed;
        this.actions = [
            new _actions_move_action__WEBPACK_IMPORTED_MODULE_0__["MoveAction"](p5),
            new _actions_mouse_action__WEBPACK_IMPORTED_MODULE_1__["MouseAction"](p5)
        ];
        this.camera = p5.createCamera();
        this.look = p5.createVector(1, 0, 0);
    }
    Player.prototype.move = function (direction) {
        var multiplied = direction.mult(this.speed);
        this.position.add(multiplied.copy());
    };
    Player.prototype.action = function () {
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            if (action.isValid(this)) {
                action.execute(this);
            }
        }
    };
    Player.prototype.update = function () {
        // this.position.add(this.velocity);
    };
    Player.prototype.draw = function () {
        this.setLook(this.position.copy().add(this.look));
        this.setPos(this.position);
        this.action();
        this.update();
        //this.p5.sphre(this.position, 50);
    };
    Player.prototype.setLook = function (look) {
        this.camera.lookAt(look.x, look.y, look.z);
    };
    Player.prototype.setPos = function (pos) {
        this.camera.setPosition(pos.x, pos.y, pos.z);
    };
    return Player;
}());



/***/ }),

/***/ "./src/app/terrain.ts":
/*!****************************!*\
  !*** ./src/app/terrain.ts ***!
  \****************************/
/*! exports provided: Terrain */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Terrain", function() { return Terrain; });
var Terrain = /** @class */ (function () {
    function Terrain(p5) {
        this.p5 = p5;
        this.terrainData = [];
        this.rows = 200;
        this.columns = 200;
        this.scale = 20;
        var noise = 0.1;
        var size = 50;
        var yoff = 0;
        for (var y = 0; y < this.rows; y++) {
            var xoff = 0;
            this.terrainData[y] = [];
            for (var x = 0; x < this.columns; x++) {
                this.terrainData[y][x] = this.p5.map(this.p5.noise(xoff, yoff), 0, 1, -size, size);
                xoff += noise;
            }
            yoff += noise;
        }
    }
    Terrain.prototype.draw = function (offset) {
        this.p5.background(0);
        this.p5.noStroke();
        this.p5.fill('green');
        this.p5.translate(offset);
        // this.p5.rotateX(-this.p5.PI / 3)
        for (var x = 0; x < this.rows; x++) {
            this.p5.beginShape(this.p5.TRIANGLE_STRIP);
            for (var z = 0; z < this.columns; z++) {
                this.p5.vertex(z * this.scale, this.terrainData[z][x], x * this.scale);
                this.p5.vertex(z * this.scale, this.terrainData[z][x + 1], (x + 1) * this.scale);
            }
            this.p5.endShape();
        }
    };
    return Terrain;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\vm\dockervm\storage\tpscripts\game\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map