import moonIcon from "../../public/logo&icons/moon.svg";
import sunIcon from "../../public/logo&icons/sun.svg";
import editIcon from "../../public/logo&icons/edit.svg";
import deleteIcon from "../../public/logo&icons/delete.svg";
import updateIcon from "../../public/logo&icons/update.svg";

// SELECTORS
const colorModeBtn = document.querySelector(".color-mode-btn");
const modeBtnImg = colorModeBtn.querySelector("img");
const toDoInputField = document.querySelector(".todo__input--field");
const toDoBtn = document.querySelector(".add-btn");
const toDosContainer = document.querySelector(".todos__container");

// ---------------------- Functions ----------------------- //
const updateImgAttr = (imgUrl, altText) => {
  modeBtnImg.src = imgUrl;
  modeBtnImg.setAttribute("alt", altText);
};

const addToDoInDb = async todo => {
  try {
    const response = await fetch(`/.netlify/functions/createTodo?todo=${todo}`);

    return await response.json();
  } catch (error) {
    return error;
  }
};

const deleteToDoInDb = async id => {
  try {
    const response = await fetch(`/.netlify/functions/deleteTodo?id=${id}`);

    return response.text();
  } catch (error) {
    return error;
  }
};

const addToDo = () => {
  const regex = /^(\w)[\w\s]{3,48}(\w)$/gi;
  const todo = toDoInputField.value.trim();

  if (regex.test(todo)) {
    addToDoInDb(todo)
      .then(objId => {
        const toDoHtml = `<div class="card flex justify-space-between align-center gap-2" id="todo-${objId}">
            <p class="card__label">${todo}</p>
            <div class="card__btns--wrapper">
              <button class="btn edit-btn" title="edit todo">
                <img src=${editIcon} alt="edit icon" class="edit-icon"/>
              </button>
              <button class="btn delete-btn" title="delete todo">
                <img src=${deleteIcon} alt="delete icon" class="delete-icon"/>
              </button>
              <button class="btn update-btn" title="update todo">
                <img src=${updateIcon} alt="update icon" class="update-icon"/>
              </button>
            </div>
          </div>`;

        toDosContainer.style.display = "block";
        toDosContainer.insertAdjacentHTML("afterbegin", toDoHtml);

        toDoInputField.value = "";
        toDoInputField.focus();
      })
      .catch(error => {
        console.error(error);
      });
  }
};

/* ------------------ Event Handlers -------------------- */

// Set focus to todo input field on window loading
window.onload = () => toDoInputField.focus();

// Check User color-preference
const userDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (userDarkPreference) {
  updateImgAttr(moonIcon, "moon icon");
}

// Event handler for colorModeBtn with click event
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

// Event Handler for todo add button with click event
toDoBtn.addEventListener("click", addToDo);

// Event Handler for window with enter key
window.onkeydown = e => {
  if (e.keyCode === 13) addToDo();
};
