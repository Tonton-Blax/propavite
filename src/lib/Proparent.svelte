<script module>
  import { gsap, setupGsap } from "./gsap";
  setupGsap();
  gsap.config({ force3D: false, nullTargetWarn: true });
</script>

<script>
  import { makeId, processStyles } from "./utils";

  let bgParent = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

  let {
    height = "100vh",
    width = "100%",
    hAlign = "center",
    image = undefined,
    bgColor = "transparent",
    overflow = "hidden",
    bgOpacity = 1,
    id = makeId(),
    alt = "",
    container = $bindable(),
    background = false,
    backgroundRepeat = "no-repeat",
    backgroundPosition = "center",
    backgroundSize = "100%",
    bgEl = $bindable(),
    gradient = null,
    zIndex = 0,
    aspectRatio = 16 / 9,
    style = undefined,
    styles = undefined,
    bgHeight = "100%",
    vAlign = "center",
    pin = true,
    scrollConfig = {},
    timeline = $bindable(null),
    progress = $bindable(0),
    visible = $bindable(false),
    start = "top top",
    end = "+=500%",
    exposeProgress = false,
    children = undefined,
  } = $props();

  const bgRepeatMap = { true: "repeat", false: "no-repeat" };

  $effect(() => {
    processStyles(styles, container);
  });

  $effect(() => {
    if (!container) {
      return;
    }

    /** @type {any} */
    const scrollTrigger = {
      trigger: container,
      pin,
      scrub: 2,
      start,
      end,
      onEnter: () => {
        visible = true;
      },
      onEnterBack: (/** @type {{ isActive: boolean }} */ { isActive }) => {
        visible = isActive;
      },
      onLeave: () => {
        visible = false;
      },
      ...scrollConfig,
    };

    if (exposeProgress) {
      scrollTrigger.onUpdate = (/** @type {{ progress?: number }} */ self) => {
        progress = self?.progress ?? 0;
      };
    }

    const nextTimeline = gsap.timeline({ scrollTrigger });
    timeline = nextTimeline;

    if ((!bgHeight || bgHeight === "unset") && bgParent) {
      bgParent.style.aspectRatio = String(aspectRatio);
    }

    return () => {
      nextTimeline.kill();
      if (timeline === nextTimeline) {
        timeline = null;
      }
    };
  });
</script>

<div
  {id}
  class="propaganda-wrapper"
  bind:this={container}
  class:proparent-gradient={!!gradient}
  style:justify-content={hAlign}
  style:align-items="{vAlign};"
  style:overflow
  style:max-height={Number(height) ? height + "vh" : height}
  style="
        --propa-grid_bgheight: {bgHeight};
        --propa-grid_apsect-ratio: {aspectRatio};
        --propa-wrapper-width : {width};
        --propa-wrapper-height : {height};
        --propa-gradient: {gradient};
        {style};
    "
>
  {@render children?.({ container, bgEl, bgParent, timeline })}

  <div
    class="propaganda-wrapper_image"
    bind:this={bgParent}
    style:z-index={zIndex}
    style="
            --proparent-bg :
                    url({background}) 
                    {typeof backgroundRepeat === 'boolean'
      ? bgRepeatMap[backgroundRepeat]
      : backgroundRepeat} 
                    {backgroundPosition};
                  --proparent-bg-size : {typeof backgroundSize === 'number'
      ? backgroundSize + '%'
      : backgroundSize};
            opacity:{bgOpacity};
            background-color:{bgColor};"
  >
    {#if image}
      <img
        src={image}
        alt={alt || "Propaganda is awesome"}
        width="16"
        height="9"
        bind:this={bgEl}
      />
    {/if}
  </div>
</div>

<style>
  .propaganda-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: fit-content;
    overflow: clip;
    position: relative;
    z-index: 0;
    width: var(--propa-wrapper-width);
    height: var(--propa-wrapper-height);
  }
  .proparent-gradient:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(var(--propa-gradient));
  }

  .propaganda-wrapper_image {
    z-index: 0;
    background: var(--proparent-bg);
    background-size: var(--proparent-bg-size);
    width: 100%; /* computed height will be 133.33px, which is width/aspect-ratio */
    height: var(--propa-grid_bgheight);
    transform: translateZ(0px);
    position: absolute;
    top: 0;
  }
  img {
    width: auto;
    height: 100%;
    display: block;
  }
  @media (max-width: 768px) and (orientation: portrait) {
    :global(.propaganda-wrapper_image) {
      height: 100vh;
    }
    :global(.propaganda-wrapper_image > img) {
      height: 100vh;
      width: auto;
    }
  }
  :global(html) {
    font-size: calc(16px + (24 - 16) * (100vw - 400px) / (800 - 400));
  }
</style>
