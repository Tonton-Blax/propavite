import { createContext } from "svelte";

/** @import { PropaCentricContext, PropaTitleContext } from "../app" */

class CentricContextState {
  path = $state("");
  pathId = $state("");
  units = $state("px");
  radius = $state(0);
  pathElement = $state(/** @type {SVGPathElement | null} */ (null));
}

class PropaTitleContextState {
  title = $state("");
  propagandaWrapper = $state(/** @type {HTMLDivElement | null} */ (null));

  /** @param {string} title */
  constructor(title = "") {
    this.title = title;
  }
}

/** @returns {PropaCentricContext} */
export function createCentricContext() {
  return new CentricContextState();
}

/** @param {string} title */
/** @returns {PropaTitleContext} */
export function createPropaTitleContext(title = "") {
  return new PropaTitleContextState(title);
}

export const [getCentricContext, setCentricContext] = createContext();
export const [getPropaTitleContext, setPropaTitleContext] = createContext();
