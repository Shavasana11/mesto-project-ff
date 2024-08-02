// @todo: Темплейт карточки

const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы

const content = document.querySelector(".content");
const cardList = content.querySelector(".places__list");
const addButton = content.querySelector(".profile__add-button");

// @todo: Функция создания карточки

function addCard(cardTitle, cardImage, deletedCard) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImg = cardElement.querySelector(".card__image");
  cardElement.querySelector(".card__title").textContent = cardTitle;

  cardImg.alt = cardTitle;
  cardImg.src = cardImage;
  const deleteButton = cardElement.querySelector(".card__delete-button");

  deleteButton.addEventListener("click", function (evt) {
    deletedCard(evt);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
const deletedCard = (event) => {
  const item = event.target.closest(".card");
  item.remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach(function ({ name, link }) {
  const cardData = addCard(name, link, deletedCard);
  cardList.append(cardData);
});
