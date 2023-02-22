import { writable } from 'svelte/store';
export let intersection = writable({});

export const centricCtxKey = Symbol();



const elementsFactory = initial => {
    const store = writable(initial);
    return {
      ...store,
      addOnScroll: (onScroll, parent, id, container) => {
        
        if (!Array.isArray(onScroll))
          onScroll = [onScroll];

        onScroll.forEach((o,i) => {

          let { target, onUpdate, onToggle, trigger, endTrigger, pinnedContainer, pin, start, markers, end, scrub, snap, ...rest } = o;
          const containerPin = container ? container.pinConfig : null

          if(!end)
            end = (containerPin && containerPin.end) 
              || (onScroll[0].create && onScroll[0].create.end) 
              || onScroll[0].end 
              || 'bottom bottom'

          if(!start)
            start = (containerPin && containerPin.start) 
              || (onScroll[0].create && onScroll[0].create.start) 
              || onScroll[0].start 
              || 'top top'

          if(!pin && !trigger) {
            trigger = parent;
          }
          if (onToggle || onUpdate) {
            rest.create = { pin, start, end, trigger, target, onUpdate, onToggle }
            pin = start = end = trigger = onUpdate = onToggle = null;
          }
          // if ((pinnedContainer === null || pinnedContainer === undefined) && !o[0] && containerPin && !pin )
          //   pinnedContainer = container;
             
          store.update(n => {
            n[`s_${id}_${i}`] = { 
              ...rest,
              target : !!pin ? target || container : target || parent.children,
              isScroll : true,
              scrollTrigger : {
                  scrub : scrub || true,
                  trigger, start, end, pin, end, snap, markers, endTrigger, pinnedContainer,
                  ...o.scrollTrigger
              }
            }
            return n;
          });
        })
      },
      addAnimation: (animation, parent, id) => {
        
        if (!Array.isArray(animation))
          animation = [animation];

          animation.forEach((o,i) => {
            let { target, trigger, endTrigger, ...rest } = o;
            store.update(n => {
              n[`p_${id}_${i}`] = { 
                repeat: -1,
                yoyo:true,
                ease : 'linear',
                target : target || parent.children,
                ...rest,
                isScroll : false,
              }
            return n;
          });
        })
      },
      removeAnimation: (id) => {
        store.update(n => delete n[id])
        return n;
      }
    };
  };
  
export  const animatables = elementsFactory({});

const centricSet = new Set()
export const centricChilds = writable(centricSet)