

import axios from 'axios';
import { debounce } from 'debounce';

import Notiflix from 'notiflix';

const Base_URL = 'https://pixabay.com/api/';
const API_KEY = '35662009-e5be1617f11ed2e5bbc0332d7';
const http_parametrs = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=5`;

const refs = {
  input: document.querySelector('.q'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.button'),
};

let page = 1;

async function fetch(q = 'car', page = 1) {
  try {
    const fetch = await axios.get(
      `${Base_URL}?key=${API_KEY}&q=${q}&page=${page}${http_parametrs}`
    );
    const response = fetch.data;
    return response;
  } catch (error) {
    console.log(error.message);
  }
}
refs.input.addEventListener('input', debounce(onInput, 300));
refs.button.addEventListener('click', onClick);

async function render(data) {
  const markUp = data
    .map(({ comments, downloads, likes, webformatURL, tags }) => {
      return `<img src="${webformatURL}" alt="${tags}">
      <div class="info__photo">comments: ${comments} </div
      <div class="info__photo">download: ${downloads}</div>
      <div class="info__photo"> likes:${likes} </div>`;
    })
    .join(' ');

  return markUp;
}

async function onInput(e) {
  const value = e.target.value.trim();

  if (value === '') {
    refs.button.classList.add('is-hidden');
    refs.gallery.innerHTML = '';
    Notiflix.Notify.info('Введіть данні');
    return;
  }

  const data = await fetch(value);

  const markUp = await render(data.hits);
  Notiflix.Notify.info(
    `Ура ми знайшли  ${data.total} картинку за вашим запитом`
  );

  if (markUp !== '') {
    refs.button.classList.remove('is-hidden');
  }

  refs.gallery.insertAdjacentHTML('beforeend', markUp);
}

async function onClick(e) {

  const value = refs.input.value.trim();
  page += 1;

  const data = await fetch(value, page);

  const images = data.total - page * 5;
  const imagesLeft = images > 0 ? images : 0;
  if (imagesLeft === 0) {
    refs.button.classList.add('is-hidden');
    Notiflix.Notify.info(`Нажаль картинки завершились`);
  } else {
    Notiflix.Notify.info(`Ура ми знайшли  ${imagesLeft} картинку за вашим запитом`);
  }

  

  const markUp = await render(data.hits);

  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
}
