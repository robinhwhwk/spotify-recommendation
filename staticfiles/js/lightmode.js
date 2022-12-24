$(document).ready(function () {
  const lightbutton = document.querySelector(".lightmode");
  const containers = document.querySelectorAll(".container");
  const songcards = document.querySelectorAll(".song-cards");
  const body = document.querySelector("body");
  // const logo = document.querySelector(".logo");
  const navbar = document.querySelector(".navbar");
  if (localStorage.getItem("light") == "true") {
    lightbutton.classList.add("light");
    navbar.classList.add("light");
    body.classList.add("light");
    // logo.classList.add("light");
    navbar.classList.remove("navbar-dark");
    navbar.classList.remove("bg-dark");
    navbar.classList.add("navbar-light");
    navbar.classList.add("bg-light");
    containers.forEach((container) => {
      container.classList.add("light");
    });
    if (songcards) {
      songcards.forEach((songcard) => {
        songcard.classList.add("light");
      });
    }
  } else if (localStorage.getItem("light") == "false") {
    lightbutton.classList.remove("light");
    navbar.classList.remove("navbar-light");
    navbar.classList.remove("bg-light");
    navbar.classList.add("navbar-dark");
    navbar.classList.add("bg-dark");
    body.classList.remove("light");
    // logo.classList.remove("light");
    containers.forEach((container) => {
      container.classList.remove("light");
    });
    if (songcards) {
      songcards.forEach((songcard) => {
        songcard.classList.remove("light");
      });
    }
  }
});
