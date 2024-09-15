import "./pages/index.css"; 
import { initialCards } from "./components/cards.js"; 
import { createCard, deleteCardCallback, likeCardCallback } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";


export const template = document.getElementById('card-template').content;



const popups = document.querySelectorAll('.popup');
const cardlist = document.querySelector('.places__list');
const buttonEditProfile = document.querySelector('.profile__edit-button');
const buttonAddProfile = document.querySelector('.profile__add-button');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeImage = document.querySelector('.popup_type_image');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const popupNewCard = document.querySelector('.popup_type_new-card');

initialCards.forEach((item) => {
    const cardElement = createCard(item, deleteCardCallback, likeCardCallback, openModalImage);
    cardlist.append(cardElement);
});

 

buttonAddProfile.addEventListener('click', () => { openModal(popupNewCard) });
buttonEditProfile.addEventListener('click', () => {
    
    nameInput.value = profileNameElement.textContent; 
    jobInput.value = profileDescriptionElement.textContent; 

    openModal(popupTypeEdit) });


function openModalImage(evt) { 
    openModal (popupTypeImage); 
    const imagePopup = document.querySelector('.popup__image'); 
    const popupCaption = document.querySelector('.popup__caption'); 
    imagePopup.src = evt.target.src; 
    popupCaption.textContent = evt.target.alt; 
  } 
  
popups.forEach((popup) => {
    const closeButton = popup.querySelector(".popup__close")
    closeButton.addEventListener("click", () => {
        closeModal(popup);
    });
});

popups.forEach((popup) => {
    popup.addEventListener("mousedown", (evt) => {
        if (evt.target.classList.contains("popup")) {
            closeModal(popup);
        }
    });
}); 

const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');


function handleProfileFormSubmit(evt) {
    evt.preventDefault(); 
    const nameValue = nameInput.value;
    const jobValue = jobInput.value;
    profileNameElement.textContent = nameValue;
    profileDescriptionElement.textContent = jobValue;

    closeModal(popupTypeEdit);
}
const formElementProf = document.querySelector('[name="edit-profile"]');
formElementProf.addEventListener('submit', handleProfileFormSubmit);

const formElementNew = document.querySelector('[name="new-place"]');
const typeCardName = document.querySelector('.popup__input_type_card-name')
const typeUrl = document.querySelector('.popup__input_type_url')

function clearForm(form) {
    form.reset();
}

formElementNew.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const CardNameValue = typeCardName.value;
    const UrlValue = typeUrl.value;

    const newCard = {
        name: CardNameValue,
        link: UrlValue
    };
    const cardElementNew = createCard(newCard, deleteCardCallback, likeCardCallback, openModalImage);
    cardlist.prepend(cardElementNew);

    clearForm(formElementNew);
  
    closeModal(popupNewCard);
})