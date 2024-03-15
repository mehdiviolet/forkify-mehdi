import View from './view';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMerkup() {
    console.log(this._data);
    return this._data.map(this._generateMerkupPreview).join('');
  }

  _generateMerkupPreview(book) {
    const id = window.location.hash.slice(1);
    return `        
    <li class="preview">
        <a class="preview__link ${
          book.id === id ? 'preview__link--active' : ''
        }" href="#${book.id}">
          <figure class="preview__fig">
            <img src="${book.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${book.title}</h4>
            <p class="preview__publisher">${book.publisher}</p>
            <div class="preview__user-generated ${book.key ? '' : 'hidden'}">
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

export default new BookmarkView();
