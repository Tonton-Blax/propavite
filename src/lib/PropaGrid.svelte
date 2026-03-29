<script module>
  import { interpolate, totalArray } from "./utils.js";
  import * as easing from "svelte/easing";

  /** @typedef {keyof typeof easing | ((value: number) => number)} GridEasing */
  /**
   * @typedef {object} GridInterpolationOptions
   * @property {number} [dimension]
   * @property {boolean} [diffSizes]
   * @property {GridEasing} [eased]
   * @property {"center" | "end" | string} [from]
   */

  /**
   * @param {number} gridXorY
   * @param {GridInterpolationOptions} [options={}]
   */
  export const interpolateGrid = (gridXorY, options = {}) => {
    let { dimension = 100, diffSizes = false, eased, from } = options;

    const easedFn = !eased
      ? (/** @type {number} */ val) => val
      : typeof eased === "function"
        ? eased
        : easing[eased] || easing.backInOut;
    const array = Array(gridXorY)
      .fill(0)
      .map((_, i) => {
        if (!diffSizes) return (dimension || 100) / gridXorY;
        else {
          const x =
            from === "center" && i >= Math.floor(gridXorY / 2)
              ? gridXorY - 1 - i
              : i;
          return easedFn(gridXorY + x);
        }
      });

    const interpolation = (/** @type {number} */ a) =>
      interpolate(a, 0, totalArray(array), 0, dimension);
    let retVal = array.map((a) => interpolation(a));
    if (from === "end") retVal = retVal.slice().reverse();
    return retVal;
  };
</script>

