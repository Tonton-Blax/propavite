<script>
    import { tick, onDestroy } from 'svelte'
    import { animatables } from './stores'
    import gsap from 'gsap';
    import ScrollTrigger from 'gsap/ScrollTrigger';

    $: $animatables, handleAnimations();

    let currentAnimations = new Map();
    let init;

    export let gsapConfig = {}
    export function getScrollables () { return scrollTrigger.getAll()}
    export function getAnimatables () { return gsap.globalTimeline }
    
    const handleAnimations = async () => {
        if (!init) {
            gsap.registerPlugin(ScrollTrigger);
            const { scrollTrigger, ...gsapRestConfig } = gsapConfig;
            ScrollTrigger.clearScrollMemory( ) ;
            ScrollTrigger.config({limitCallbacks: true, ...scrollTrigger });
            gsap.config({ force3D : true, ...gsapRestConfig });
            console.log(scrollTrigger, gsapRestConfig);
            await tick();
            init = true;
        }


        Object.keys($animatables).forEach(async(k,i) => {
            if (!$animatables[k] && currentAnimations.has(k)) {
                console.log('we need to destroy : ', currentAnimations.get(k))
            }

            if(!$animatables[k] || currentAnimations.has(k))
                return;

            if($animatables[k][0]) { // check if timeline
                let x = 1;
                const tl = gsap.timeline({scrollTrigger : {scrub : true, ...$animatables[k][0]}})
                do {
                    const { set, animType, from, to, time, target, ...rest } = $animatables[k][x]
                    set && gsap.set(target, set);
                    animType==='fromTo' || (from && to) ? 
                        tl.fromTo(target || $animatables[k][0].target, from, to, time)
                        : tl[!!from ? 'from' : 'to'](target || $animatables[k][0].target, rest, time)

                } while (++x in $animatables[k]);
                currentAnimations.set(k, tl)

            } else {
                const { set, target, isScroll, create , from, to, ...rest } = $animatables[k];

                set && gsap.set(target, set);

                if (create)
                    ScrollTrigger.create(create);
                
                if (rest)
                    currentAnimations.set(k, (from && to) ?  
                        gsap.fromTo(target, {...rest, ...from}, {...to, ...rest}) 
                        : gsap[!!from ? 'from' : 'to'](target, rest))
                
            }
            //ScrollTrigger.normalizeScroll(true) 
        })
    }


    onDestroy(()=>{
        $animatables = [];
        currentAnimations = new Map();
    });


/*
    var sections = gsap.utils.toArray(".section").forEach(function(elem) {

// select the relevant elements
var lines = elem.querySelectorAll(".lines");

var tl = gsap.timeline({
  scrollTrigger: {
    trigger: elem,
    pin:elem,
    scrub:0.5,
    start: "top top",
    end: '+=200%'
  },
})
.from(lines, {xPercent:-100,  duration:1, ease:'power2.out', stagger:0.6},0)
.to({}, {duration:1}) // a little pause at the end

})

*/

</script>
    
    <slot></slot>
