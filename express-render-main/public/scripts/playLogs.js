document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded");
  
    const toggleButtons = document.querySelectorAll(".toggle-notes");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        console.log("Button clicked");
        const targetId = this.getAttribute("data-toggle-target");
        console.log("Target ID:", targetId);
        const target = document.querySelector(targetId);
        console.log("Target:", target);
        if (target) {
          target.classList.toggle("show");
        }
      });
    });
  });
  