import { addToDoInDb, deleteToDoInDb, updateToDoInDb } from "./dbFunctions";
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

let toDosList = [];

// ======================== Functions ========================== //
const updateImgAttr = (imgUrl, altText) => {
  modeBtnImg.src = imgUrl;
  modeBtnImg.setAttribute("alt", altText);
};

const storeInStorage = () => {
  localStorage.setItem("todos", JSON.stringify(toDosList));
};

const generateToDoHtml = (objId, todo) => {
  const toDoHtml = `<div class="card flex justify-space-between align-center gap-2" id="todo-${objId}">
            <p class="card__label">${todo}</p><div class="card__btns--wrapper">
            <button class="btn edit-btn" title="edit todo"><img src=${editIcon} alt="edit icon" class="edit-icon"/>
            </button><button class="btn delete-btn" title="delete todo"><img src=${deleteIcon} alt="delete icon" class="delete-icon"/>
            </button><button class="btn update-btn" title="update todo"><img src=${updateIcon} alt="update icon" class="update-icon"/>
            </button></div></div>`;

  toDosContainer.style.display = "block";
  toDosContainer.insertAdjacentHTML("afterbegin", toDoHtml);
};

const addToDo = () => {
  const regex = /^(\w)[\w\s]{3,48}(\w)$/gi;
  const todo = toDoInputField.value.trim();

  if (regex.test(todo)) {
    addToDoInDb(todo)
      .then(objId => {
        toDosList.push({
          id: objId,
          toDoLabel: todo
        });
        storeInStorage();

        generateToDoHtml(objId, todo);
        toDoInputField.value = "";
        toDoInputField.focus();
      })
      .catch(error => {
        console.error(error);
      });
  }
};

// Function to toggle card buttons
const toggleCardBtns = (btnsParent, displays) => {
  displays.forEach((display, index) => {
    btnsParent.children[index].style.display = display;
  });
};

/* ===================== Event Handlers ======================= */

// Take todos from localStorage, display them in UI & set focus
window.onload = () => {
  toDoInputField.focus();

  toDosList = JSON.parse(localStorage.getItem("todos")) || [];
  toDosList.forEach(todo => {
    generateToDoHtml(todo.id, todo.toDoLabel);
  });
};

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

// Event Handler for adding todo in database
toDoBtn.addEventListener("click", addToDo);
window.onkeydown = e => {
  if (e.keyCode === 13) addToDo();
};

// Event Handler for todos container
toDosContainer.onclick = e => {
  // WHEN DELETE BUTTON IS CLICKED
  if (e.target.matches(".delete-btn") || e.target.matches(".delete-icon")) {
    const cardId = e.target.closest(".card").id.split("-")[1];

    deleteToDoInDb(cardId)
      .then(() => {
        toDosList.splice(
          toDosList.findIndex(todo => todo.id === cardId),
          1
        );
        storeInStorage();

        e.target.closest(".card").remove();
        if (toDosList.length === 0) toDosContainer.style.display = "none";
      })
      .catch(error => {
        console.error(error);
      });
  }

  // WHEN EDIT BUTTON IS CLICKED
  else if (e.target.matches(".edit-btn") || e.target.matches(".edit-icon")) {
    const toDoTxt = e.target.closest(".card__btns--wrapper").previousElementSibling;

    toDoTxt.setAttribute("contentEditable", "true");
    toDoTxt.classList.add("card-label-edit");

    toggleCardBtns(e.target.closest(".card__btns--wrapper"), ["none", "none", "inline-block"]);
  }

  // WHEN UPDATE BUTTON IS CLICKED
  else if (e.target.matches(".update-btn") || e.target.matches(".update-icon")) {
    const regex = /^(\w)[\w\s]{3,48}(\w)$/gi;

    const cardId = e.target.closest(".card").id.split("-")[1];
    const toDoLabel = e.target.closest(".card__btns--wrapper").previousElementSibling;
    const toDo = toDoLabel.textContent.trim();

    if (regex.test(toDo)) {
      updateToDoInDb(cardId, toDo)
        .then(() => {
          toDoLabel.setAttribute("contentEditable", "false");
          toDoLabel.classList.remove("card-label-edit");

          toggleCardBtns(e.target.closest(".card__btns--wrapper"), [
            "inline-block",
            "inline-block",
            "none"
          ]);

          toDosList[toDosList.findIndex(todo => todo.id === cardId)].toDoLabel = toDo;
          storeInStorage();
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
