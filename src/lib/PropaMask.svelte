<script>
  import { onMount } from "svelte";

  import { gsap } from "./gsap";
  import { makeId, processStyles, setAnimations } from "./utils";

  let {
    text = "",
    zIndex = 1,
    zWrapper = "auto",
    fontSize = undefined,
    font = undefined,
    overlayColor = undefined,
    overlayOpacity = 1,
    container = undefined,
    styles = undefined,
    letterSpacing = 0,
    x = "50%",
    y = "50%",
    animations = null,
    fillColor = "white",
    lineSpacing = undefined,
    id = makeId(),
    unit = "px",
    origin = "50% 50%",
    onScroll = null,
    alt = "",
    videoSrc = undefined,
    img = undefined,
    clipPath = false,
    timeline = null,
    maskBg = undefined,
    customMaskSvg = undefined,
  } = $props();

  /** @type {HTMLDivElement | undefined} */
  let mainElement;

  const tlAnimations = gsap.timeline();
  const lines = $derived.by(() => {
    return text ? text.trim().split(/\s*[\r\n]+\s*/g) : [];
  });
  const line1 = $derived(lines[0] ?? "");
  const restLines = $derived(lines.slice(1));
  const resolvedLineSpacing = $derived(
    lineSpacing ?? (Number.isFinite(fontSize) ? fontSize * 0.75 : 30),
  );
  const clipPathId = $derived(`propa-clip-${id}`);
  const maskId = $derived(`propa-mask-${id}`);
  const overlayId = $derived(`mask-overlay-${id}`);
  const totalVerticalOffset = $derived(
    (restLines.length * (typeof resolvedLineSpacing === "number" ? resolvedLineSpacing : parseInt(`${resolvedLineSpacing}`) || 0)) / 2
  );
  const viewBoxHeight = $derived(
    Math.max(
      (typeof fontSize === "number" ? fontSize : 260) * 1.1,
      180 +
        restLines.length *
          (typeof resolvedLineSpacing === "number"
            ? resolvedLineSpacing * 1.2
            : 72),
    ),
  );

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

  onMount(() => {
    return () => {
      tlAnimations.kill();
      timeline?.kill();

      if (mainElement) {
        gsap.set(mainElement, { clearProps: true });
      }
    };
  });
</script>

<div
  class="mask-wrapper"
  bind:this={mainElement}
  {id}
  style="
		--propamask-font-size: {isFinite(fontSize)
    ? fontSize + unit
    : fontSize || '40px'};
    --propamask-font : {font};
		--propamask-origin: {origin};
    --propamask-font-color: {overlayColor};
    --propamask-overlay-opacity: {overlayOpacity};
    --propamask-fill_color : {fillColor};
    --propamask-kerning : {letterSpacing};
    z-index : {zWrapper};
	"
>
  {#if videoSrc}
    <video autoplay playsinline muted loop preload="auto" poster={img}>
      <source src={videoSrc} />
    </video>
  {:else if img}
    <img src={img} {alt} />
  {:else}
    <div
      class="masked"
      style:clip-path={clipPath ? `url(#${clipPathId})` : undefined}
    >
      {@render maskBg?.()}
    </div>
  {/if}

  {#if clipPath}
    <svg
      class="svg-clip-mask"
      style="z-index:{zIndex};"
    >
      <defs>
        <clipPath id={clipPathId} class="propa-mask-clip">
          <text dominant-baseline="central" text-anchor="middle" {x} {y}><tspan dy={-totalVerticalOffset}>{line1}</tspan>{#each restLines as line}<tspan x={x} dy={resolvedLineSpacing}>{line}</tspan>{/each}</text>
        </clipPath>
      </defs>
    </svg>
  {:else}
    <svg
      style="
            z-index:{zIndex};
          "
      class="mask-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 1000 ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <mask id={maskId} x="0" y="0" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="100%" />
          {#if text}
            <text
              xml:space="default"
              class="text-svg"
              dominant-baseline="central"
              text-anchor="middle"
              {x}
              {y}
            ><tspan dy={-totalVerticalOffset}>{line1}</tspan>{#each restLines as line}<tspan x={x} dy={resolvedLineSpacing}>{line}</tspan>{/each}</text>
          {/if}
          {@render customMaskSvg?.()}
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        style={`-webkit-mask:url(#${maskId}); mask:url(#${maskId});`}
      />

      {#if text && overlayColor}
        <text
          xml:space="default"
          class="text-svg"
          dominant-baseline="central"
          text-anchor="middle"
          id={overlayId}
          {x}
          {y}
        ><tspan dy={-totalVerticalOffset}>{line1}</tspan>{#each restLines as line}<tspan x={x} dy={resolvedLineSpacing}>{line}</tspan>{/each}</text>
      {/if}
    </svg>
  {/if}
</div>

<style>
  .propa-mask-clip {
    transform-origin: center center;
  }

  .masked {
    clip-path: url(#propa-mask);
    position: absolute;
  }

  .mask-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    margin: 0 auto;
    z-index: 1;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 0;
    position: absolute;
    background: var(--propamask-fill_color);
  }
  .mask-wrapper video,
  .mask-wrapper img {
    width: 100%;
  }

  .mask-wrapper svg,
  .masked {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .mask-wrapper text {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: var(--propamask-kerning);
    font: var(--propamask-font);
    font-size: var(--propamask-font-size);
  }

  .mask-wrapper svg > rect {
    fill: var(--propamask-fill_color);
  }
  .mask-wrapper svg > defs > mask > rect {
    fill: white;
  }

  .mask-wrapper > svg [id^="mask-overlay-"] {
    fill: var(--propamask-font-color);
    opacity: var(--propamask-overlay-opacity);
  }
  /* 
.mask-wrapper:before, .mask-wrapper:after {
  content: "";
  position: absolute;
  top: 0;
  width: 10px;
  height: 100%;
  background-color: #fff;
}
.mask-wrapper:before {
  left: -9px;
}
.mask-wrapper:after {
  right: -5px;
} */
</style>