<script>
  import { onMount } from "svelte";

  import { gsap } from "./gsap";
  import { makeId, processStyles, setAnimations } from "./utils";

  /**
   * @typedef {string | number | Array<number | string> | Record<number, number | string>} SizeInput
   * @typedef {(element: Element, line: number, column: number) => void} GridCallback
   * @typedef {{ step?: number, odd?: boolean } & Record<string, unknown>} GridStyles
   */

  let {
    zIndex = 1,
    aspectRatio = "auto",
    width = "100%",
    height = "100%",
    scale = 1,
    gap = "unset",
    fit = /** @type {false | "height" | "width"} */ (false),
    gridUnits = "fr",
    colSize = /** @type {SizeInput} */ (1),
    rowSize = /** @type {SizeInput} */ (1),
    fontSize = 6,
    grid = /** @type {[number, number]} */ ([7, 3]),
    cellOverflow = "visible",
    styles = /** @type {string | Record<string, unknown>} */ (""),
    oddCols = /** @type {Record<string, unknown> | null} */ (null),
    oddRows = /** @type {Record<string, unknown> | null} */ (null),
    id = makeId(),
    class: className = "",
    onScroll = /** @type {import('../app').PropaAnimationStep | import('../app').PropaAnimationStep[] | null} */ (
      null
    ),
    createClasses = false,
    animations = /** @type {import('../app').PropaAnimationStep | import('../app').PropaAnimationStep[] | null} */ (
      null
    ),
    container = null,
    timeline = null,
    background = "none",
    children = undefined,
  } = $props();

  let mainElement = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );

  const tlAnimations = gsap.timeline();
  const processedDimensions = $derived.by(() => {
    if (fit === "height" || fit === "width") {
      if (grid[0] > grid[1]) {
        return {
          col: Array(grid[0])
            .fill(`${100 / grid[0]}vmax`)
            .join(" "),
          row:
            fit === "height"
              ? Array(grid[1])
                  .fill(`${100 / grid[1]}vmin`)
                  .join(" ")
              : Array(grid[1])
                  .fill(`${100 / grid[0]}vmax`)
                  .join(" "),
        };
      }

      return {
        row: Array(grid[1])
          .fill(`${100 / grid[1]}vmin`)
          .join(" "),
        col:
          fit === "height"
            ? Array(grid[0])
                .fill(`${100 / grid[1]}vmin`)
                .join(" ")
            : Array(grid[0])
                .fill(`${100 / grid[0]}vmax`)
                .join(" "),
      };
    }

    return {
      col: processRowColsDimensions(
        colSize,
        Array(grid[0]).fill("1fr").join(" "),
      ),
      row: processRowColsDimensions(
        rowSize,
        Array(grid[1]).fill("1fr").join(" "),
      ),
    };
  });

  $effect(() => {
    processStyles(styles, mainElement);
  });

  $effect(() => {
    if (!mainElement) {
      return;
    }

    setAnimations({ timeline, animations: onScroll, mainElement });
  });

  $effect(() => {
    if (!mainElement) {
      return;
    }

    setAnimations({ timeline: tlAnimations, animations, mainElement });
  });

  $effect(() => {
    if (!mainElement) {
      return;
    }

    if (createClasses) {
      loopGrid((el, line, column) =>
        el.classList.add(`line-${line}`, `column-${column}`),
      );
    }

    if (oddRows) {
      processOddEvenRows(oddRows, true);
    }

    if (oddCols) {
      processOddEvenRows(oddCols, false);
    }
  });

  onMount(() => {
    return () => {
      tlAnimations.kill();
      timeline?.kill();

      if (mainElement) {
        gsap.set(mainElement, { clearProps: true });
      }
    };
  });

  /**
   * @param {GridCallback} cb
   * @param {[number, number]} [g=grid]
   * @param {HTMLCollection | Element[]} [els=mainElement?.children]
   */
  const loopGrid = (cb, g = grid, els = mainElement?.children) => {
    if (!els) {
      return;
    }

    const children = [...els];
    let x = 0;
    for (let l = 0; l < g[1]; l++) {
      for (let c = 0; c < g[0]; c++) {
        if (!children[x]) break;
        cb(children[x++], l, c);
      }
    }
  };

  /**
   * @param {GridStyles} gridStyles
   * @param {boolean} isLine
   */
  const processOddEvenRows = (gridStyles, isLine) => {
    const { step, odd, ...style } = gridStyles;
    loopGrid((el, l, c) => {
      if ((isLine ? l : c) % (step || 2) === (odd ? 0 : 1)) {
        processStyles(style, el);
      }
    });
  };

  /**
   * @param {SizeInput} colRowSize
   * @param {string} colRowString
   */
  const processRowColsDimensions = (colRowSize, colRowString) => {
    const colRowSplitted = colRowString.split(" ");
    if (Array.isArray(colRowSize)) {
      return colRowSize.map((c) => (Number(c) ? c + gridUnits : c)).join(" ");
    } else if (
      !fit &&
      typeof colRowSize === "number" &&
      !Number.isNaN(colRowSize)
    ) {
      return Array(colRowSplitted.length)
        .fill(`${colRowSize + gridUnits}`)
        .join(" ");
    } else if (typeof colRowSize === "object" && colRowSize !== null) {
      for (const k of Object.keys(colRowSize)) {
        const key = Number(k);
        const value = colRowSize[key];
        colRowSplitted[key] = Number(value) ? value + "fr " : String(value);
      }
      return colRowSplitted.join(" ");
    } else if (typeof colRowSize === "string") return colRowSize;
    else return colRowString;
  };
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
  class={["pro-grid", className, { "default-dimensions": !width || !height }]}
  {id}
  style="
                --propa-grid_height : {Number(height) ? height + '%' : height};
                --propa-grid_width : {Number(width) ? width + '%' : width};
                --propa-grid-gap : {gap};
                --propa-grid_rows : {processedDimensions.row};
                --propa-grid_columns : {processedDimensions.col};
                --propa-grid_fontsize : {Number(fontSize)
    ? fontSize + 'rem'
    : fontSize};
                --propa-cell_overflow : {cellOverflow};
                --propa-grid_bg : {background};
                aspect-ratio : {aspectRatio};
                z-index:{zIndex};
                transform:matrix({scale},0.00,0.00,{scale},0,0);
            "
  bind:this={mainElement}
>
  {@render children?.({ mainElement })}
</div>

<style>
  :global(:root) {
    --propa-grid_border: "none";
  }
  .pro-grid {
    display: grid;
    background: var(--propa-grid_bg);
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 0;
    position: absolute;
    z-index: 1;
    transform: translateZ(0);
    height: var(--propa-grid_height);
    width: var(--propa-grid_width);
    grid-gap: var(--propa-grid-gap);
    grid-template-rows: var(--propa-grid_rows);
    grid-template-columns: var(--propa-grid_columns);
  }

  .default-dimensions {
    width: 100%;
    height: 100%;
  }
  .pro-grid > :global(*) {
    /*position: absolute;*/
    box-sizing: border-box;
    border: var(--propa-grid_border);
    display: flex;
    aspect-ratio: 1;
    width: var(--propa-cell-width);
    justify-content: center;
    min-height: fit-content;
    align-items: center;
    font-size: var(--propa-grid_fontsize);
    align-content: unset;
    overflow: var(--propa-cell_overflow);
  }
</style>
