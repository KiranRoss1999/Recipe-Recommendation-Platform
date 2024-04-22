document.addEventListener("DOMContentLoaded", function () {
  // Get all "navbar-burger" elements
  const navbarBurgers = document.querySelectorAll(".navbar-burger");

  // Attach click event listener to each navbar burger
  for (let i = 0; i < navbarBurgers.length; i++) {
    const el = navbarBurgers[i];
    el.addEventListener("click", function () {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const targetElement = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      targetElement.classList.toggle("is-active");
    });
  }
});

const modeBtn = document.querySelector("#mode-toggle");
const bodyEl = document.querySelector("body");
modeBtn.addEventListener("click", function () {
  bodyEl.classList.toggle("inverted-colors");
  const pageMode = bodyEl.classList.contains("inverted-colors")
    ? "inverted"
    : "normal";
  localStorage.setItem("mode", pageMode);
  if (bodyEl.classList.contains("inverted-colors")) {
    bodyEl.style.backgroundColor = "var(--dark0)";
  } else {
    bodyEl.style.backgroundColor = "var(--primary-color)";
  }
  modeBtn.textContent = bodyEl.classList.contains("inverted-colors")
    ? "☀️"
    : "🌙";
});

function init() {
  const pageMode = localStorage.getItem("mode");
  if (pageMode === "inverted") {
    bodyEl.classList.add("inverted-colors");
    bodyEl.style.backgroundColor = "var(--dark0)";
    modeBtn.textContent = "🌙";
  }
}
init();

// NAVBAR BUTTON FUNCTIONS TO CHANGE PAGES
const aboutUsPage = document.querySelector("#aboutUsPage");
const homePage = document.querySelector("#homePage");
const contactPage = document.querySelector("#contactPage");
const gitHubPage = document.querySelector("#gitPage");

homePage.addEventListener("click", function (event) {
  window.location.href = "./index.html";
});

// Doing reload method instead as it is the same page
aboutUsPage.addEventListener("click", function (event) {
  window.location.reload();
});

contactPage.addEventListener("click", function (event) {
  window.location.href = "./contact-page.html";
});

// Linking to our GitHub Repo for the Project ! :D
gitHubPage.addEventListener("click", function (event) {
  window.location.href =
    "https://github.com/KiranRoss1999/Recipe-Recommendation-Platform";
});
