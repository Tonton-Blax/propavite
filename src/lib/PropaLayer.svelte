<script>
    import { onMount, tick } from 'svelte'
    import { setAnimations, makeId, processStyles } from './utils'
    export let zIndex=3;
    export let margin="0";
    export let width = "fit-content";
    export let height = "auto";
    export let styles = '';
    export let direction = 'column'
    export let container = undefined;
    export let onScroll = undefined;
    export let headless = false;
    export let animations = null;
    export let id = makeId();
    export let timeline;
    import gsap from 'gsap';

    let mainElement;
    $: processStyles(styles, mainElement);

    const tlAnimations = gsap.timeline();

    onMount(async()=>{

        await tick();
        
        setAnimations({ timeline, animations : onScroll, mainElement })
        setAnimations({ timeline : tlAnimations, animations, mainElement })
        
        return () => {
            tlAnimations.kill(true);
            timeline.kill(true);
            gsap.set(mainElement, {clearProps: true});
        } 

    })


    </script>

    {#if headless}

        <slot></slot>
    
    {:else}
    
        <div
            class="pro-layer" id={id}
            style="
                --pro-layer-width:{width};
                --propa-layer_direction:{direction};
                --pro-layer-height:{height};
                z-index:{zIndex || 0 };
                margin:{margin};
            "
            bind:this={mainElement}
        >

            <slot></slot>
    
        </div>
    
    {/if}

    <style>
    
    :global(:root) {
        --pro-grid_border:"none";
    }
    
    .pro-layer {
        display: flex;
        flex-wrap: wrap;
        flex-direction:var(--propa-layer_direction);
        justify-content: center;
        align-items: center;
        padding : 0;
        position: absolute;
        z-index: 1;
        width:var(--pro-layer-width);
        height:var(--pro-layer-height);
    }
    
    
    :global(.pro-layer > div) {
        display:flex;
        color:white;
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
        flex:auto
      }
     }
    
    </style>
    