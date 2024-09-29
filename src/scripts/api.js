const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-22",
  headers: {
    authorization: "1aeffd04-b051-4125-89e2-4249a162b799",
    "Content-Type": "application/json",
  },
};

function getResponseData(res) {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

function getInitialCards() {
  return fetch(config.baseUrl + "/cards", {
    headers: config.headers,
  }).then(getResponseData);
}

function getUserInfo() {
  return fetch(config.baseUrl + "/users/me", {
    headers: config.headers,
  }).then(getResponseData);
}

function getInitialInfo() {
  return Promise.all([getUserInfo(), getInitialCards()]);
}

function updateUserProfile(userProfileData) {
  return fetch(config.baseUrl + "/users/me", {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: userProfileData.name,
      about: userProfileData.about,
    }),
  }).then(getResponseData);
}

function postNewCard(cardData) {
  return fetch(config.baseUrl + "/cards", {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: cardData.name,
      link: cardData.link,
    }),
  }).then(getResponseData);
}

function putLike(cardId) {
  return fetch(config.baseUrl + `/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(getResponseData);
}

function deleteLike(cardId) {
  return fetch(config.baseUrl + `/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
}

function deleteCard(cardId) {
  return fetch(config.baseUrl + `/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
}

function updateUserAvatar(avatarLink) {
  return fetch(config.baseUrl + "/users/me/avatar", {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarLink,
    }),
  }).then(getResponseData);
}

// exports
export {
  getInitialCards,
  getUserInfo,
  getInitialInfo,
  updateUserProfile,
  postNewCard,
  putLike,
  deleteLike,
  deleteCard,
  updateUserAvatar,
};
