import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

class Scroll {
  constructor() {
    this.lenis = null;
    this.rafId = null;
  }

  init() {
    this.lenis = new Lenis({
      duration: 1.5,
      smooth: true,
      syncTouch: true,
      // direction: "vertical",
      lerp: 0.1,
    });
    this.lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  stop() {
    this.lenis?.stop();
  }

  start() {
    this.lenis?.start();
  }

  scrollTop() {
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: true });
    }
  }

  getScroll() {
    const scrollY = this.lenis.actualScroll;
    return scrollY;
  }

  destroy() {
    if (!this.lenis) return;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.lenis.destroy();
    this.lenis = null;
  }
}

export default Scroll;
