import { template } from "../index.js";

export function deleteCardCallback(evt) {
  evt.target.closest(".places__item").remove();
}

export function likeCardCallback(evt) {
  if (evt.target.classList.contains("card__like-button")) {
    evt.target.classList.toggle("card__like-button_is-active");
  }
}

export function createCard(
  item,
  deleteCardCallback,
  likeCardCallback,
  openModalImage
) {
  const itemCard = template.querySelector(".places__item").cloneNode(true);
  const imageCard = itemCard.querySelector(".card__image");
  const deleteBtn = itemCard.querySelector(".card__delete-button");
  const likeBtn = itemCard.querySelector(".card__like-button");
  const titleCard = itemCard.querySelector(".card__title");
  imageCard.src = item.link;
  imageCard.alt = item.name;

  titleCard.textContent = item.name;

  imageCard.addEventListener("click", openModalImage);
  deleteBtn.addEventListener("click", deleteCardCallback);
  likeBtn.addEventListener("click", likeCardCallback);

  return itemCard;
}
