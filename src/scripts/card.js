const cardTemplate = document.querySelector("#card-template").content;

export const createCard = (
  card,
  userId,
  deleteCardFn,
  likeCardFn,
  openFullImageFn
) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;
  cardLikeCount.textContent = card.likes.length;

  const isLiked = card.likes.some((like) => like._id === userId);

  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  if (card.owner._id === userId) {
    cardDeleteButton.addEventListener("click", (evt) => {
      deleteCardFn(cardElement, card._id);
    });
  } else {
    cardDeleteButton.remove();
  }

  cardLikeButton.addEventListener("click", (evt) => {
    likeCardFn(cardElement, card._id);
  });

  cardImage.addEventListener("click", () => {
    openFullImageFn(card.link, card.name, card.name);
  });

  return cardElement;
};

export function isCardLiked(cardElement) {
  return cardElement
    .querySelector(".card__like-button")
    .classList.contains("card__like-button_is-active");
}

export function toggleLikeButton(cardElement, isActive) {
  const likeButton = cardElement.querySelector(".card__like-button");
  if (isActive) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }
}

export function updateLikeCount(cardElement, likesAmount) {
  cardElement.querySelector(".card__like-count").textContent = likesAmount;
}

export function deleteCardElement(cardElement) {
  cardElement.remove();
} 
