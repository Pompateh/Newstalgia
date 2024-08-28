function headerResizeListener() {
  let headerHeightOutput = document.querySelector(".header_demo");
  let footerHeightOutput = document.querySelector(".index-footer");

  function initializeheaderResize() {
    if (headerHeightOutput) {
      let getHeight = headerHeightOutput.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${getHeight}px`);
    }
    if (footerHeightOutput) {
      let getHeight = footerHeightOutput.offsetHeight;
      document.documentElement.style.setProperty('--index-footer-height', `${getHeight}px`);
    }
  }

  // Initialize on page load
  initializeheaderResize();

  // Reinitialize on window resize
  window.addEventListener("resize", initializeheaderResize);
}

headerResizeListener();

hamburger = document.querySelector(".hamburger");
hamburger.onclick = function() {
    navBar = document.querySelector(".nav-bar");
    navBar.classList.toggle("active");
}