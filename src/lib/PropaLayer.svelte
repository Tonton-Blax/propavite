<script>
  import { onMount } from "svelte";

  import { gsap } from "./gsap";
  import { makeId, processStyles, setAnimations } from "./utils";

  let {
    zIndex = 3,
    margin = "0",
    width = "fit-content",
    height = "auto",
    styles = "",
    direction = "column",
    container = undefined,
    onScroll = undefined,
    headless = false,
    animations = null,
    id = makeId(),
    timeline = null,
    children = undefined,
  } = $props();

  let mainElement = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );

  const tlAnimations = gsap.timeline();

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

{#if headless}
  {@render children?.()}
{:else}
  <div
    class="pro-layer"
    {id}
    style="
                --propa-layer-width:{width};
                --propa-layer_direction:{direction};
                --propa-layer-height:{height};
                z-index:{zIndex || 0};
                margin:{margin};
            "
    bind:this={mainElement}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(:root) {
    --propa-grid_border: "none";
  }

  .pro-layer {
    display: flex;
    flex-wrap: wrap;
    flex-direction: var(--propa-layer_direction);
    justify-content: center;
    align-items: center;
    padding: 0;
    position: absolute;
    z-index: 1;
    width: var(--propa-layer-width);
    height: var(--propa-layer-height);
  }

  :global(.pro-layer > div) {
    display: flex;
    color: white;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: unset;
    overflow: visible;
    flex-basis: auto;
  }

  :global(.pro-layer div > img) {
    width: 100%;
    height: auto;
  }
  @media (min-width: 1024px) and (orientation: landscape) {
    :global(.pro-layer div, .pro-layer div) {
      align-content: center;
    }
  }

  @media (max-width: 1024px) {
    :global(.pro-layer div) {
      flex: auto;
    }
  }
</style>
