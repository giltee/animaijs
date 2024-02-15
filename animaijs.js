var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @class Animaijs
 * @author Gil Comeau
 * @date 2024-02-01
 */
class Animaijs {
    constructor(el) {
        this.el = el;
        this.clone = this.el.cloneNode(true);
        Object.assign(this.clone.style, {
            display: 'block',
            visibility: 'hidden'
        });
        document.body.append(this.clone);
        const compStyle = window.getComputedStyle(this.clone);
        this.originalHeight = parseInt(compStyle.height.replace('px', '')) || 0;
        this.clone.remove();
    }
    /**
     *
     * @param { Function } animation The animation to execute
     * @param { int } time      The time for the animation to complete
     * @param { Function } callback  Any clean up required, default empty function
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
     * @param {int} options.bounces         The number of bounces the animation will execute, default 3
     * @param {int} options.bounceHeight    The starting pixel height on the bounce, the subsequent bounces are reduced by 50%;
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
            const { bounceHeight } = options;
            let postive = bounceHeight; // the bounce in pixels
            let negative = -bounceHeight; // the down bounce in pixels
            for (let i = 0; i < options.bounces; i++) {
                const pixel = i % 2 === 0 ? postive : negative;
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
            Object.assign(this.el.style, { transform: `translateY(${0}px)` });
            return this;
        });
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     * @returns {this}
     */
    fadeIn(time = 500) {
        // only fade in if the element is not visible in the DOM
        if (this.__isHidden()) {
            // set the initial state css and then start the animation
            Object.assign(this.el.style, { overflow: 'hidden', opacity: 0, display: 'block', visibility: 'initial' });
            const animation = (progress) => this.el.style.opacity = `${progress}`;
            this.__animate(animation, time, () => this.el.style.opacity = '1');
        }
        return this;
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     * @returns {this}
     */
    fadeOut(time = 500) {
        if (!this.__isHidden()) {
            Object.assign(this.el.style, { overflow: 'hidden', opacity: 1 });
            const animation = (progress) => this.el.style.opacity = `${1 - progress}`;
            this.__animate(animation, time, () => Object.assign(this.el.style, { display: 'none', opacity: 0 }));
        }
        return this;
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     * @returns {this}
     */
    fadeToggle(time = 500) {
        if (this.__isHidden()) {
            this.fadeIn(time);
        }
        else {
            this.fadeOut(time);
        }
        return this;
    }
    /**
     *
     * @param {int} time time for animation to complete in milliseconds
     */
    grow(time = 500) {
        Object.assign(this.el.style, { transform: `scale3d(0)`, opacity: 1, display: 'block' });
        const animation = (progress) => this.el.style.transform = `scale3d(${progress},${progress},${progress})`;
        this.__animate(animation, time, () => this.el.style.transform = 'scale3d(1,1,1)');
        return this;
    }
    /**
     *
     * @param { function }callback  The function you would like to execute when the intersection is met
     * @param { object }options   The optons of the intersection observer
     * @param { boolean | null} options.root
     * @param { string } options.rootMargin
     * @param { float } options.threshold
     * @param {object}unobserverAfter
     */
    observeIntersection(callback, options = {
        root: null,
        rootMargin: '0px',
        threshold: .1
    }, unobserverAfter = 0) {
        let observer;
        let observeCount = 0;
        const observerCallback = (entries) => {
            for (const entry of entries) {
                observeCount++;
                if (entry.isIntersecting) {
                    callback();
                    if (unobserverAfter > 0
                        && observeCount >= unobserverAfter) {
                        observer.unobserve(this.el);
                    }
                }
            }
        };
        observer = new IntersectionObserver(observerCallback, options);
        observer.observe(this.el);
    }
    pulse(time = 500) {
        const animation = (progress) => {
            if (progress < .7) {
                console.log('less');
            }
            else if (progress >= .7 && progress < 1) {
                console.log('ani');
            }
            else {
                console.log('done');
            }
        };
        this.__animate(animation, time);
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
        return this;
    }
    /**
     *
     * @param {string} behavior One of smooth, instant, auto. Default: smooth
     */
    shrink(time = 500) {
        Object.assign(this.el.style, { transform: `scale3d(100)`, opacity: 1, display: 'block' });
        const animation = (progress) => this.el.style.transform = `scale3d(${1 - progress},${1 - progress},${1 - progress})`;
        this.__animate(animation, time, () => this.el.style.transform = `scale3d(0,0,0)`);
        return this;
    }
    /**
    *
    * @param {string} time The time in ms for the slide down animation to complete
    *
    */
    slideDown(time = 500) {
        // only perform on hidden elements 
        if (this.__isHidden()) {
            // set the element css for the animation
            Object.assign(this.el.style, { overflow: 'hidden', height: 0, display: 'block' });
            const animation = (progress) => this.el.style.height = `${parseInt(`${progress * this.originalHeight}`)}px`;
            this.__animate(animation, time, () => this.el.style.height = `unset`);
        }
        return this;
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
            const animation = (progress) => this.el.style.height = `${offsetHeight - parseInt(`${progress * offsetHeight}`)}px`;
            this.__animate(animation, time, () => this.el.style.height = '0');
            return this;
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
        return this;
    }
    /**
     *
     * @param { string } message    The message being typed to the textContent of the element
     * @param { int } time          The time for each key stoke to execute/
     */
    typeMessage(message, time = 100) {
        let index = 0;
        let textContent = "";
        let interval = null;
        interval = setInterval(() => {
            if (textContent.length >= message.length) {
                clearInterval(interval);
            }
            this.el.textContent += message.charAt(index++);
        }, time);
    }
}
