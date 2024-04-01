/**
 * @class Animaijs 
 * @author Gil Comeau
 * @date 2024-02-01
 */


interface PulseOptions {
    color?: string;
    margin?: string;
    padding?: string;
    shadow?: number;
}

export default class Animaijs {

    private clone: HTMLElement | any;
    private el: HTMLElement;
    private originalHeight: number;

    constructor(el: HTMLElement | any) {
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
    private async __animate(animation: (progress: any) => {}, time: number, callback = () => { }) {

        const startTime = performance.now();

        while (performance.now() < time + startTime) {
            const progress = (performance.now() - startTime) / time;
            // the animation we are processing
            animation(progress);
            // wait for the next frame
            await new Promise(requestAnimationFrame);
        }

        callback();
    }

    private __hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    /** 
     * Determines if the element is visible in the dom or not
     * @return {  boolean }  
     */
    private __isHidden(): boolean {
        const style = window.getComputedStyle(this.el);
        return (
            style.display === 'none'
            || style.display === 'hidden'
            || style.height === '0'
            || style.height === '0px'
            || style.opacity === '0'
            || style.visibility === 'hidden'
        );
    }

    private __parseRgb(rgb: string) {
        let result: object | null = null;
        const match = rgb.match(/\d+/g);
        return match ? {
            r: parseInt(match[0]),
            g: parseInt(match[1]),
            b: parseInt(match[2])
        } : { r: 0, g: 0, b: 0 };
    }
    /**
     * 
     * @param {int} time            time per bounce 
     * @param {object} options      options for bounce animation
     * @param {int} options.bounces         The number of bounces the animation will execute, default 3
     * @param {int} options.bounceHeight    The starting pixel height on the bounce, the subsequent bounces are reduced by 50%;
     */
    public async bounce(time: number = 150, options = {
        bounces: 3,
        bounceHeight: 10,
    }) {

        const setTranslate = (pixel: number) => {
            this.el.style.transform = `translateY(${pixel}px)`;
        };

        let startTime = performance.now();
        const { bounceHeight } = options;

        let postive = bounceHeight; // the bounce in pixels
        let negative = -bounceHeight; // the down bounce in pixels

        const bounces = async () => {
            for (let i = 0; i < options.bounces; i++) {

                const pixel = i % 2 === 0 ? postive : negative;

                while (performance.now() < time + startTime) {
                    const progress = (performance.now() - startTime) / time;

                    setTranslate(parseInt(`${pixel * progress}`))
                    // wait for the next frame
                    await new Promise(requestAnimationFrame);
                }

                startTime = performance.now();

                postive /= 2;
                negative /= 2;

            }
        }

        await bounces();

        Object.assign(this.el.style, { transform: `translateY(${0}px)` })

        return this;

    }

    /**
     * 
     * @param {int} time time for animation to complete in milliseconds 
     * @returns {this}
     */
    public fadeIn(time = 500) {
        // only fade in if the element is not visible in the DOM
        if (this.__isHidden()) {

            // set the initial state css and then start the animation
            Object.assign(this.el.style, { overflow: 'hidden', opacity: 0, display: 'block', visibility: 'initial' });
            const animation = (progress: number | string) => this.el.style.opacity = `${progress}`;
            this.__animate(animation, time, () => this.el.style.opacity = '1');

        }

        return this;
    }

    /**
     * 
     * @param {int} time time for animation to complete in milliseconds 
     * @returns {this}
     */
    public fadeOut(time = 500) {

        if (!this.__isHidden()) {
            Object.assign(this.el.style, { overflow: 'hidden', opacity: 1 });
            const animation = (progress: number) => this.el.style.opacity = `${1 - progress}`;
            this.__animate(animation, time, () => Object.assign(this.el.style, { display: 'none', opacity: 0 }));

        }

        return this;
    }

    /**
     * 
     * @param {int} time time for animation to complete in milliseconds 
     * @returns {this}
     */
    public fadeToggle(time = 500) {
        if (this.__isHidden()) {
            this.fadeIn(time);
        } else {
            this.fadeOut(time);
        }
        return this;
    }

    /**
     * 
     * @param {int} time time for animation to complete in milliseconds 
     */
    public grow(time = 500) {

        Object.assign(this.el.style, { transform: `scale3d(0)`, opacity: 1, display: 'block' });
        const animation = (progress: number | string) => this.el.style.transform = `scale3d(${progress},${progress},${progress})`;
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
    public observeIntersection(callback: Function, options: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: .1
    }, unobserverAfter: number = 0) {
        let observer: IntersectionObserver;
        let observeCount = 0;
        const observerCallback: IntersectionObserverCallback = (entries) => {

            for (const entry of entries) {

                observeCount++;
                if (entry.isIntersecting) {

                    callback();
                    if (
                        unobserverAfter > 0
                        && observeCount >= unobserverAfter
                    ) {
                        observer.unobserve(this.el);
                    }

                }
            }

        };

        observer = new IntersectionObserver(observerCallback, options);
        observer.observe(this.el);
    }

    public pulse(time = 500, options: PulseOptions = {}) {

        const defaults: PulseOptions = {
            color: window.getComputedStyle(this.el).backgroundColor,
            margin: '5px',
            padding: '5px',
            shadow: 10
        }

        for (const key in defaults) {
            const myKey = key as keyof PulseOptions;
            if (!options.hasOwnProperty(myKey)) {
                //@ts-ignore
                options[myKey] = defaults[myKey] as PulseOptions[typeof myKey];
            }
        }
        const orginalMargin = this.el.style.margin;
        const originalPadding = this.el.style.padding;

        let { color, margin, padding, shadow } = options;

        let rgb = { r: 0, g: 0, b: 0 };
        if (color?.match('rgb')) {
            rgb = this.__parseRgb(color)
        }
        else if (color?.match(/#[0-9]{6}|[a-f]{6}|([a-fA-Z0-9]){6}/)) {
            rgb = this.__hexToRgb(color);
        }
        else {
            console.error('invalid color provided, must be hex or rgb');
        }
        const boxShadowStr = (pixel = 0, alpha = 0) => {
            return `0 0 ${pixel}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
        }

        const animation = (progress: number): any => {

            if (progress < .5) {

                Object.assign(this.el.style, {
                    boxShadow: boxShadowStr(shadow || 1 * progress, progress + .5),
                    margin: margin,
                    padding: padding,
                    transform: 'scale(0.95)'
                });

            } else {

                Object.assign(this.el.style, {
                    boxShadow: boxShadowStr((shadow || 1 * 2) * progress, 1 - progress + .5),
                    margin: margin,
                    padding: padding,
                    transform: 'scale(1)'
                });
            }
        }

        this.__animate(animation, time, () => Object.assign(this.el.style, {
            boxShadow: boxShadowStr(0, 0),
            margin: orginalMargin,
            padding: originalPadding,
            transform: 'scale(1)'
        }));

        return this;
    }

    /**
     * 
     * @param {string} behavior One of smooth, instant, auto. Default: smooth
     */
    public scroll(behavior = 'smooth') {
        const x = this.el.offsetLeft;
        const y = this.el.offsetTop;
        window.scroll({
            behavior: behavior as ScrollBehavior,
            left: x,
            top: y
        });

        return this;
    }

    /**
     * 
     * @param {string} behavior One of smooth, instant, auto. Default: smooth
     */
    public shrink(time = 500) {

        Object.assign(this.el.style, { transform: `scale3d(100)`, opacity: 1, display: 'block' });
        const animation = (progress: number) => this.el.style.transform = `scale3d(${1 - progress},${1 - progress},${1 - progress})`;
        this.__animate(animation, time, () => this.el.style.transform = `scale3d(0,0,0)`);

        return this;
    }


    /**
    * 
    * @param {string} time The time in ms for the slide down animation to complete
    * 
    */
    public slideDown(time = 500) {


        // only perform on hidden elements 
        if (this.__isHidden()) {

            // set the element css for the animation
            Object.assign(this.el.style, { overflow: 'hidden', height: 0, display: 'block' });
            const animation = (progress: number) => this.el.style.height = `${parseInt(`${progress * this.originalHeight}`)}px`;

            this.__animate(animation, time, () => this.el.style.height = `unset`);
        }

        return this;
    }

    /**
    * 
    * @param {string} time The time in ms for the slide up animation to complete
    * 
    */
    public async slideUp(time = 500) {

        const style = window.getComputedStyle(this.el);
        const startTime = performance.now();

        Object.assign(this.el.style, { overflow: 'hidden' });
        const offsetHeight = parseInt(style.height.replace('px', '')) || 0;

        const animation = (progress: number) => this.el.style.height = `${offsetHeight - parseInt(`${progress * offsetHeight}`)}px`;

        this.__animate(animation, time, () => this.el.style.height = '0');

        return this;
    }

    /**
     * 
     * @param {string} time The time in ms for the slide up animation to complete
     * 
     */
    public slideToggle(time = 500) {

        if (this.__isHidden()) {
            this.slideDown(time);
        } else {
            this.slideUp(time);
        }
        return this;
    }


    /**
     * 
     * @param { string } message    The message being typed to the textContent of the element
     * @param { int } time          The time for each key stoke to execute/
     */
    public typeMessage(message: string, time = 100) {

        let index = 0;
        let textContent = "";

        let interval: any = null;
        interval = setInterval(() => {

            if (textContent.length >= message.length) {
                clearInterval(interval)
            }
            this.el.textContent += message.charAt(index++);

        }, time);

    }

}
