<script>
  import { onMount } from "svelte";

  import { gsap } from "./gsap";
  import { makeId, processStyles, setAnimations } from "./utils";

  /** @type {import("../app").PropaEchoOptions} */
  const defaultOptions = {
    propaLetter: null,
    isoMetric: false,
    scaleAdjust: false,
    faceColor: "#ffffff",
    faceOutline: false,
    strokeOutline: "2px",
    outline: true,
    angle: 120,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    transparency: 0,
    spreading: "linear",
    color: "white",
    kerning: 0,
    lineSpacing: 0,
    fontSize: 10,
  };

  let {
    title = "",
    styles = undefined,
    echoes = 0,
    id = makeId(),
    bg = "unset",
    hAlign = "right",
    echoesDistance = 0,
    zIndex = 1,
    angle = 120,
    perspective = 100,
    animations = null,
    scale = 1,
    perspectiveOrigin = /** @type {[number | null, number | null]} */ ([
      null,
      null,
    ]),
    options = defaultOptions,
    onScroll = null,
    container = undefined,
    timeline = null,
    onLetterClick = null,
  } = $props();

  /** @type {Record<string, (i: number, textLength: number) => number>} */
  const Mathx = {
    none: (i) => i,
    linear: (i) => i / 2,
    expand: (i) => i - -Math.exp(i - i / 1.2),
    squared: (i) => Math.sqrt(i),
    reversedLinear: (i, textLength) => textLength - i / 2,
    reversedExpand: (i, textLength) => textLength - Math.exp(i - i / 1.2),
    reversedSquared: (i, textLength) => textLength - Math.sqrt(i),
  };

  let mainElement = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );

  const tlAnimations = gsap.timeline();
  const lines = $derived(title.trim().split(/\s*[\r\n]+\s*/g));
  const resolvedOptions = $derived({
    ...defaultOptions,
    ...options,
    title,
  });
  /** @type {Record<string, string>} */
  const flexAlignMap = {
    right: "flex-end",
    center: "center",
    left: "flex-start",
  };

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

  /** @param {number} distance */
  const spreadValue = (distance) => {
    const spreadMode = resolvedOptions.spreading ?? "linear";
    const handler = Mathx[spreadMode] || Mathx.linear;
    return handler(distance, title.length);
  };

  /**
   * @param {number} angleValue
   * @param {number} distance
   * @param {"sin" | "cos"} [sincos="sin"]
   */
  const angleToIsoXY = (angleValue, distance, sincos = "sin") => {
    return (
      Math[sincos](-angleValue * (Math.PI / 180)) *
      (distance * spreadValue(distance) * (echoesDistance / 100))
    );
  };

  onMount(() => {
    return () => {
      tlAnimations.kill();
      timeline?.kill();

      if (mainElement) {
        gsap.set(mainElement, { clearProps: true });
      }
    };
  });
  // z echo z-index: {-10*(title.length-c)-(i+1)};
  // z face :  z-index:{10*(title.length-c)};
</script>

<div
  {id}
  bind:this={mainElement}
  class={[
    "propaganda-echoes_wrapper",
    { "has-perspective": !resolvedOptions.isoMetric },
  ]}
  style="
        --propa-echoes-mod-x: {perspectiveOrigin[0] ||
    echoesDistance * Math.sin(angle * (Math.PI / 180))}%;
        --propa-echoes-mod-y: {perspectiveOrigin[1] ||
    100 + echoesDistance * Math.cos(angle * (Math.PI / 180))}%;
        --propa-echoes_perspective: {perspective || 'unset'}ch;
        --propa-title_bg:{bg};
        --propa-title_halign:{flexAlignMap[hAlign] ?? flexAlignMap.right};
        --propa-title_fontSize:{resolvedOptions.fontSize ?? 10}vmin;
        --propa-title_kerning:{resolvedOptions.kerning ?? 0}px;
        --propa-title_linespacing:{resolvedOptions.lineSpacing ?? 0}px;
        --propa-title_facecolor:{resolvedOptions.faceColor}; 
        --propa-title_facestroke:{resolvedOptions.faceOutline}; 
        --propa-title_echoesstroke:{resolvedOptions.strokeOutline}; 
        --propa-title_echoescolor:{resolvedOptions.color};
        color:{resolvedOptions.color};
        z-index:{zIndex};
        "
