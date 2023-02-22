<script>
	import { onMount, tick } from 'svelte'
  import gsap from 'gsap';
  import { setAnimations, processStyles, makeId } from './utils';

  export let text;
  export let zIndex = 1;
  export let zWrapper = 'auto';
  export let fontSize;
  export let font;
	export let overlayColor;
  export let overlayOpacity=1;
  export let container;
  export let styles;
  export let letterSpacing;
  export let x = '50%';
  export let y='50%';
  export let animations=null;
  export let fillColor="white";
  export let lineSpacing=10;
  export let id=makeId();
	export let unit = 'px';
	export let origin = "50% 50%";
  export let onScroll;
  export let alt='';
  export let videoSrc;
  export let img;
  export let clipPath = false;
  export let timeline;

  $: processStyles(styles, mainElement);
  $: if (text) [line1, ...restLines] = text.trim().split(/\s*[\r\n]+\s*/g);
  
  const tlAnimations = gsap.timeline();
  let line1, restLines;

  let mainElement;

    onMount(async()=>{
        await tick()
        setAnimations({ timeline, animations : onScroll, mainElement })
        setAnimations({ timeline : tlAnimations, animations, mainElement })
        
        return () => {
            tlAnimations.kill(true);
            timeline.kill(true);
            gsap.set(mainElement, {clearProps: true});
        }
    })
</script>

<div class="mask-wrapper" bind:this={mainElement} id={id} style="
		--propamask-font-size: {isFinite(fontSize) ? fontSize + unit : fontSize || '40px'};
    --propamask-font : {font};
		--propamask-origin: {origin};
    --propamask-font-color: {overlayColor};
    --propamask-overlay-opacity: {overlayOpacity};
    --propamask-fill_color : {fillColor};
    --propamask-kerning : {letterSpacing};
    z-index : {zWrapper};
	">
    {#if videoSrc}                                          
      <video autoplay playsinline muted loop preload poster={img}>
        <source src={videoSrc} />
      </video>
    {:else if img}
        <img src={img} {alt }>
    {:else}
      <div class="masked">
        <slot name="mask-bg"></slot>
      </div>
    {/if}
    
    {#if clipPath}
      <svg class="svg-clip-mask" style="z-index:{zIndex};">
        <clipPath id="propa-mask">
          <text dominant-baseline="central" text-anchor="middle" x={x} y={y} >
            {line1}
            {#each restLines as line}
              <tspan x="50%" dy={lineSpacing}>{line}</tspan>
            {/each}
          </text>
        </clipPath>
      </svg>
      
    {:else}

    <svg style="
            z-index:{zIndex};
          " 
        class="mask-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 80" preserveAspectRatio="xMidYMid slice">
        <defs>
        <mask id="mask" x="0" y="0" width="100%" height="100%" >
            <rect x="0" y="0" width="100%" height="100%" />
            {#if text}
            <text xml:space="default" class="text-svg" dominant-baseline="central" text-anchor="middle" x={x} y={y}>
              {line1}
              {#each restLines as line}
                <tspan x="50%" dy={lineSpacing}>{line}</tspan>
              {/each}
            </text>
            {/if}
            <slot name="custom-mask-svg"></slot>
        </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" />

        {#if text && overlayColor}
          <text xml:space="default" class="text-svg" dominant-baseline="central" text-anchor="middle" id="mask-overlay" x={x} y={y}>
            {line1}
            {#each restLines as line}
              <tspan x="50%" dy={lineSpacing}>{line}</tspan>
            {/each}
          </text>
        {/if}
    </svg>
    {/if}

</div>

<style>

.masked {
  clip-path: url(#propa-mask);
  position: absolute;
}
.mask-wrapper {
  width: 100%;
  display:flex;
  flex-wrap: nowrap;
  height:100%;
  margin: 0 auto;
  z-index: 1;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding : 0;
  position: absolute;
  background : var(--propamask-fill_color);
}
.mask-wrapper video, .mask-wrapper img {
  width: 100%;
}

.mask-wrapper svg, .masked {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: var(--propamask-kerning);
  font: var(--propamask-font);
  font-size: var(--propamask-font-size);
}
	
.mask-wrapper svg > rect {
  -webkit-mask: url(#mask);
  mask: url(#mask);
  fill: var(--propamask-fill_color);

}
.mask-wrapper svg > defs > mask > rect {
  fill :white;
}
	
.mask-wrapper > svg > #mask-overlay {
  fill : var(--propamask-font-color);
  opacity : var(--propamask-overlay-opacity);
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