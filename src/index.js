import "./index.css";
import { renderCard, likeCard, deleteCard } from "./scripts/card";
import { closeModal, openModal, closeModalOnOverlay } from "./scripts/modal";
import {
  clearValidation,
  enableValidation,
  validationConfig,
} from "./scripts/validation";
import {
  getInitialInfo,
  postNewCard,
  updateUserAvatar,
  updateUserProfile,
  deleteCard as deleteCardServer,
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

let userId;

const renderLoading = (isLoading, button) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
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

const handleConfirmDelete = async (evt) => {
  deleteCardServer(popupConfirm.dataset.cardId)
    .then((result) => {
      const card = document.querySelector(
        `[data-card-id="${popupConfirm.dataset.cardId}"]`
      );
      card.remove();
      closeModal(popupConfirm);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleProfileFormSubmit = async (evt) => {
  evt.preventDefault();
  renderLoading(true, popupProfileForm.querySelector(".popup__button"));
  updateUserProfile({
    name: popupProfileForm.name.value,
    about: popupProfileForm.description.value,
  })
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
      closeModal(popupProfile);
      clearValidation(popupProfileForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupProfileForm.querySelector(".popup__button"));
    });
};

const handleAvatarFormSubmit = async (evt) => {
  evt.preventDefault();
  renderLoading(true, popupAvatarForm.querySelector(".popup__button"));
  updateUserAvatar(popupAvatarForm.link.value)
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
      closeModal(popupAvatar);
      clearValidation(popupAvatarForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupAvatarForm.querySelector(".popup__button"));
    });
};

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupNewCardForm.querySelector(".popup__button"));

  const name = popupNewCardForm.elements["place-name"].value;
  const link = popupNewCardForm.elements.link.value;

  postNewCard({ name, link })
    .then((newCard) => {
      renderCard(
        newCard,
        userId,
        placesList,
        likeCard,
        deleteCard,
        openImagePopup,
        "start"
      );
      closeModal(popupNewCard);
      popupNewCardForm.reset();
      clearValidation(popupNewCardForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupNewCardForm.querySelector(".popup__button"));
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

popupConfirm.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

popupConfirmButton.addEventListener("click", handleConfirmDelete);

document.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("popup__close")) {
    closeModal(evt.target.parentNode.parentNode);
  }
});

getInitialInfo()
  .then((result) => {
    const userInfo = result[0];
    userId = userInfo._id;
    const initialCards = result[1];
    fillProfileInfo(userInfo);
    renderInitialCards(initialCards, userId);
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation(validationConfig);
