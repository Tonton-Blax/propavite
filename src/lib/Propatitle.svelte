<script>
  import {setContext} from 'svelte';
  import {writable} from 'svelte/store';
  export let color = "white", bg = "black"
  export let title;
  export let kerning = 0;
  export let lineSpacing = 0;
  export let fontSize;
  export let echoesPerspective = 100;

  const ctx = writable({title})
  setContext('proptitleOptions', ctx);

  </script>
  
  <div on:click|self class="propaganda-wrapper" bind:this={$ctx.propagandaWrapper}
    style="color:{color};
    background:{bg}; 
    --propa-title_fontSize:{fontSize}vmin;
    --propa-title_kerning:{kerning}px;
    --propa-title_linespacing:{lineSpacing}px;
    --propa-title_perspective:{echoesPerspective}px;"
  >
    <slot />
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
      position:relative;
      overflow:clip;
      padding-right:5vw;
      }
  </style>