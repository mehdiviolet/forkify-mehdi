import View from './view';
import icons from '../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'There is not any recipe with this name!';

  _generateMerkup() {
    // console.log(this._data);
    return this._data.map(this._generateMerkupPreview).join('');
  }

  _generateMerkupPreview(ing) {
    const id = window.location.hash.slice(1);
    // console.log(ing);
    return `
    <li class="preview">
    <a class="preview__link ${
      ing.id === id ? 'preview__link--active' : ''
    }" href="#${ing.id}">
          <figure class="preview__fig">
            <img src="${ing.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${ing.title}</h4>
            <p class="preview__publisher">${ing.publisher}</p>
            <div class="preview__user-generated ${ing.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultView();
