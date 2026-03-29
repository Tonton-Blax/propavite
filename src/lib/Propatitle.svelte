<script>
  import { setContext } from "svelte";

  import { createPropaTitleContext, propaTitleCtxKey } from "./state.svelte.js";

  let {
    color = "white",
    bg = "black",
    title = "",
    kerning = 0,
    lineSpacing = 0,
    fontSize = 10,
    echoesPerspective = 100,
    children,
  } = $props();

  let wrapper = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

  const ctx = createPropaTitleContext("");
  setContext(propaTitleCtxKey, ctx);

  $effect(() => {
    ctx.title = title;
    ctx.propagandaWrapper = wrapper ?? null;
  });
</script>

<div
  class="propaganda-wrapper"
  bind:this={wrapper}
  style="color:{color};
    background:{bg}; 
    --propa-title_fontSize:{fontSize}vmin;
    --propa-title_kerning:{kerning}px;
    --propa-title_linespacing:{lineSpacing}px;
    --propa-title_perspective:{echoesPerspective}px;"
>
  {@render children?.()}
</div>

<style>
  .propaganda-wrapper {
    color: white;
    background: black;
    display: flex;
    flex-flow: row wrap;
    flex: 1 1 100vmax;
    justify-content: flex-end;
    /* height: 100vh; */
    align-items: center;
    padding: 5vmin;
    position: relative;
    overflow: clip;
    padding-right: 5vw;
  }
</style>
