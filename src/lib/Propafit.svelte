<script>
  import { onMount, tick } from "svelte";

  import { gsap } from "./gsap";
  import { makeId, setAnimations } from "./utils";

  let {
    text = "PROPAGANDA\rIS\rAWESOME",
    fontSize = 10,
    bg = "unset",
    color = "white",
    animations = null,
    onScroll = null,
    fontFamily = "inherit",
    lineHeight = 1.2,
    id = makeId(),
    border = false,
    container = undefined,
    timeline = null,
    class: className = "",
  } = $props();

  let mainElement = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );

  const tlAnimations = gsap.timeline();
  const lines = $derived.by(() => {
    return Array.isArray(text)
      ? text.map((item) => item.text)
      : text.trim().split(/\s*[\r\n]+\s*/g);
  });
  const lineStyles = $derived.by(() => {
    if (!Array.isArray(text)) {
      return [];
    }

    return text.map((item) => {
      const { text: _text, ...rest } = item;
      return Object.entries(rest)
        .map(([key, value]) => `${key}:${value}`)
        .join(";");
    });
  });

  /**
   * @param {HTMLElement} el
   * @param {{ fontSize: number, line?: string }} options
   */
  function setPropagandaFontSize(el, options) {
    /** @param {{ fontSize: number, line?: string }} nextOptions */
    const apply = async (nextOptions) => {
      const { fontSize } = nextOptions;
      const parent = el.parentElement;

      if (!parent) {
        return;
      }

      el.style.fontSize = `${fontSize}px`;
      await tick();

      const { width: elementWidth, height: elementHeight } =
        el.getBoundingClientRect();
      const { width: parentWidth, height: parentHeight } =
        parent.getBoundingClientRect();
      const sizeH = (fontSize * parentHeight) / elementHeight;
      const sizeW = (fontSize * parentWidth) / elementWidth;

      el.style.fontSize = `${Math.min(sizeH, sizeW)}px`;
    };

    void apply(options);

    return {
      /** @param {{ fontSize: number, line?: string }} nextOptions */
      update(nextOptions) {
        void apply(nextOptions);
      },
    };
  }

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
  {id}
  class={["mainElement", className, { border }]}
  bind:this={mainElement}
  style="
		font-family:{fontFamily};
		--propanda-fit-font_size:{fontSize}; 
		--propanda-fit-bg:{bg}; 
		--propanda-fit-color:{color};
		--propanda-fit-line-height:{lineHeight}ch;
	"
>
  {#each lines as line, i (i)}
    <div
      class="propafit-line"
      use:setPropagandaFontSize={{ fontSize, line }}
      style="{lineStyles[i]};"
    >
      {line}
    </div>
  {/each}
</div>

<style>
  .propafit {
    display: block;
    background-color: var(--propanda-fit-bg);
    color: var(--propanda-fit-color);
    padding: 0px;
  }
  .propafit-line {
    display: table;
    margin: 0 auto;
    text-align: center;
    color: currentColor;
    font-size: var(--propanda-fit-font_size);
    line-height: var(--propanda-fit-line-height);
    padding: 0px;
  }
  .border {
    border: 1px solid red;
  }
</style>
