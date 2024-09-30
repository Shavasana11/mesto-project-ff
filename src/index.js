import "./index.css";
import { renderCard } from "./scripts/card";
import { closeModal, openModal, closeModalOnOverlay } from "./scripts/modal";
import { clearValidation, enableValidation } from "./scripts/validation";
import {
  getInitialInfo,
  postNewCard,
  updateUserAvatar,
  updateUserProfile,
  putLike,
  deleteLike,
  deleteCard as deleteCardFromServer,
} from "./scripts/api";

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
const popupConfirm = document.querySelector(".popup_type_confirm");
const popupConfirmButton = popupConfirm.querySelector(".popup__button");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

function likeCard(evt) {
  const currentLikes = evt.target.parentNode.querySelector(".card__like-count");

  if (evt.target.classList.contains("card__like-button_is-active")) {
    deleteLike(evt.target.closest(".card").id)
      .then((updatedCard) => {
        evt.target.classList.remove("card__like-button_is-active");
        currentLikes.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    putLike(evt.target.closest(".card").id)
      .then((updatedCard) => {
        evt.target.classList.add("card__like-button_is-active");
        currentLikes.textContent = updatedCard.likes.length;
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

const deleteCard = (evt) => {
  const parent = evt.target.closest(".card");
  openModal(popupConfirm);
  popupConfirm.addEventListener("click", (evt) => {
    closeModalOnOverlay(evt);
  });
  popupConfirmButton.addEventListener("click", (evt) => {
    deleteCardFromServer(parent.id)
      .then((result) => {
        parent.remove();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        closeModal(popupConfirm);
      });
  });
};

const fillProfileInfo = (userInfo) => {
  profileTitle.textContent = userInfo.name;
  profileDescription.textContent = userInfo.about;
  profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
};

const renderInitialCards = (initialCards, userInfo) => {
  initialCards.forEach((card) => {
    renderCard(
      card,
      userInfo,
      placesList,
      likeCard,
      deleteCard,
      openImagePopup
    );
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
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupProfileForm.querySelector(".popup__button"));
      closeModal(popupProfile);
      clearValidation(popupProfileForm, validationConfig);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupAvatarForm.querySelector(".popup__button"));

  const avatarLink = popupAvatarForm.link.value;

  updateUserAvatar(avatarLink)
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupAvatarForm.querySelector(".popup__button"));
      closeModal(popupAvatar);
      clearValidation(popupAvatarForm, validationConfig);
    });
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupNewCardForm.querySelector(".popup__button"));

  const name = popupNewCardForm.elements["place-name"].value;
  const link = popupNewCardForm.elements.link.value;
  const userInfo = { name: profileTitle.textContent };

  postNewCard({ name, link })
    .then((newCard) => {
      renderCard(
        newCard,
        userInfo,
        placesList,
        likeCard,
        deleteCard,
        openImagePopup,
        "start"
      );
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupNewCardForm.querySelector(".popup__button"));
      closeModal(popupNewCard);
      popupNewCardForm.reset();
      clearValidation(popupNewCardForm, validationConfig);
    });
}

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

document.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("popup__close")) {
    closeModal(evt.target.parentNode.parentNode);
  }
});

getInitialInfo()
  .then((result) => {
    const userInfo = result[0];
    const initialCards = result[1];
    fillProfileInfo(userInfo);
    renderInitialCards(initialCards, userInfo);
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation(validationConfig);
