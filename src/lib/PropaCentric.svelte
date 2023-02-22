<script>
    import { setAnimations, processStyles, makeId } from './utils'
    import { onMount, tick, setContext } from 'svelte';
    import { centricCtxKey } from './stores'
    import gsap from 'gsap';

	export let text = '';
    export { className as class };
	export let radius = 110;
	export let startOffset = 0;
    export let styles = '';
	export let rotate = 0;
    export let zIndex = 1;
	export let textPadding = 0;
	export let bg = 'none';
	export let strokeWidth = null;
    export let strokeOpacity = 1;
    export let fontSize = 10;
    export let letterSpacing = 0;
    export let container = null;
	export let vx = 100;
    export let vy = 100;
    export let cx;
    export let cy;
    export let stroke = 'none';
    export let units = 'px';
    export let onScroll = null;
    export let animations = null;
    export let style = '';
    export let distort=[0,0];
    export let path;
    export let id = makeId();
    export let timeline;

    let mainElement;
    const tlAnimations = gsap.timeline();
    
    $: processStyles(styles, mainElement);
    $: _radius = radius /2;
    $: path =  `M ${cx || width/2 || 50 } ${cy || height/2 || 50 }
                m ${-_radius}, 0
                a ${_radius},${_radius+(distort[0]||0)} 0 1,1 ${_radius * 2},0
                a ${_radius},${_radius+(distort[1]||0)} 0 1,1 -${_radius * 2},0`;

    let className = '';
    let width, height;
    let pathEl;

    $: setContext( centricCtxKey, { 
        path, 
        pathId : `propa-centric-${id}`,
        units,
        radius
    });

    onMount (async()=>{
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
    <div class="centric-container" id="{id}" style="
            width:{width || 100}%; 
            height:{height || 100}%;
            z-index : {zIndex};
            {style};
        " 
        bind:this={mainElement} 
    >

        <svg class="flexed" id="centric-svg-{id}"
            style="--propa-textpath-rotate:{rotate}deg;"
            viewBox="{0} {0} {vx  || '100'} {vy || '100'}" 
            width="{((width || vx) * 0.95) + '%' || '100%'}" height="{((height || vy) * 0.95) + '%' || '100%'}">

                <path id="propa-centric-{id}" transform-origin="50%" bind:this={pathEl}
                    transform="rotate({rotate})"
                    fill="{bg}"
                    stroke={stroke}
                    stroke-width="{strokeWidth || (radius/50)}px"
                    stroke-opacity="{strokeOpacity}"
                    d="{path}"
                />


            {#if text}
                <text font-size="17" dy="-{textPadding}">
                    <textPath xlink:href="#propa-centric-{id}" class="{className}"
                        font-size="{fontSize/10}vmin" 
                        startOffset="{startOffset}%"
                        letter-spacing="{letterSpacing}px"
                    >
                        {text}
                    </textPath>
                </text>
            {/if}
        </svg>
        <slot></slot>
    </div>

<style>
    svg {
        overflow: visible;
        margin-left: auto;
        margin-top: auto;
    }
    div {
        z-index: 1;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
    }
	text {
		color:black;
		font-size:40px;
	}
	path {
		transform:rotate(var(--propa-textpath-rotate));
	}
</style>