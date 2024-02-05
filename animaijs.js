"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Animaijs
 * @author Gil Comeau
 * @date 2024-02-01
 */
class Animaijs {
    constructor(el) {
        this.el = el;
        console.log(this.el);
        this.clone = this.el.cloneNode(true);
        this.clone.style.position = 'absolute';
        this.clone.style.top = '10000px';
        this.clone.style.right = '1000px';
        const compStyle = window.getComputedStyle(this.el);
        this.originalHeight = parseInt(compStyle.height.replace('px', '')) || 0;
    }
    /**
     *
     * @param animation The animation to execute
     * @param time      The time for the animation to complete
     * @param callback  Any clean up required, default empty function
     */
    __animate(animation, time, callback = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = performance.now();
            while (performance.now() < time + startTime) {
                const progress = (performance.now() - startTime) / time;
                // the animation we are processing
                animation(progress);
                // wait for the next frame
                yield new Promise(requestAnimationFrame);
            }
            callback();
        });
    }
    /**
     * Determines if the element is visible in the dom or not
     * @return {  boolean }
     */
    __isHidden() {
        const style = window.getComputedStyle(this.el);
        return (style.display === 'none'
            || style.display === 'hidden'
            || style.height === '0'
            || style.height === '0px'
            || style.opacity === '0'
            || style.visibility === 'hidden');
    }
    /**
     *
     * @param {int} time            time per bounce
     * @param {object} options      options for bounce animation
     * @param {int} bounces         The number of bounces the animation will execute, default 3
     * @param {int} bounceHeight    The starting pixel height on the bounce, the subsequent bounces are reduced by 50%;
     */
    bounce(time = 150, options = {
        bounces: 3,
        bounceHeight: 10,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            const setTranslate = (pixel) => {
                this.el.style.transform = `translateY(${pixel}px)`;
            };
            let startTime = performance.now();
            for (let i = 0; i < options.bounces; i++) {
                let postive = 10;
                let negative = -10;
                const pixel = i % 2 === 0 ? 10 : -10;
                while (performance.now() < time + startTime) {
                    const progress = (performance.now() - startTime) / time;
                    setTranslate(parseInt(`${pixel * progress}`));
                    // wait for the next frame
                    yield new Promise(requestAnimationFrame);
                }
                startTime = performance.now();
                postive /= 2;
                negative /= 2;
            }
        });
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    fadeIn(time = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            // only fade in if the element is not visible in the DOM
            if (this.__isHidden()) {
                // set the initial state css and then start the animation
                Object.assign(this.el.style, { overflow: 'hidden', opacity: 0, display: 'block', visibility: 'initial' });
                const animation = (progress) => this.el.style.opacity = `${progress}`;
                this.__animate(animation, time, () => this.el.style.opacity = '1');
            }
        });
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    fadeOut(time = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.__isHidden()) {
                Object.assign(this.el.style, { overflow: 'hidden', opacity: 1 });
                const animation = (progress) => this.el.style.opacity = `${1 - progress}`;
                this.__animate(animation, time, () => this.el.style.opacity = '0');
                Object.assign(this.el.style, { display: 'none' });
            }
        });
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    grow(time = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(this.el.style, { transform: `scale3d(0)`, opacity: 1, display: 'block' });
            const animation = (progress) => this.el.style.transform = `scale3d(${progress},${progress},${progress})`;
            this.__animate(animation, time, () => this.el.style.transform = 'scale3d(1,1,1)');
        });
    }
    /**
     *
     * @param {string} behavior One of smooth, instant, auto. Default: smooth
     */
    scroll(behavior = 'smooth') {
        const x = this.el.offsetLeft;
        const y = this.el.offsetTop;
        window.scroll({
            behavior: behavior,
            left: x,
            top: y
        });
    }
    /**
     * Smooth Scrolls to the element with an option to control the time period.
     *
     * @param {number} time The number of milliseconds to scroll to the element. Default 500 ms;
     */
    scrollTimed(time = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrollHeight = window.scrollY + this.el.offsetTop;
            const animation = (progress) => {
                const height = scrollHeight * progress;
                window.scrollTo(0, height);
            };
            this.__animate(animation, time, () => window.scrollTo(0, scrollHeight));
        });
    }
    shrink(time = 500) {
        Object.assign(this.el.style, { transform: `scale3d(100)`, opacity: 1, display: 'block' });
        const animation = (progress) => { this.el.style.transform = `scale3d(${1 - progress},${1 - progress},${1 - progress})`; };
        this.__animate(animation, time, () => this.el.style.transform = `scale3d(0,0,0)`);
    }
    /**
    *
    * @param {string} time The time in ms for the slide down animation to complete
    *
    */
    slideDown(time = 500) {
        // only perform on hidden elements 
        if (this.__isHidden()) {
            // calculate the clone height
            // set the element css for the animation
            Object.assign(this.el.style, { overflow: 'hidden', height: 0, display: 'block' });
            const animation = (progress) => {
                // get/set the current pixel height
                const pixels = parseInt(`${progress * this.originalHeight}`);
                this.el.style.height = `${pixels}px`;
            };
            this.__animate(animation, time, () => this.el.style.height = `${this.originalHeight}px`);
        }
    }
    /**
    *
    * @param {string} time The time in ms for the slide up animation to complete
    *
    */
    slideUp(time = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            const style = window.getComputedStyle(this.el);
            const startTime = performance.now();
            Object.assign(this.el.style, { overflow: 'hidden' });
            const offsetHeight = parseInt(style.height.replace('px', '')) || 0;
            const animation = (progress) => {
                // get/set the current pixel height
                const pixels = parseInt(`${progress * offsetHeight}`);
                this.el.style.height = `${offsetHeight - pixels}px`;
            };
            this.__animate(animation, time, () => this.el.style.height = '0');
        });
    }
    /**
     *
     * @param {string} time The time in ms for the slide up animation to complete
     *
     */
    slideToggle(time = 500) {
        if (this.__isHidden()) {
            this.slideDown(time);
        }
        else {
            this.slideUp(time);
        }
    }
}
exports.default = Animaijs;
