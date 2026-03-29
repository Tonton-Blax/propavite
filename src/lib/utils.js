/** @import { PropaAnimationStep } from "../app" */

import gsap from "gsap";
("use strict");

Array.prototype.propagandaShuffle = function () {
  /** @type {unknown[]} */
  const array = this;
  let m = array.length,
    i;
  while (m) {
    i = (Math.random() * m--) >>> 0;
    [array[m], array[i]] = [array[i], array[m]];
  }
  return array;
};

/** @param {number} [ms=100] */
export const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));

/** @param {number[]} arr */
export function totalArray(arr) {
  // cause Array#reduce is slow
  let totalNumber = 0,
    i = -1;
  while (++i < arr.length) totalNumber += arr[i];
  return totalNumber;
}

/**
 * @param {number} value
 * @param {number} s1
 * @param {number} s2
 * @param {number} t1
 * @param {number} t2
 * @param {number} [slope]
 */
export const interpolate = function (value, s1, s2, t1, t2, slope) {
  slope = slope || 0.5;

  if (value < Math.min(s1, s2)) {
    return Math.min(s1, s2) === s1 ? t1 : t2;
  }

  if (value > Math.max(s1, s2)) {
    return Math.max(s1, s2) === s1 ? t1 : t2;
  }

  value = s2 - value;

  const C1 = { x: s1, y: t1 };
  const C3 = { x: s2, y: t2 };
  const C2 = {
    x: C3.x,
    y: C1.y + Math.abs(slope) * (C3.y - C1.y),
  };

  const percent = value / (C3.x - C1.x);
  return C1.y * b1(percent) + C2.y * b2(percent) + C3.y * b3(percent);

  /** @param {number} t */
  function b1(t) {
    return t * t;
  }
  /** @param {number} t */
  function b2(t) {
    return 2 * t * (1 - t);
  }
  /** @param {number} t */
  function b3(t) {
    return (1 - t) * (1 - t);
  }
};

/**
 * @param {Record<string, number | Array<number | [number, number]>>} opt
 * @param {number} smooth
 * @param {boolean} [shuffle=false]
 */
export const generateProbables = (opt, smooth, shuffle = false) => {
  /** @type {number[]} */
  let results = [];
  for (const k of Object.keys(opt)) {
    if (!Array.isArray(opt[k])) results = [...results, +opt[k]];
    else {
      opt[k].forEach((val) => {
        for (let x = Number(k); x > 0; x--)
          results = [
            ...results,
            Array.isArray(val) ? Math.random() * +val[1] + +val[0] : +val,
          ];
      });
    }
  }
  if (smooth && isFinite(smooth)) results = smoothArray(smooth, results);
  return shuffle ? results.propagandaShuffle() : results.sort((a, b) => a - b);
};

/**
 * @param {number} constant
 * @param {number[]} array
 * @param {(value: number) => number} [callback]
 */
export const smoothArray = (constant, array, callback = (obj) => obj) => {
  return array.map((_element, index) => {
    let [start, end] = [Math.max(index - constant, 0), index].sort(
        (a, b) => a - b,
      ),
      subArray = array.slice(start, end + 1);
    return (
      subArray.reduce((acc, nr) => acc + callback(nr), 0) / subArray.length
    );
  });
};

/**
 * @template {unknown[]} TArgs
 * @param {(...args: TArgs) => void} func
 * @param {number} [timeout=300]
 * @returns {(...args: TArgs) => void}
 */
export function debounce(func, timeout = 300) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  return (...args) => {
    if (!timer) {
      func(...args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

/**
 * @param {string | Record<string, unknown> | null | undefined} s
 * @param {Element | null | undefined} el
 */
export const processStyles = (s, el) => {
  if (!s || !el) return;
  gsap.set(el, /** @type {any} */ (s));
  // const _styles = ParseTransformableCSSProperties(s);
  // _styles && Object.keys(_styles).forEach(style => {
  //     el.style[style] = s[style];
  // })
};

/**
 * @param {{
 *  timeline: any,
 *  animations: PropaAnimationStep | PropaAnimationStep[] | null | undefined,
 *  mainElement: Element & { children?: HTMLCollection }
 * }} params
 */
export const setAnimations = ({ timeline, animations, mainElement }) => {
  if (!timeline || !animations || !mainElement) return;

  timeline.clear();

  if (!Array.isArray(animations)) animations = [animations];

  /** @type {any} */
  let lastTarget;

  animations.forEach((anim, i) => {
    let { target, time, label, set, from, to, ...options } = anim;
    if (!timeline.scrollTrigger)
      options = { repeat: -1, yoyo: true, ease: "linear", ...options };

    set && target && gsap.set(target, set);
    const fromTo = anim?.animType || "to";

    const fromOptions = typeof from === "object" && from ? from : {};

    fromTo == "fromTo"
      ? timeline.fromTo(
          target || lastTarget || mainElement.children,
          { ...options, ...fromOptions },
          to,
          time || ">",
        )
      : timeline[fromTo](
          target || lastTarget || mainElement.children,
          options,
          time || ">",
        );

    lastTarget = target || lastTarget;
    if (label) timeline.addLabel(label, "<");
  });
  return timeline;
};

export function makeId() {
  const crypto = window.crypto;
  let array = new Uint32Array(2);
  return crypto
    ? crypto.getRandomValues(array).join("-")
    : `${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

/** @param {number} n */
export const signedRandom = (n) =>
  [-n, n][(Math.random() * 2) | 0] * Math.random();
/**
 * @param {number} min
 * @param {number} max
 */
export const rangeRandom = (min, max) => Math.random() * (max - min) + min;
/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//const getParent = (el) => Promise.resolve(Object.prototype.toString.call(el)==="[object HTMLCollection]" ? el[0].parentNode : null);
