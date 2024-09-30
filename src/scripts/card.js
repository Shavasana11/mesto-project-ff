const cardTemplate = document.querySelector("#card-template").content;

const createCard = (
  card,
  userInfo,
  deleteCardFn,
  likeCardFn,
  openFullImageFn,
) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  cardElement.id = card._id;
  cardElement.dataset.ownerId = card.owner._id;
  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  let likesAmount = 0;
  card.likes.forEach((like) => {
    if (like.name === card.owner.name) {
      cardLikeButton.classList.add("card__like-button_is-active");
    }
    likesAmount += 1;
  });
  cardLikeCount.textContent = likesAmount;

  if (card.owner.name === userInfo.name) {
    cardDeleteButton.addEventListener("click", (evt) => {
      deleteCardFn(evt);
    });
  } else {
    cardDeleteButton.remove();
  }

  cardLikeButton.addEventListener("click", (evt) => {
    likeCardFn(evt);
  });

  cardImage.addEventListener("click", () => {
    openFullImageFn(cardImage.src, cardImage.alt, cardTitle.textContent);
  });

  return cardElement;
};

const renderCard = (
  item,
  userInfo,
  container,
  likeCard,
  deleteCard,
  openFullImageFn,
  place = "end",
) => {
  const cardElement = createCard(
    item,
    userInfo,
    deleteCard,
    likeCard,
    openFullImageFn,
  );
  if (place === "end") {
    container.append(cardElement);
  } else {
    container.prepend(cardElement);
  }
};

export { renderCard };