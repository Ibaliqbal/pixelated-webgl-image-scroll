import * as THREE from "three";
import fragmentShader from "../shaders/fragment.glsl";
import vertexShader from "../shaders/vertex.glsl";
import gsap from "gsap";

class Media {
  constructor({ src, element, scene, viewport }) {
    this.viewport = viewport;
    this.src = src;
    this.element = element;
    this.scene = scene;

    this.bounds = this.element.firstElementChild.getBoundingClientRect();

    this.meshPosition = {
      x: this.bounds.left - this.viewport.width / 2 + this.bounds.width / 2,
      y: -this.bounds.top + this.viewport.height / 2 - this.bounds.height / 2,
    };

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
    this.createTexture();
    this.setScrollAnimation();

    this.updateScale();
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(this.bounds.width, this.bounds.height),
        },
        uImageResolution: {
          value: new THREE.Vector2(1, 1),
        },
        uPixels: {
          value: [
            4, 4.5, 5, 5.5, 6, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5,
            9, 20, 100,
          ].map((v) => v / 100),
        },
      },
      vertexShader,
      fragmentShader,
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.mesh.frustumCulled = false;
  }

  createTexture() {
    this.texture = new THREE.TextureLoader().load(this.src, ({ image }) => {
      const material = this.mesh.material;
      if (material) {
        material.uniforms.uImageResolution.value.set(image.width, image.height);
      }
    });

    this.material.uniforms.uTexture.value = this.texture;
  }

  setScrollAnimation() {
    gsap.to(this.material.uniforms.uProgress, {
      value: 1,
      duration: 1.25,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: this.element,
        start: "top 95%",
        toggleActions: "play reset restart reset",
        // once: true,
        // invalidateOnRefresh: true,
      },
    });
  }

  updateScale() {
    this.material.uniforms.uResolution.value.set(
      this.bounds.width,
      this.bounds.height,
    );
    this.mesh.scale.set(this.bounds.width, this.bounds.height, 1);
  }

  updatePosition(scrollY) {
    this.meshPosition.y =
      -this.bounds.top +
      scrollY +
      this.viewport.height / 2 -
      this.bounds.height / 2;
    this.mesh.position.y = this.meshPosition.y;
  }

  onResize(viewport) {
    this.viewport = viewport;
    this.bounds = this.element.getBoundingClientRect();
    this.meshPosition.x =
      this.bounds.left - this.viewport.width / 2 + this.bounds.width / 2;
    this.meshPosition.y =
      -this.bounds.top + this.viewport.height / 2 - this.bounds.height / 2;

    this.updateScale();
  }
}

export default Media;
