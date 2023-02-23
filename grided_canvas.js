export default class GridedCanvas extends EventTarget {

    #body = document.createElement('div');
    #grid_detail = {
        small_grid: {size: 8, stroke_color: 'rgba(0, 0, 0, 0.4'},
        large_grid: {size: 32, stroke_color: 'rgba(0, 0, 0, 0.8'}
    }
    #namespace;

    constructor(width, height, namespace = "http://www.w3.org/2000/svg") {
        super( );
        this.#namespace = namespace;
        this.#body.innerHTML = createHTML(namespace);
        this.width = width;
        this.height = height;
    } 

    /**
     * 
     * @param {SVGElement} svg 
     * @param {Object} options 
     */
    #setAttributes(svg, options) {
        for(const option in options) {
            svg.setAttribute(option, ioptions[option]);
        }
    }

    get canvas( ) {
        return this.#body.querySelector('canvas');
    }

    get width( ) {
        return this.#canvas.width;
    }

    set width(n) {
        this.canvas.width = n;
        this.#setAttributes(this.#body.querySelector('svg'), {viewBox: `0 0 ${this.canvas.width} ${this.canvas.height}`});
    }

    get height( ) {
        return this.canvas.height;
    }

    set height(n) {
        this.canvas.height = n;
        this.#setAttributes(this.#body.querySelector('svg'), {viewBox: `0 0 ${this.canvas.width} ${this.canvas.height}`});
 
    }

    get microGridSize( ) {return this.#grid_detail.small_grid.size}

    set microGridSize(n) {
        this.#grid_detail.small_grid.size = n;
        const micro_grid = this.#body.querySelector('#micro-grid');
        this.#setAttributes(micro_grid, {width: n, height: n});
        const micro_path = micro_grid.querySelector('path');
        this.#setAttributes(micro_path, {d: `M ${n} 0 L 0 0 0 ${n}`});
    }

    get macroGridSize( ) {return this.#grid_detail.large_grid.size}
    
    set macroGridSize(n) {
        n = Math.max(this.#grid_detail.small_grid.size, n);
        this.#grid_detail.large_grid.size = n;
        const micro_grid = this.#body.querySelector('#macro-grid');
        this.#setAttributes(macro_grid, {width: n, height: n});
        const macro_path = macro_grid.querySelector('path');
        this.#setAttributes(macro_path, {d: `M ${n} 0 L 0 0 0 ${n}`});
    }

    get micro_color( ) {
        return this.#body.querySelector('#micro-grid path').getAttribute('stroke');
    }

    set micro_color(color) {
        this.#body.querySelector('#micro-grid path').setAttribute('color', color);
    }

    get macro_color( ) {
        return this.#body.querySelector('#macro-grid path').getAttribute('stroke');
    }

    set macro_color(color) {
        this.#body.querySelector('#macro-grid path').setAttribute('color', color);
    }

}

const createHTML = (namespace = "http://www.w3.org/2000/svg") => {
    return `
        <svg viewBox="0 0 350 150" xlmns="${namespace}" style="position: absolute; width: 100%, height: 100%">
            <defs>
                <pattern id ="micro-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(0, 0, 0, 0.4)" stroke-width="0.5"/>
                </pattern>
                <pattern id="macro-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <rect width="32" height="32" fill="url(#micro-grid)"/>
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(0, 0, 0, 0.8) stroke-width="1"/>
                </pattern>
            </defs>
            <rect width="100%" heigth="100%" fill="url(#macro-grid)"/>
        </svg>
        <canvas></canvas>
    `
}