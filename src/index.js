import "./index.css";
import { closeModal, openModal, closeModalOnOverlay } from "./scripts/modal";
import {
  clearValidation,
  enableValidation,
  checkValidition,
} from "./scripts/validation";
import {
  getInitialInfo,
  postNewCard,
  updateUserAvatar,
  updateUserProfile,
  putLike,
  deleteLike,
  deleteCard as deleteCardFromServer,
} from "./scripts/api";
import {
  createCard,
  isCardLiked,
  toggleLikeButton,
  updateLikeCount,
  deleteCardElement
} from "./scripts/card.js";

const placesList = document.querySelector(".places__list");
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileForm = document.forms["edit-profile"];
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const profileEditButton = document.querySelector(".profile__edit-button");
const newCardButton = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupNewCardForm = document.forms["new-place"];
const popupImageElement = document.querySelector(".popup_type_image");
const popupImage = popupImageElement.querySelector(".popup__image");
const popupCaption = popupImageElement.querySelector(".popup__caption");
const popupAvatar = document.querySelector(".popup_type_avatar");
const popupAvatarForm = document.forms["edit-avatar"];
const avatarEditButton = document.querySelector(".profile__image-container");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// общие данные приложения
const appData = {
  userInfo: null,
};

function likeCard(cardElement, cardId) {
  if (isCardLiked(cardElement)) {
    deleteLike(cardId)
      .then((updatedCard) => {
        toggleLikeButton(cardElement, false);
        updateLikeCount(cardElement, updatedCard.likes.length);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    putLike(cardId)
      .then((updatedCard) => {
        toggleLikeButton(cardElement, true);
        updateLikeCount(cardElement, updatedCard.likes.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const renderLoading = (isLoading, button) => {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
};

const deleteCard = (cardElement, cardId) => {
  deleteCardFromServer(cardId)
    .then((result) => {
      deleteCardElement(cardElement); 
    })
    .catch((err) => {
      console.log(err);
    });
};

const fillProfileInfo = (userInfo) => {
  profileTitle.textContent = userInfo.name;
  profileDescription.textContent = userInfo.about;
  profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
};

const renderInitialCards = (initialCards, userId) => {
  initialCards.forEach((card) => {
    renderCard(card, userId, placesList, likeCard, deleteCard, openImagePopup);
  });
};

const openImagePopup = (imageURL, imageAlt, title) => {
  popupImage.src = imageURL;
  popupImage.alt = imageAlt;
  popupCaption.textContent = title;
  openModal(popupImageElement);
};

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupProfileForm.querySelector(".popup__button"));

  const name = popupProfileForm.name.value;
  const about = popupProfileForm.description.value;

  updateUserProfile({ name, about })
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
      closeModal(popupProfile);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupProfileForm.querySelector(".popup__button"));
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupAvatarForm.querySelector(".popup__button"));

  const avatarLink = popupAvatarForm.link.value;

  updateUserAvatar(avatarLink)
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
      closeModal(popupProfile);
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupAvatarForm.querySelector(".popup__button"));
    });
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const isFormValid = checkValidition(popupNewCardForm, validationConfig);
  if (!isFormValid) return;

  renderLoading(true, popupNewCardForm.querySelector(".popup__button"));

  const name = popupNewCardForm.elements["place-name"].value;
  const link = popupNewCardForm.elements.link.value;

  postNewCard({ name, link })
    .then((newCard) => {
      renderCard(
        newCard,
        appData.userInfo._id,
        placesList,
        likeCard,
        deleteCard,
        openImagePopup,
        "start"
      );
      popupNewCardForm.reset();
      closeModal(popupNewCard);
      сlearValidation(popupNewCardForm, validationConfig); ///// тут где ошибка с кнопкой она после повторного поста автоматически черная
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupNewCardForm.querySelector(".popup__button"));
    });
}

const renderCard = (
  item,
  userId,
  container,
  likeCard,
  deleteCard,
  openFullImageFn,
  place = "end"
) => {
  const cardElement = createCard(
    item,
    userId,
    deleteCard,
    likeCard,
    openFullImageFn
  );
  if (place === "end") {
    container.append(cardElement);
  } else {
    container.prepend(cardElement);
  }
};

const fillProfilePopup = (form, name, description) => {
  form.elements.name.value = name;
  form.elements.description.value = description;
};

popupImageElement.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

profileEditButton.addEventListener("click", () => {
  clearValidation(popupProfileForm, validationConfig);
  fillProfilePopup(
    popupProfileForm,
    profileTitle.textContent,
    profileDescription.textContent
  );
  openModal(popupProfile);
});

popupProfileForm.addEventListener("submit", handleProfileFormSubmit);

popupProfile.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

avatarEditButton.addEventListener("click", (evt) => {
  clearValidation(popupAvatarForm, validationConfig);
  popupAvatarForm.reset();
  openModal(popupAvatar);
});

popupAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

popupAvatar.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

newCardButton.addEventListener("click", () => {
  popupNewCardForm.reset();
  clearValidation(popupNewCardForm, validationConfig);
  openModal(popupNewCard);
});

popupNewCardForm.addEventListener("submit", handleNewCardFormSubmit);

popupNewCard.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

const popupCloseButtons = document.querySelectorAll(".popup__close");

popupCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".popup"));
  });
});

getInitialInfo()
  .then((result) => {
    const userInfo = result[0];
    const initialCards = result[1];
    fillProfileInfo(userInfo);
    renderInitialCards(initialCards, userInfo._id);

    appData.userInfo = userInfo;
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation(validationConfig);
