<script context="module">
    import { interpolate } from './utils.js'
    import * as easing from 'svelte/easing';

    export const interpolateGrid = (gridXorY, options = {}) => {
        let { dimension, diffSizes, eased, from } = options;

            eased = !eased 
            ? (val) => val 
            : easing[eased] || easing.backInOut

        const array = Array( gridXorY ).fill()
            .map((_,i) =>  {
                if (!diffSizes)
                  return (dimension || 100)/gridXorY
                else {
                    const x = 
                        (from === 'center') && i >= Math.floor(gridXorY/2) 
                        ? gridXorY - 1 - i 
                        : i;
                    return (eased( gridXorY +  x ))
                }
            });

        const interpolation = (a) => interpolate(a, 0, totalArray(array), 0, dimension);
        let retVal = array.map( a => interpolation(a) );
        if (from === 'end')
                retVal = retVal.slice().reverse()
        return retVal; 
    }
</script>


<script>
    import { onMount , tick } from 'svelte'
    import { processStyles, setAnimations, makeId, totalArray } from './utils';
    import gsap from 'gsap';


/** @type {number | string} */
    export let zIndex=1;

/** @type {number | string} - (defaults to 'auto') */
    export let aspectRatio = 'auto';

/** @type {number | string} - (defaults to '%' unit)
*   @example ```'auto'``` , ```100```, ```'90vmin'``` - unitless Numbers will default to 'fr' unit */
    export let width = '100%';

/** @type {number | string} - (defaults to '%' unit)
*   @example ```'auto'``` , ```100```, ```'90vmin'``` - unitless Numbers will default to 'fr' unit */
    export let height = '100%';

/** Sets grid global scale
 * @type {number} - between 0 and 1 */
export let scale = 1;

/** css string OR number OR array of two numbers (defaults to %)  
 * @type {string | number | array[number,number]}
 * @example ```"3px"``` or ```"3px 10px"``` to set both row AND column gaps
 * @example ```[3,10]``` (will result in '3% 10%')
*/
    export let gap = 'unset';

/** Sets initial columns and row template CSS so that grid fit viewport
 * Accepts a string, (either "height" or "width"), or a boolean to disable
* @type {false | string<'height'|'width'>} */
    export let fit = false;

/** Default grid CSS units, defaults to 'fr'
* @type {string} */
    export let gridUnits = 'fr';

/** Sets the grid column(s) size(s)
 * @type {number | number[] | string[] |  [number] : number|string } }
 * @example [1, '2fr', '30px'] - unitless Numbers will default to 'fr' unit
 * @example "2fr 10px" 
 * @example {3 : '10px', 5 : '10vw' } - will change columm 3 and 5 (other will be '1fr')
*/
    export let colSize = 1;

/** same as @property {colSize} but for rows, check ```colSize``` for details
 * @type {number | number[] | string[] | string | { [number] : number|string }}
*/
    export let rowSize = 1;
    export let fontSize = 6;

/** Sets number of [ columns, rows ] for the grid
 * @type {array[number,number]}
*/
    export let grid = [7, 3];

/** css overflow property shorthand for cells (grid items) */
    export let cellOverflow = 'visible';

/** Grid styling object. Allows either camelCase or 'kebak-case'
* @example  {marginLeft : '10px', 'margin-top' : '10vw' }
*/
    export let styles='';

/** odd Columns styling object. Allows either camelCase or 'kebak-case'.
 * Even (instead of odd) columns can be targeted by setting {odd : false }
 * Alternation may be ajusted with step property
 * @property {boolean} odd - targets odd
 * @property {number} step - ajusts the odd/even ratio
*  @example {marginLeft : '10px', 'margin-top' : '10vw', odd : false, step }
*/
    export let oddCols = null;

/** odd/even rows styling object. Allows either camelCase or 'kebak-case'.
 * Even (instead of odd) rows can be targeted by setting {odd : false }
 * Alternation ratio between odd/even may be ajusted with step property
 * @property {boolean} odd - targets odd
 * @property {number} step - ajusts the odd/even ratio
*  @example {marginLeft : '10px', 'margin-top' : '10vw', odd : false, step }
*/
    export let oddRows = null;
    export let id = makeId();
    export let className='';

/** Shorthand configuration Object for GSAP  + ScrollTrigger plugin
 *  animation properties and scrollTrigger properties are merged at the root level of the object
 *  @example { trigger : '.container', yPercent : 10, from : true }
 *  @property {HTMLElement | string} ```trigger``` - will default to the grid parentNode
 *  @property {HTMLElement | string} ```target``` will default to the grid children
 *  @property {boolean | object} ```from``` null by default, otherwise it will trigger a gsap.from() animation instead of a gsap.to() which is default behavior
*   @example { y : 0, opacity : 0.1, from : true }
 *  @property {boolean | object} ```to``` null by default. Configuration object may be passed to both ```from``` and ```to``` properties to trigger a {@link https://greensock.com/docs/v3/GSAP/gsap.fromTo()|gsap.fromTo()} animation 
 *  @example { from : { y : 0, opacity : 0.1 } , to : { opacity : 1 } }
 *  @property {object} ```create``` Configuration object may be passed to ```create``` to trigger a {@link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.create()|gsap.create()} custom animation
*/
    export let onScroll = null;