>
  {#each lines as line, l (`${l}-${line}`)}
    <div class="propaganda-flexrow">
      {#each [...line] as letter, c (c + letter)}
        <button
          type="button"
          class={[
            "propaganda-letter",
            { "face-stroke": resolvedOptions.faceOutline },
          ]}
          disabled={!onLetterClick}
          style:color={!resolvedOptions.faceOutline
            ? resolvedOptions.faceColor
            : "current-color"}
          style="
                    transform:
                        translateZ(0px)
                        scale({scale});
                "
          onclick={(event) =>
            onLetterClick?.({
              event,
              selectedIndex: c,
              selectedLetter: letter,
            })}
        >
          {letter}

          {#if echoes}
            {#each { length: echoes } as _, i (i)}
              <span
                class={{ "echoes-stroke": resolvedOptions.outline }}
                style:font-size={(resolvedOptions.fontSize ?? 10) *
                  spreadValue(i + 1)}
                style:opacity={1 -
                  ((resolvedOptions.transparency ?? 0) / 100) *
                    spreadValue(i + 1)}
                style="
                            transform:
                            {resolvedOptions.isoMetric
                  ? `translate(${angleToIsoXY(angle, echoes - i, 'cos')}px, ${angleToIsoXY(angle, echoes - i, 'sin')}px)`
                  : `translateZ(${-0.5 * echoesDistance * spreadValue(i + 1 + 0.5)}px)`}
                            rotateX({(resolvedOptions.rotateX ?? 0) *
                  spreadValue(i + 1)}deg)
                            rotateY({(resolvedOptions.rotateY ?? 0) *
                  spreadValue(i + 1)}deg)
                            rotateZ({(resolvedOptions.rotateZ ?? 0) *
                  spreadValue(i + 1)}deg)
                            scale({resolvedOptions.scaleAdjust
                  ? 1 - spreadValue(i * (1 / perspective))
                  : 1})
                    "
              >
                {letter}
              </span>
            {/each}
          {/if}
        </button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .propaganda-letter {
    font-size: var(--propa-title_fontSize) !important;
    flex: 1;
    margin: var(--propa-title_linespacing) var(--propa-title_kerning);
    z-index: 0;
    position: relative;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    border: 0;
    background: transparent;
    padding: 0;
    font: inherit;
  }
  .propaganda-letter:disabled {
    opacity: 1;
  }
  .propaganda-letter > span {
    position: absolute;
    color: transparent;
    top: 0px;
    left: 0px;
    color: 1px var(--propa-title_echoescolor);
  }
  .propaganda-letter.face-stroke {
    -webkit-text-stroke-color: var(--propa-title_facecolor);
    -webkit-text-stroke-width: var(--propa-title_facestroke);
    color: transparent;
  }
  .propaganda-letter > span.echoes-stroke {
    -webkit-text-stroke-color: var(--propa-title_echoescolor);
    -webkit-text-stroke-width: var(--propa-title_echoesstroke);
    color: transparent;
  }
  .propaganda-flexrow {
    display: flex;
    width: fit-content;
    transform-style: preserve-3d;
    transform: translateZ(0);
  }
  .propaganda-echoes_wrapper {
    color: white;
    display: flex;
    align-items: var(--propa-title_halign);
    padding: 5vmin;
    overflow: visible;
    flex-direction: column;
    background: var(--propa-title_bg);
    width: fit-content;
    position: absolute;
    z-index: 1;
  }
  .has-perspective {
    perspective-origin: var(--propa-echoes-mod-x) var(--propa-echoes-mod-y);
    perspective: var(--propa-echoes_perspective);
  }
</style>
