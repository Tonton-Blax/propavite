<script module>
  let index = 0;
  function* localId() {
    while (true) yield index++;
  }
</script>

<script>
  import { getContext, onMount } from "svelte";

  import { gsap, setupGsap } from "./gsap";
  import { centricCtxKey } from "./state.svelte.js";

  let {
    angle = 0,
    orient = true,
    offsetX = 0,
    transformOrigin = null,
    duration = 0,
    pathAlign = 0.5,
    endAngle = null,
    loop = false,
    fontSize = 10,
    animation = true,
    ease = "power1.inOut",
    width = 0,
    height = 0,
    children = undefined,
  } = $props();

  const id = localId().next().value;
  const centricContext = getContext(centricCtxKey);
  const childRadius = $derived(centricContext?.radius ?? 0);
  const childUnits = $derived(centricContext?.units ?? "px");

  /** @type {HTMLDivElement | undefined} */
  let childEl;
  let pathWidth = $state(0);

  setupGsap();

  function refreshPathMetrics() {
    const bounds = centricContext?.pathElement?.getBBox();

    if (bounds) {
      pathWidth = bounds.width;
    }
  }

  $effect(() => {
    centricContext?.path;
    centricContext?.pathElement;
    refreshPathMetrics();
  });

  $effect(() => {
    if (!childEl || !centricContext?.pathId) {
      return;
    }

    refreshPathMetrics();
    const start = angle / 360 + 0.00001;
    const end = endAngle ?? (start < 0 ? start - 0.75 : 1 + start);
    const motionPath = {
      path: `#${centricContext.pathId}`,
      align: `#${centricContext.pathId}`,
      alignOrigin: [0.5, pathAlign],
      offsetX: -(pathWidth / 2) + offsetX,
      autoRotate: orient,
      start,
      end,
      ...(transformOrigin || {}),
    };

    if (animation) {
      gsap.to(childEl, {
        motionPath,
        duration,
        repeat: loop === true ? -1 : typeof loop === "number" ? loop : 0,
        ease,
      });
    } else {
      gsap.set(childEl, { motionPath });
    }

    return () => {
      if (childEl) {
        gsap.killTweensOf(childEl);
      }
    };
  });

  onMount(() => {
    refreshPathMetrics();
  });
</script>

<div
  id="centric-child-{id}"
  bind:this={childEl}
  style="
      --centric-child_width:{width || childRadius}{childUnits};
      --centric-child_height:{height || childRadius}{childUnits};
      --centric-child_font-size:{fontSize || childRadius}{childUnits}
    "
>
  {@render children?.()}
</div>

<style>
  div {
    position: absolute;
  }
  div > :global(*) {
    width: var(--centric-child_width);
    height: var(--centric-child_height);
    font-size: var(--centric-child_font-size);
  }
</style>
