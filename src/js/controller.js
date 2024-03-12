const recipeContainer = document.querySelector('.recipe');

import * as model from '../js/model';
import recipeView from '../js/views/recipeView';
import resultView from '../js/views/resultView';
import searchBar from '../js/views/searchBar';
import bookmarkView from '../js/views/bookmarkView';
import addRecipes from '../js/views/Addrecipe';

import paginationView from '../js/views/paginationView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // console.log(id);
    bookmarkView.render(model.state.bookmarked);
    resultView.render(model.getSearchResultPage());

    //load recipe
    await model.loadReciep(id);
    recipeView.render(model.state.recipes);
  } catch (err) {
    recipeView.errorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    // 1.load search recipe
    const query = searchBar.getQuery();
    if (!query) throw new Error(err);
    await model.loadSearchResult(query);
    //2.load search recipe
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    resultView.errorMessage();
  }
};

const controlPagination = function (goToPage) {
  resultView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (numberOfServings) {
  model.updateServings(numberOfServings);
  recipeView.render(model.state.recipes);
  console.log(model.state.recipes);
};

const controlBookmark = function () {
  if (!model.state.recipes.booked) model.bookmarkRecipe(model.state.recipes);
  else model.removeBookmark(model.state.recipes.id);
  // model.removeBookmark(model.state.recipes);
  recipeView.render(model.state.recipes);
  bookmarkView.render(model.state.bookmarked);
  // console.log(model.state.recipes);
  // console.log(model.state.bookmarked);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipes.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipes);
    recipeView.render(model.state.recipes);

    bookmarkView.render(model.state.bookmarked);

    window.history.pushState(null, '', `#${model.state.recipes.id}`);
    addRecipes.renderMessage();
    setTimeout(() => {
      addRecipes.toggleWindow();
      setTimeout(() => {
        addRecipes.addUploadForm();
      }, 1000);
    }, 2500);
  } catch (err) {
    addRecipes.errorMessage(err);
  }
};

const init = function () {
  recipeView.addHandlerView(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchBar.addHandlerField(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);

  addRecipes.addHandlerAddRecipe(controlAddRecipe);
};

init();
