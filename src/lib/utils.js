import gsap from "gsap";
"use strict";

Array.prototype.propagandaShuffle = function() {
    let m = this.length, i;
    while (m) {
      i = (Math.random() * m--) >>> 0;
      [this[m], this[i]] = [this[i], this[m]]
    }
    return this;
}

export const sleep = (ms = 100) => new Promise(r => setTimeout(r, ms));

export function totalArray(arr) { // cause Array#reduce is slow
  let totalNumber = 0, i=-1;
  while (++i < arr.length) 
      totalNumber+=arr[i];
  return totalNumber;
}

export const interpolate = function (value, s1, s2, t1, t2, slope) {
    slope = slope || 0.5;

    if(value < Math.min(s1, s2)) {
        return Math.min(s1, s2) === s1 ? t1 : t2;
    }

    if(value > Math.max(s1, s2)) {
        return Math.max(s1, s2) === s1 ? t1 : t2;
    }

    value = s2-value;

    const C1 = {x: s1, y:t1};
    const C3 = {x: s2, y:t2}; 
    const C2 = {
        x: C3.x,
        y: C1.y + Math.abs(slope) * (C3.y - C1.y)
    };

    const percent = value / (C3.x-C1.x);
    return C1.y*b1(percent) + C2.y*b2(percent) + C3.y*b3(percent);

    function b1(t) { return t*t }
    function b2(t) { return 2*t*(1 - t)  }
    function b3(t) { return (1 - t)*(1 - t) }
};


export const generateProbables = (opt, smooth, shuffle = false) => {
	let results = []
	for (const k of Object.keys(opt)) {
		if (!Array.isArray(opt[k])) 
					results = [...results, +opt[k]]
		else {
			opt[k].forEach((val) => {
				for (let x = k; x > 0; x--)
					results = [...results, Array.isArray(val) ? (Math.random()* +val[1]) + +val[0] : +val]
			})
		}
	}
  if (smooth && isFinite(smooth)) 
    results = smoothArray(smooth, results);
	return shuffle ? results.propagandaShuffle() : results.sort((a,b)=>a-b);
}

export const smoothArray = (constant, array, callback = obj => obj) => {
  return array.map((_element, index) => {
    let [start, end] = [Math.max(index - constant, 0), index].sort((a, b) => a - b),
        subArray = array.slice(start, end + 1);
    return subArray.reduce((acc, nr) => acc + callback(nr), 0) / subArray.length;
  });
};

export function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export const processStyles = (s, el) => {
  if (!s || !el) return;
  gsap.set(el, s);
  // const _styles = ParseTransformableCSSProperties(s);
  // _styles && Object.keys(_styles).forEach(style => {
  //     el.style[style] = s[style];
  // })
}

export const setAnimations = ({ timeline, animations, mainElement }) => {
  
  if (!timeline || !animations || !mainElement)
    return;

  timeline.clear();

  if (!Array.isArray(animations))
    animations = [animations];

  let lastTarget ;

  animations.forEach((anim, i)=>{
      let { target, time, label, set, from, to, ...options } = anim;
      if(!timeline.scrollTrigger)
        options = { repeat: -1, yoyo:true, ease : 'linear', ...options }

      set && target && gsap.set(target, set);
      const fromTo = anim?.animType || 'to';

      fromTo == 'fromTo' ?
        timeline.fromTo(target || lastTarget || mainElement.children, {...options, ...from }, to, time || '>')
        :timeline[fromTo](target || lastTarget || mainElement.children, options, time || '>');

      lastTarget = target || lastTarget;
      if(label)
        timeline.addLabel(label, "<");
    })
    return timeline;
}

export function makeId() {
  const crypto = window.crypto || window.msCrypto;
  let array = new Uint32Array(2);
  return crypto ? crypto.getRandomValues(array).join('-') : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16));
};

export const signedRandom = (n) => ( [-n,n][Math.random()*2|0] ) * Math.random();
export const rangeRandom = (min, max) => Math.random() * (max - min) + min;
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//const getParent = (el) => Promise.resolve(Object.prototype.toString.call(el)==="[object HTMLCollection]" ? el[0].parentNode : null);
