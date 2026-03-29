import gsap from "gsap";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";

let initialized = false;

export function setupGsap() {
  if (initialized) {
    return;
  }

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    MotionPathPlugin,
    MorphSVGPlugin,
  );
  ScrollTrigger.clearScrollMemory();
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
  gsap.config({ force3D: true });

  initialized = true;
}

export {
  gsap,
  MorphSVGPlugin,
  MotionPathPlugin,
  ScrollSmoother,
  ScrollTrigger,
};
