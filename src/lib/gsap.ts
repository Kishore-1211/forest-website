import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Placeholder — not registered yet. Uncomment when a section needs
// per-character/word text reveals (e.g. headline typography animation).
// import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger /*, SplitText */);
}

export { gsap, ScrollTrigger };
