import { AJAX } from './helpers';
import { RES_PER_PAGE, API_KEY, API_URL } from './config';

export const state = {
  recipes: {},
  search: {
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },

  bookmarked: [],
};

const createRecipeObject = function (data) {
  const recipe = data.data.recipe;

  return {
    id: recipe.id,
    image: recipe.image_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadReciep = async function (id) {
  try {
    const data = await AJAX(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=${API_KEY}`
    );

    state.recipes = createRecipeObject(data);
    if (state.bookmarked.some(bookmark => bookmark.id === id))
      state.recipes.booked = true;
    else state.recipes.booked = false;

    // console.log(state.recipes);
    // console.log(state.bookmarked);
  } catch (err) {
    // console.error(`${err}...oops!!`);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=${API_KEY}`
    );

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(`the query is ${query}`);
    state.search.page = 1;
  } catch (err) {
    // console.error(err);
    console.log(err);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  //1-10 index 0 -9
  // 2  10 - 20
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipes.ingredients.forEach(ing => {
    ing.quantity = (newServings * ing.quantity) / state.recipes.servings;
  });

  state.recipes.cookingTime = Math.floor(
    (newServings * state.recipes.cookingTime) / state.recipes.servings
  );

  state.recipes.servings = newServings;
};

const presistLocalStorage = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarked));
};

export const bookmarkRecipe = function (recipe) {
  if (!state.bookmarked.some(bookmark => bookmark.id === recipe.id))
    state.bookmarked.push(recipe);
  // if (recipe.id === state.recipes.id)
  if (recipe.id === state.recipes.id) state.recipes.booked = true;
  presistLocalStorage();
};

export const removeBookmark = function (id) {
  const removeRecId = state.bookmarked.findIndex(rec => {
    return rec.id === id;
  });
  state.bookmarked.splice(removeRecId, 1);
  if (id === state.recipes.id) state.recipes.booked = false;
  // console.log(`${id} cancelled!!`);
  presistLocalStorage();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Please insert 3 values!');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipes = createRecipeObject(data);
    // state.recipes.bookmarked = true;
    bookmarkRecipe(state.recipes);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const local = localStorage.getItem('bookmark');
  if (local) state.bookmarked = JSON.parse(local);
};

// console.log(state.bookmarked);

init();

const clearLocal = function () {
  localStorage.clear();
};

clearLocal();
