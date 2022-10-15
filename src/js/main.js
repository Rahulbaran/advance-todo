import moonIcon from "../../public/logo&icons/moon.svg";
import sunIcon from "../../public/logo&icons/sun.svg";

// SELECTORS
const todoInput = document.querySelector(".todo__input--field");
const colorModeBtn = document.querySelector(".color-mode-btn");
const modeBtnImg = colorModeBtn.querySelector("img");

// Functions
const updateImgAttr = (imgUrl, altText) => {
  modeBtnImg.src = imgUrl;
  modeBtnImg.setAttribute("alt", altText);
};

// Set focus to todo input field on window loading
window.onload = () => todoInput.focus();

// Check User color-preference
const userDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (userDarkPreference) {
  updateImgAttr(moonIcon, "moon icon");
}

// Event listener for colorModeBtn
colorModeBtn.addEventListener("click", () => {
  const getModeIcon = modeBtnImg.getAttribute("alt");

  if (getModeIcon === "moon icon") {
    updateImgAttr(sunIcon, "sun icon");
    document.body.classList.remove("dark-color-pallete");
    document.body.classList.add("light-color-pallete");
  } else {
    updateImgAttr(moonIcon, "moon icon");
    document.body.classList.remove("light-color-pallete");
    document.body.classList.add("dark-color-pallete");
  }
});
