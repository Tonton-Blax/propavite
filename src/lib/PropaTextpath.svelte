<script>
  import { makeId } from "./utils";

  let {
    text = "PROPAGANDA\rIS\rAWESOME",
    textPath = {},
    class: className = "",
  } = $props();

  const defaults = {
    path: "circle",
    radius: 110,
    startOffset: 0,
    rotate: 0,
    textPadding: 0,
    bg: "none",
    stroke: "none",
    strokeWidth: "none",
    fontSize: 40,
    letterSpacing: 0,
  };
  const adjust = 4;
  const svgScale = 1.5;
  const id = makeId();
  const pathId = $derived(`propa-textpath-${id}`);
  const options = $derived({ ...defaults, ...textPath });
</script>

{#if options.path}
  <svg
    style="--propa-textpath-rotate:{options.rotate}deg;"
    viewBox="0 0 {options.radius * adjust} {options.radius * adjust}"
    width={options.radius * svgScale}
    height={options.radius * svgScale}
  >
    {#if options.path === "circle" && options.radius}
      <path
        id={pathId}
        transform-origin="50%"
        transform="rotate({options.rotate})"
        fill={options.bg}
        stroke={options.stroke}
        d="
                M {options.radius * 2}, {options.radius * 2}
                m {-options.radius}, 0
                a {options.radius},{options.radius} 0 1,1 {options.radius * 2},0
                a {options.radius},{options.radius} 0 1,1 -{options.radius *
          2},0
            "
      />
    {:else}
      <path id={pathId} d={options.path} />
    {/if}

    <text font-size="17" dy="-{options.textPadding}">
      <textPath
        href={`#${pathId}`}
        class={className}
        font-size="{options.fontSize / 10}vmin"
        startOffset="{options.startOffset}%"
        letter-spacing={options.letterSpacing}
      >
        {text}
      </textPath>
    </text>
  </svg>
{/if}

<style>
  text {
    color: black;
    font-size: 40px;
  }
  path {
    transform-origin: "50%";
    transform: rotate(var(--propa-textpath-rotate));
  }
</style>
