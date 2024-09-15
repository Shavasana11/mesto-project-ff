export function openModal(popupElement) {
  document.addEventListener("keydown", closePopupEsc);
  popupElement.classList.add("popup_is-animated");  // сначала анимация
    setTimeout(() => {
        popupElement.classList.add('popup_is-opened'); // потом только открытие
    }, 1); 
}
export function closeModal(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closePopupEsc);
}

function closePopupEsc(event) {
  if (event.key === "Escape") {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}
