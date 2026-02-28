import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scroll from "./libs/scroll";
import { preloadImages, select, selectAll } from "./utils";
import * as THREE from "three";
import Media from "./module/media";

class App {
  constructor() {
    this.scroll = new Scroll();
    this.scroll.init();

    this.canvas = select("#webgl");
    this.images = [];

    this.cameraZ = 100;

    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      aspect: window.innerWidth / window.innerHeight,
    };

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createMedias();

    this.addEventListeners();

    this.onResize();

    this.render();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
  }

  createCamera() {
    const fov =
      2 * Math.atan(this.screen.height / 2 / this.cameraZ) * (180 / Math.PI);
    this.camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.scene.add(this.camera);

    this.camera.position.z = this.cameraZ;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.canvas,
    });

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.render(this.scene, this.camera);

    this.renderer.setPixelRatio(this.screen.pixelRatio);
  }

  createMedias() {
    const medias = [...selectAll(".item__image__wrapper.gl")];
    this.images = medias.map((media) => {
      const image = media.firstElementChild;

      return new Media({
        src: image.src,
        element: media,
        scene: this.group,
        viewport: this.screen,
      });
    });

    this.scene.add(this.group);
  }

  onResize() {
    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;
    this.screen.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.screen.aspect = window.innerWidth / window.innerHeight;

    // Resize camera
    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.fov =
      2 * Math.atan(this.screen.height / 2 / this.cameraZ) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    // Resize renderer
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(this.screen.pixelRatio);

    this.images.forEach((image) => {
      image.onResize(this.screen);
    });
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  render() {
    const scrollY = this.scroll.getScroll();

    this.images.forEach((image) => {
      image.updatePosition(scrollY);
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo({
    top: 0,
    behavior: "instant",
  });

  gsap.registerPlugin(ScrollTrigger);

  await preloadImages(".item__image__wrapper img");

  new App();
});
