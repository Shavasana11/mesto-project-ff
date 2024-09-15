
export function openModal(popupElement) {
    popupElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupEsc);
};
export function closeModal(popupElement) {
    popupElement.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupEsc);
};

function closePopupEsc(event) {
    if (event.key === 'Escape') {
        closeModal(document.querySelector('.popup_is-opened'));
    }
}