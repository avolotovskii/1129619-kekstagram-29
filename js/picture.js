import { getData } from './api.js';
import { showAlert, getRandomArrayEl, debounce } from './util.js';

const MAX_RANDOM_AMOUNT = 10;
const listPhoto = document.querySelector('.pictures');
const simularPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const imgFilters = document.querySelector('.img-filters');
const photoListFragment = document.createDocumentFragment();
const imgFiltersElem = document.querySelector('.img-filters__form');
const buttonsFilter = imgFiltersElem.querySelectorAll('.img-filters__button');
const photoWithData = await getData();

const compareComments = (a, b) => a.comments < b.comments ? 1 : -1;

const renderPosts = (data) => {
  data.forEach(({ id, url, description, likes, comments }) => {
    const photoElement = simularPictureTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').id = id;
    photoElement.querySelector('.picture__img').src = url;
    photoElement.querySelector('.picture__img').alt = description;
    photoElement.querySelector('.picture__info').querySelector('.picture__likes').textContent = likes;
    photoElement.querySelector('.picture__info').querySelector('.picture__comments').textContent = comments.length;

    photoListFragment.append(photoElement);
  });
  listPhoto.append(photoListFragment);
};

const shwohSortPicture = (pictures, filter) => {
  listPhoto.querySelectorAll('.picture').forEach((el) => {
    el.remove();
  });
  if (filter === 'filter-default') {
    renderPosts(pictures);
  }

  if (filter === 'filter-random') {
    const randomPicture = [];

    while (randomPicture.length < MAX_RANDOM_AMOUNT) {
      const newItem = getRandomArrayEl(pictures);
      if (randomPicture.indexOf(newItem) === -1) {
        randomPicture.push(newItem);
      }
    }
    renderPosts(randomPicture);
  }

  if (filter === 'filter-discussed') {
    const sortPictureByComments = pictures.slice().sort(compareComments);
    renderPosts(sortPictureByComments);
  }
};

const setOnfilterClick = (callback) => {
  imgFiltersElem.addEventListener('click', (evt) => {
    buttonsFilter.forEach((el) => {
      el.classList.remove('img-filters__button--active');
    });
    evt.target.classList.add('img-filters__button--active');
    callback();


    // callback(shwohSortPicture(photoWithData, evt.target.id));
    // console.log(callback(shwohSortPicture(photoWithData, evt.target.id)));

    // shwohSortPicture(photoWithData, evt.target.id);
  });
};

imgFilters.classList.remove('img-filters--inactive');

try {
  renderPosts(photoWithData);
  setOnfilterClick(debounce(()=> renderPosts(photoWithData)));
  // setOnfilterClick(debounce(()=> photoWithData));
} catch (err) {
  showAlert(err.message);
}

export { listPhoto, photoWithData };
