var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * @class Animaijs
 * @author Gil Comeau
 * @date 2024-02-01
 */
var Animaijs = /** @class */ (function () {
    function Animaijs(el) {
        this.el = el;
        console.log(this.el);
        this.clone = this.el.cloneNode(true);
        this.clone.style.position = 'absolute';
        this.clone.style.top = '10000px';
        this.clone.style.right = '1000px';
        var compStyle = window.getComputedStyle(this.el);
        this.originalHeight = parseInt(compStyle.height.replace('px', '')) || 0;
    }
    /**
     *
     * @param animation The animation to execute
     * @param time      The time for the animation to complete
     * @param callback  Any clean up required, default empty function
     */
    Animaijs.prototype.__animate = function (animation, time, callback) {
        if (callback === void 0) { callback = function () { }; }
        return __awaiter(this, void 0, void 0, function () {
            var startTime, progress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = performance.now();
                        _a.label = 1;
                    case 1:
                        if (!(performance.now() < time + startTime)) return [3 /*break*/, 3];
                        progress = (performance.now() - startTime) / time;
                        // the animation we are processing
                        animation(progress);
                        // wait for the next frame
                        return [4 /*yield*/, new Promise(requestAnimationFrame)];
                    case 2:
                        // wait for the next frame
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        callback();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Determines if the element is visible in the dom or not
     * @return {  boolean }
     */
    Animaijs.prototype.__isHidden = function () {
        var style = window.getComputedStyle(this.el);
        return (style.display === 'none'
            || style.display === 'hidden'
            || style.height === '0'
            || style.height === '0px'
            || style.opacity === '0'
            || style.visibility === 'hidden');
    };
    /**
     *
     * @param {int} time            time per bounce
     * @param {object} options      options for bounce animation
     * @param {int} bounces         The number of bounces the animation will execute, default 3
     * @param {int} bounceHeight    The starting pixel height on the bounce, the subsequent bounces are reduced by 50%;
     */
    Animaijs.prototype.bounce = function (time, options) {
        if (time === void 0) { time = 150; }
        if (options === void 0) { options = {
            bounces: 3,
            bounceHeight: 10,
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var setTranslate, startTime, i, postive, negative, pixel, progress;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setTranslate = function (pixel) {
                            _this.el.style.transform = "translateY(".concat(pixel, "px)");
                        };
                        startTime = performance.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < options.bounces)) return [3 /*break*/, 6];
                        postive = 10;
                        negative = -10;
                        pixel = i % 2 === 0 ? 10 : -10;
                        _a.label = 2;
                    case 2:
                        if (!(performance.now() < time + startTime)) return [3 /*break*/, 4];
                        progress = (performance.now() - startTime) / time;
                        setTranslate(parseInt("".concat(pixel * progress)));
                        // wait for the next frame
                        return [4 /*yield*/, new Promise(requestAnimationFrame)];
                    case 3:
                        // wait for the next frame
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        startTime = performance.now();
                        postive /= 2;
                        negative /= 2;
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    Animaijs.prototype.fadeIn = function (time) {
        if (time === void 0) { time = 500; }
        return __awaiter(this, void 0, void 0, function () {
            var animation;
            var _this = this;
            return __generator(this, function (_a) {
                // only fade in if the element is not visible in the DOM
                if (this.__isHidden()) {
                    // set the initial state css and then start the animation
                    Object.assign(this.el.style, { overflow: 'hidden', opacity: 0, display: 'block', visibility: 'initial' });
                    animation = function (progress) { return _this.el.style.opacity = "".concat(progress); };
                    this.__animate(animation, time, function () { return _this.el.style.opacity = '1'; });
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    Animaijs.prototype.fadeOut = function (time) {
        if (time === void 0) { time = 500; }
        return __awaiter(this, void 0, void 0, function () {
            var animation;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.__isHidden()) {
                    Object.assign(this.el.style, { overflow: 'hidden', opacity: 1 });
                    animation = function (progress) { return _this.el.style.opacity = "".concat(1 - progress); };
                    this.__animate(animation, time, function () { return _this.el.style.opacity = '0'; });
                    Object.assign(this.el.style, { display: 'none' });
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    Animaijs.prototype.grow = function (time) {
        if (time === void 0) { time = 500; }
        return __awaiter(this, void 0, void 0, function () {
            var animation;
            var _this = this;
            return __generator(this, function (_a) {
                Object.assign(this.el.style, { transform: "scale3d(0)", opacity: 1, display: 'block' });
                animation = function (progress) { return _this.el.style.transform = "scale3d(".concat(progress, ",").concat(progress, ",").concat(progress, ")"); };
                this.__animate(animation, time, function () { return _this.el.style.transform = 'scale3d(1,1,1)'; });
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param {string} behavior One of smooth, instant, auto. Default: smooth
     */
    Animaijs.prototype.scroll = function (behavior) {
        if (behavior === void 0) { behavior = 'smooth'; }
        var x = this.el.offsetLeft;
        var y = this.el.offsetTop;
        window.scroll({
            behavior: behavior,
            left: x,
            top: y
        });
    };
    /**
     * Smooth Scrolls to the element with an option to control the time period.
     *
     * @param {number} time The number of milliseconds to scroll to the element. Default 500 ms;
     */
    Animaijs.prototype.scrollTimed = function (time) {
        if (time === void 0) { time = 500; }
        return __awaiter(this, void 0, void 0, function () {
            var scrollHeight, animation;
            return __generator(this, function (_a) {
                scrollHeight = window.scrollY + this.el.offsetTop;
                animation = function (progress) {
                    var height = scrollHeight * progress;
                    window.scrollTo(0, height);
                };
                this.__animate(animation, time, function () { return window.scrollTo(0, scrollHeight); });
                return [2 /*return*/];
            });
        });
    };
    Animaijs.prototype.shrink = function (time) {
        var _this = this;
        if (time === void 0) { time = 500; }
        Object.assign(this.el.style, { transform: "scale3d(100)", opacity: 1, display: 'block' });
        var animation = function (progress) { _this.el.style.transform = "scale3d(".concat(1 - progress, ",").concat(1 - progress, ",").concat(1 - progress, ")"); };
        this.__animate(animation, time, function () { return _this.el.style.transform = "scale3d(0,0,0)"; });
    };
    /**
    *
    * @param {string} time The time in ms for the slide down animation to complete
    *
    */
    Animaijs.prototype.slideDown = function (time) {
        var _this = this;
        if (time === void 0) { time = 500; }
        // only perform on hidden elements 
        if (this.__isHidden()) {
            // calculate the clone height
            // set the element css for the animation
            Object.assign(this.el.style, { overflow: 'hidden', height: 0, display: 'block' });
            var animation = function (progress) {
                // get/set the current pixel height
                var pixels = parseInt("".concat(progress * _this.originalHeight));
                _this.el.style.height = "".concat(pixels, "px");
            };
            this.__animate(animation, time, function () { return _this.el.style.height = "".concat(_this.originalHeight, "px"); });
        }
    };
    /**
    *
    * @param {string} time The time in ms for the slide up animation to complete
    *
    */
    Animaijs.prototype.slideUp = function (time) {
        if (time === void 0) { time = 500; }
        return __awaiter(this, void 0, void 0, function () {
            var style, startTime, offsetHeight, animation;
            var _this = this;
            return __generator(this, function (_a) {
                style = window.getComputedStyle(this.el);
                startTime = performance.now();
                Object.assign(this.el.style, { overflow: 'hidden' });
                offsetHeight = parseInt(style.height.replace('px', '')) || 0;
                animation = function (progress) {
                    // get/set the current pixel height
                    var pixels = parseInt("".concat(progress * offsetHeight));
                    _this.el.style.height = "".concat(offsetHeight - pixels, "px");
                };
                this.__animate(animation, time, function () { return _this.el.style.height = '0'; });
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param {string} time The time in ms for the slide up animation to complete
     *
     */
    Animaijs.prototype.slideToggle = function (time) {
        if (time === void 0) { time = 500; }
        if (this.__isHidden()) {
            this.slideDown(time);
        }
        else {
            this.slideUp(time);
        }
    };
    return Animaijs;
}());
