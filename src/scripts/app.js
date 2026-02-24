class App {
  constructor() {
    this.init();
  }

  init() {
    console.log("App initialized");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
