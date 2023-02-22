
<script>
    import { createEventDispatcher, onMount, tick } from "svelte";
    import { setAnimations, processStyles, makeId } from "./utils";
    import gsap from 'gsap';
    export let title;
    export let styles;
    $: processStyles(styles, mainElement);
    $: lines = title.trim().split(/\s*[\r\n]+\s*/g);
    export let echoes;
    export let id = makeId()
    export let bg = "unset";
    export let hAlign = 'right';
    export let echoesDistance;
    export let zIndex = 1;
    export let angle = 120;
    export let perspective = 100;
    export let animations = null;
    export let scale = NaN;
    export let perspectiveOrigin = [null, null];
    
    export let options = {
        propaLetter : null,
        isoMetric : false,
        scaleAdjust : false,
        faceColor : "white",
        faceOutline : '1px',
        strokeOutline : '2px',
        outline : true,
        angle : 120,
        rotateX : 0,
        rotateY : 0,
        rotateZ : 0,
        transparency : 0,
        spreading : 'squared',
        color : "white", 
        kerning : 0,
        lineSpacing : 0,
        fontSize : 10,
    }
    export let onScroll = null;
    export const Mathx = {
        none : (i) => i,
        linear : (i) => i/2,
        expand : (i) => i - -Math.exp(i-(i/1.2)),
        squared : (i) => Math.sqrt(i),
        reversedLinear : (i) => title.length - i/2,
        reversedExpand : (i) => title.length - Math.exp(i-(i/1.2)),
        reversedSquared : (i) => title.length - Math.sqrt(i)
    };
    export let container;
    export let timeline;

    $: setAnimations({ timeline, animations : onScroll, mainElement })
    $: tlAnimations = setAnimations({ timeline : gsap.timeline(), animations, mainElement })

    const dispatch = createEventDispatcher()
    let mainElement;
    
    const flexAlignMap = { right : 'flex-end', center : 'center', left : 'flex-start' }
    
    const angleToIsoXY = (angle, d, sincos = 'sin') => Math[sincos](-angle * (Math.PI / 180)) * ( (d*Mathx[options.spreading](d)) * (echoesDistance/100) );

    onMount(async()=> {
        await tick();
        return () => {
            tlAnimations.kill(true);
            timeline.kill(true);
            gsap.set(mainElement, {clearProps: true});
        } 
    });

    function letterExtrude() {
        let shadow = ""
        for (let i = 1; i <= echoes; i++) {
            //shadow += `-${i}px ${i}px 0 #f00f0f, `
            shadow += `-${i}px ${i}px 0 hsl(20, 100%, ${100-(i * 5)}%), `
        }
        //Extrusion rigolote
        return shadow.slice(0, -2);;
    }

    options = {
        propaLetter : null,
        isoMetric : false,
        scaleAdjust : false,
        faceColor : "#ffffff",
        faceOutline : false,
        outline : true,
        rotateX : 0,
        rotateY : 0,
        rotateZ : 0,
        transparency : 0,
        spreading : 'linear',
        color : "white", 
        title,
        kerning : 0,
        lineSpacing : 0,
        fontSize : 10,
        ...options
    }
    // z echo z-index: {-10*(title.length-c)-(i+1)};
    // z face :  z-index:{10*(title.length-c)};

</script>

    <div id={id} bind:this={mainElement}
        class="propaganda-echoes_wrapper" 
        class:has-perspective={!options.isoMetric}
        style="
        --propa-echoes-mod-x: { perspectiveOrigin[0] || echoesDistance * Math.sin(angle * ( Math.PI / 180 )) }%;
        --propa-echoes-mod-y: { perspectiveOrigin[1] || 100 + (echoesDistance * Math.cos(angle * (Math.PI / 180)))}%;
        --propa-echoes_perspective: {perspective || 'unset'}ch;
        --propa-title_bg:{bg};
        --propa-title_halign:{flexAlignMap[hAlign]};
        --propa-title_fontSize:{options.fontSize}vmin;
        --propa-title_kerning:{options.kerning}px;
        --propa-title_linespacing:{options.lineSpacing}px;
        --propa-title_facecolor:{options.faceColor}; 
        --propa-title_facestroke:{options.faceOutline}; 
        --propa-title_echoesstroke:{options.strokeOutline}; 
        --propa-title_echoescolor:{options.color};
        color:{options.color};
        z-index:{zIndex};
        "
    >
    {#each lines as line, l}
    <div class="propaganda-flexrow">
        {#each [...line] as letter, c(c+letter)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="propaganda-letter"
                class:face-stroke={options.faceOutline}
                style:color={!options.faceOutline ? options.faceColor : 'current-color'}
                style="
                    transform:
                        translateZ(0px)
                        scale({scale * Mathx[options.spreading](c* 0.2)});
                "
                on:click={(event)=>dispatch('letterClick', {event, selectedIndex : c, selectedLetter : letter})}
            >
                {letter}

            {#if echoes}
                {#each { length : echoes } as _,i}
                    <span
                        class:echoes-stroke={options.outline}
                        style:font-size={options.fontSize*(Mathx[options.spreading](i+1))}
                        style:opacity={1 - ((options.transparency /100) * Mathx[options.spreading](i+1))}
                        style="
                            transform:
                            {options.isoMetric ? 
                                `translate(${angleToIsoXY(angle, (echoes-i), 'cos')}px, ${angleToIsoXY(angle, (echoes-i), 'sin')}px)` : 
                                `translateZ(${-0.5 * (echoesDistance) * Mathx[options.spreading]((i+1)+0.5)}px)` 
                            }
                            rotateX({options.rotateX*(Mathx[options.spreading](i+1))}deg)
                            rotateY({options.rotateY*(Mathx[options.spreading](i+1))}deg)
                            rotateZ({options.rotateZ*(Mathx[options.spreading](i+1))}deg)
                            scale({ options.scaleAdjust ? 1 -  (Mathx[options.spreading]((i) * (1/perspective))) : 1 })
                    "
                    >
                        {letter}
                    </span>
                {/each}
            {/if}
            </div>
        {/each}
    </div>
    {/each}
    </div>

  
<style>
    .propaganda-letter {
        font-size: var(--propa-title_fontSize);
        flex:1;
        margin:var(--propa-title_linespacing) var(--propa-title_kerning);
        z-index:0;
        position:relative;
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }
    .propaganda-letter > span {
        position: absolute;
        color:transparent;
        top:0px;
        left:0px;
        color:1px var(--propa-title_echoescolor);
    }
    .propaganda-letter.face-stroke {
        -webkit-text-stroke-color:var(--propa-title_facecolor);
        -webkit-text-stroke-width:var(--propa-title_facestroke);
        color:transparent;
    }
    .propaganda-letter > span.echoes-stroke {
        -webkit-text-stroke-color: var(--propa-title_echoescolor);
        -webkit-text-stroke-width: var(--propa-title_echoesstroke);
        color:transparent;
    }
    .propaganda-flexrow {
        display: flex;
        width: fit-content;
        transform-style: preserve-3d;
        transform:translateZ(0);
    }
    .propaganda-echoes_wrapper {
        color: white;
        display: flex;
        align-items: var(--propa-title_halign);
        padding: 5vmin;
        overflow: visible;
        flex-direction: column;
        background : var(--propa-title_bg);
        width:fit-content;
        position: absolute;
        z-index: 1;
    }
    .has-perspective {
        perspective-origin: var(--propa-echoes-mod-x) var(--propa-echoes-mod-y);
        perspective: var(--propa-echoes_perspective);
    }

      
</style>
  