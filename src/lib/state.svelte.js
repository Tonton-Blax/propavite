/** @import { PropaCentricContext, PropaSharedState, PropaTitleContext } from "../app" */

export const centricCtxKey = Symbol("centric-context");
export const propaTitleCtxKey = Symbol("propatitle-context");

/** @type {PropaSharedState} */
export const appState = $state({
  intersection: {},
  isMobile: false,
  typographicScrollProgress: 0,
});

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

/** @param {boolean} value */
export function setIsMobile(value) {
  appState.isMobile = value;
}

/** @param {number} value */
export function setTypographicScrollProgress(value) {
  appState.typographicScrollProgress = value;
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
