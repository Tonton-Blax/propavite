<script context="module">
    let init=false;
    let index = 0;
    function* localId() {
        while (true)
            yield index++;
    }
</script>
<script>
    import { centricCtxKey } from './stores'
    import { getContext, onMount, tick } from 'svelte';
    import gsap from 'gsap'
    import MotionPathPlugin from 'gsap/MotionPathPlugin';
    export let angle = 0;
    export let orient = true;
    export let offsetX = 0;
    export let transformOrigin = null;
    export let duration = 0;
    export let pathAlign = 0.5; 
    export let endAngle = null;
    export let loop=false;
    export let fontSize = 10;
    export let animation=true;
    export let ease = "power1.inOut"
    let mounted = false;
    $: if (mounted) angle, duration, animation, gsapAlign(animation)
    
    let id = localId().next().value;
    let childEl;
    export let width = 0, height = 0;
    const { path, pathId, radius, units } = getContext(centricCtxKey);

    onMount(async()=>{
        if (!init) {
            await tick();
            gsap.registerPlugin(MotionPathPlugin);
            init=true;
        }
        mounted = true;
        animation && gsapAlign(animation)
    })

    const gsapAlign = async (toOrSet) => {
        const { width, height } = document.querySelector(`#${pathId}`).getBoundingClientRect();
        const start = (angle/360)+0.00001 // hacky path to avoid rounded angle values merging like 0/180 ;
        const end = endAngle || ( start < 0 ? -0.75 +  start : 1 + start )
        gsap[toOrSet ? 'to' : 'set'](`#centric-child-${id}`, {
            motionPath: {
                path : `#${pathId}`,
                align: `#${pathId}`,
                alignOrigin : [0.5, pathAlign],
                offsetX : -(width/2) + offsetX,
                autoRotate: orient,
                start,
                end,
                ...(transformOrigin || {}),
            },
            duration,
            repeat : loop && typeof loop === 'boolean' ? 
                -1  
                : isFinite(loop) ? 
                loop 
                : 0,
            ease
        });
    }
</script>

<div id="centric-child-{id}" bind:this={childEl} 
    style="
        --centric-child_width:{width || (radius)}{units};
        --centric-child_height:{height || (radius)}{units};
        --centric-child_font-size:{fontSize || radius}{units}
    "
>
    <slot></slot>
</div>
    

<style>
 div {
    position:absolute;
 }
 div > :global(*) {
     width: var(--centric-child_width);
     height: var(--centric-child_height);
     font-size: var(--centric-child_font-size);
 }
</style>