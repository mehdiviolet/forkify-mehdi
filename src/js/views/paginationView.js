import View from './view';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const pageGoTo = +btn.dataset.goto;
      handler(pageGoTo);
    });
  }

  _generateMerkup() {
    const currentPage = this._data.page;
    const pages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // console.log(currentPage);

    //if 1 page, others

    if (currentPage === 1 && pages > 1) {
      return `
        <button data-goto=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
    //if between, others
    if (currentPage < pages) {
      return `
      <button data-goto=${
        currentPage - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    //if Last page
    if (currentPage === pages && pages > 1) {
      return `
        <button data-goto=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${currentPage - 1}</span>
          </button>`;
    }

    //if 1 page, NO others
    else {
      return '';
    }
  }
}

export default new PaginationView();