/** Sets two classes for each cell item (direct grid children) named "line-n" "column-n"
 * @type {boolean} - default is false
*/
    export let createClasses = false;
    export let animations = null;
    export let container = null;
    export let timeline = null;
    export let background = 'none';

    let mainElement;
    let _colSize = Array(grid[0]).fill('1fr').join(' ');
    let _rowSize = Array(grid[1]).fill('1fr').join(' ');
    
    $: processStyles(styles, mainElement);
    $: _colSize = processRowColsDimensions(colSize, _colSize);
    $: _rowSize = processRowColsDimensions(rowSize, _rowSize);
    $:setAnimations({ timeline, animations : onScroll, mainElement })
    $:setAnimations({ timeline : tlAnimations, animations, mainElement })

    
    const tlAnimations = gsap.timeline();
    
    onMount(async()=> {
        await tick();
        
        if (createClasses) {
            await tick(); 
            loopGrid( (el, l, c)=> el.classList.add(`line-${l}`,`column-${c}`) )
        }

        oddRows && processOddEvenRows(oddRows, true);
        oddCols && processOddEvenRows(oddCols, false);

        if (fit === 'height' || fit == 'width') {
            mainElement.style[fit] = '100%';
            if (grid[0] > grid[1]) {
                _colSize = Array(grid[0]).fill(`${100 / grid[0]}vmax`).join(' ');
                _rowSize = fit === 'height' 
                    ? Array(grid[1]).fill(`${100 / grid[1]}vmin`).join(' ')
                    : Array(grid[1]).fill(`${100 / grid[0]}vmax`).join(' ')
            } else {
                _rowSize = Array(grid[1]).fill(`${100 / grid[1]}vmin`).join(' ');
                _colSize = fit === 'height' 
                        ? Array(grid[0]).fill(`${100 / grid[1]}vmin`).join(' ')
                        : Array(grid[0]).fill(`${100 / grid[0]}vmax`).join(' ');
            }
        }

    });

    const loopGrid = (cb, g = grid, els = mainElement.children) => {
        const children = [...els];
        let x = 0;
        for (let l=0; l < g[1]; l++) {
            for (let c=0; c < g[0]; c++) {
                if (!children[x])
                    break
                cb(children[x++], l,c);
            }
        }
    }
    
    const processOddEvenRows = (gridStyles, isLine) => {
        const { step, odd, ...style } = gridStyles;
        loopGrid( (el, l, c)=>{
            if ( ( (isLine ? l : c) % (step || 2) ) === (odd ? 0 : 1)) {
                processStyles(style, el)
            }
        })
    }
    
    const processRowColsDimensions = (colRowSize, colRowString) => {
        const colRowSplitted = colRowString.split(' ');
        if (Array.isArray(colRowSize)) {
            return colRowSize.map(c => Number(c) ? c + gridUnits : c ).join(' ')
        } else if (!fit && !isNaN(colRowSize)) {
            return Array(colRowSplitted.length).fill(`${colRowSize + gridUnits}`).join(' ')
        } else if (colRowSize.constructor.name === "Object") {
            for (const k of Object.keys(colRowSize))
                colRowSplitted[k] = Number(colRowSize[k]) ? colRowSize[k] + 'fr ' : colRowSize[k];
            return colRowSplitted.join(' ');
        } else if (typeof colRowSize === 'string')
            return colRowSize;
        else return colRowString;
    }

    </script>

<!--

  @component
  Reactive smart grid /
  Minimum usage:
    ```tsx
  <PropGrid grid={[2,2]} >
    <div>this is a cell</div>
    <div>another cell</div>
    <div>thid cell</div>
    <div>fourth and last cell</div>
  </PropGrid>
  ```

-->

        <div 
            class="pro-grid {className}" id="{id}"
            class:default-dimensions={!width || !height}
            style="
                --propaganda-grid-height : { Number(height) ? height + '%' : height };
                --propaganda-grid-width : { Number(width) ? width + '%' : width };
                --propaganda-grid-gap : { gap };
                --propaganda-grid-rows : { _rowSize };
                --propaganda-grid-columns : { _colSize };
                --propaganda-grid-fontsize : { Number(fontSize) ? fontSize + 'rem' : fontSize };
                --propaganda-cell_overflow : { cellOverflow };
                --propaganda-grid-bg : { background };
                aspect-ratio : { aspectRatio };
                z-index:{ zIndex };
                transform:matrix({ scale },0.00,0.00,{ scale },0,0);
            "
            bind:this={mainElement}
        >   
            <slot {mainElement}></slot>
        </div>
       


    <style>

    :global(:root) {
        --pro-grid_border:"none";
    }
    .pro-grid {
        display: grid;
        background : var(--propaganda-grid-bg);
        justify-content: center;
        align-content: center;
        align-items: center;
        padding : 0;
        position: absolute;
        z-index: 1;
        transform : translateZ(0);
        height:var(--propaganda-grid-height); 
        width: var(--propaganda-grid-width); 
        grid-gap: var(--propaganda-grid-gap); 
        grid-template-rows: var(--propaganda-grid-rows); 
        grid-template-columns: var(--propaganda-grid-columns); 
    }

    .default-dimensions {
        width: 100%;
        height: 100%;    
    }
    .pro-grid > :global(*) {
      /*position: absolute;*/
      box-sizing: border-box;
      border: var(--pro-grid_border);
      display: flex;
      aspect-ratio: 1;
      justify-content: center;
      min-height: fit-content;
      align-items: center;
      font-size: var(--propaganda-grid-fontsize);
      align-content: unset;
      overflow: var(--propaganda-cell_overflow);
    }
   
    </style>