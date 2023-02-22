<script context="module">
    import gsap from 'gsap';
    import ScrollTrigger from 'gsap/ScrollTrigger';
    gsap.config({ force3D : false, nullTargetWarn: true });
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory( ) ;
    ScrollTrigger.config({limitCallbacks: true });
</script>

<script>
    import { onMount } from 'svelte';
    import { makeId, processStyles } from './utils';
    export let height = '100vh';
    export let width = '100%'
    export let hAlign = 'center';
    export let image = undefined;
    export let bgColor = "transparent";
    export let overflow = 'hidden';
    export let bgOpacity=1;
    export let id=makeId();
    export let alt = '';
    export let container = undefined;
    export let background = false;
    export let backgroundRepeat = 'no-repeat';
    export let backgroundPosition = 'center';
    export let backgroundSize = '100%';
    export let bgEl = undefined;
    export let gradient = null;
    export let zIndex = 0;
    export let aspectRatio = 16/9;
    export let style = undefined;
    export let styles = undefined;
    export let bgHeight = '100%';
    export let vAlign = 'center';
    export let pin = false;
    export let scrollConfig = {};
    export let timeline;
    export let progress = 0;
    export let visible = false;
    export let start;
    export let end;
    export let exposeProgress = false;

    let bgParent;

    const bgRepeatMap = { true : 'repeat', false : 'no-repeat' }

    $: processStyles(styles, container);
    //$: refresh(onScroll);

    onMount(async()=> {
        const scrollTrigger = {
            trigger: container,
            pin:    true,
            scrub : 2,
            start: "top top",
            end: end ?? '+=500%',
            onEnter: ({ isActive}) => visible = true,
            onEnterBack: ({ isActive}) => visible = isActive,
            onLeave: ({ isActive}) => visible = false,
            ...scrollConfig
        };
        if (exposeProgress)
            scrollTrigger.onUpdate = self => {progress = self && self?.progress };

        timeline = gsap.timeline( { scrollTrigger } );

        if (!bgHeight || bgHeight === 'unset')
            bgParent.style.aspectRatio = aspectRatio;

        //ScrollTrigger.normalizeScroll();

    });

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id={id} class="propaganda-wrapper"
    bind:this={container}
    class:proparent-gradient={!!gradient}
    style:justify-content={hAlign}
    style:align-items={vAlign};
    style:overflow={overflow}
    style:max-height={Number(height) ? height + 'vh' : height }
    style="
        --propa-grid_bgheight: {bgHeight};
        --propa-grid_apsect-ratio: {aspectRatio};
        --propa-wrapper-width : {width};
        --propa-wrapper-height : {height};
        --propa-gradient: {gradient};
        {style};
    "
    on:dblclick on:click on:contextmenu on:touchcancel on:touchstart on:touchend on:touchmove on:mouseenter on:mouseleave 
>
   
    <slot {container} {bgEl} {bgParent} {timeline} ></slot>

    <div class="propaganda-wrapper_image" bind:this={bgParent}
        style:z-index={zIndex}
        style="
            --proparent-bg :
                    url({background}) 
                    {typeof(backgroundRepeat)==='boolean' ? bgRepeatMap[backgroundRepeat] : backgroundRepeat} 
                    {backgroundPosition};
            --proparent-bg-size : {isFinite(backgroundSize) ? backgroundSize  + '%' : backgroundSize};
            opacity:{bgOpacity};
            background-color:{bgColor};"
    >
    {#if image}
        <img src={image} alt="{alt || "Propaganda is awesome"}" width="16" height="9" bind:this={bgEl} />
    {/if}
    </div>

</div>

<style>

.propaganda-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: fit-content;
    overflow:clip;
    position:relative;
    z-index: 0;
    width:var(--propa-wrapper-width);
    height:var(--propa-wrapper-height);
}
.proparent-gradient:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(var(--propa-gradient));
}

.propaganda-wrapper_image {
    z-index: 0;
    background : var(--proparent-bg);
    background-size: var(--proparent-bg-size);
    width: 100%; /* computed height will be 133.33px, which is width/aspect-ratio */
    height:var(--propa-grid_bgheight);
    transform: translateZ(0px);
    position: absolute;
    top:0;
}
img {
    width: auto;
    height: 100%;
    display:block;
}
@media (max-width: 768px) and (orientation: portrait) { 
  :global(.propaganda-wrapper_image) {
    height: 100vh;
  }
  :global(.propaganda-wrapper_image > img ) {
    height: 100vh;
    width: auto;
  }
 }
 :global(html) {
    font-size : calc( 16px + (24 - 16) * (100vw - 400px) / (800 - 400) );
 }

</style>
