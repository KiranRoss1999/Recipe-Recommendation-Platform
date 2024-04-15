const ytAPIKey = 'AIzaSyCawopGL82AFkgjtzzGG56lw1ZIb4HZcmQ';
const spoonAPIKey = `7a974e772bec455da7a065c595ebe2b3`;

const modalEl = document.getElementById(`search-modal`);
const modalButton = document.getElementById(`modal-button`);
const modalClose = document.getElementById(`close-modal`);
const formClose = document.getElementById(`close-form`);
const inputEl = document.getElementById(`input-ingredient`);
const formEl = document.getElementById(`search-form`);
const recipeNameEl = document.getElementById(`recipe-name`);
const recipeInfoEl = document.getElementById(`recipe-info`);
const recipePicEl = document.getElementById(`recipe-picture`);

let recipeNames = JSON.parse(localStorage.getItem(`recipes`));
if(recipeNames === null) {
  recipeNames = [];
}

function saveRecipes (recipes) {
  localStorage.setItem(`recipes`, JSON.stringify(recipes));
}

function openModal() {
  modalEl.classList.add(`is-active`);
}

function closeModal() {
  modalEl.classList.remove(`is-active`);
}

modalButton.addEventListener(`click`, function(event) {
  // console.log(`it clicked`);
  openModal();
});

modalClose.addEventListener(`click`, function(event) {
  closeModal();
});

formClose.addEventListener(`click`, function(event) {
  closeModal();
});

function createRecipeInfo(data) {
  let rName = data[0].title;
  let rImage = data[0].image;

  // console.log(rName);
  // console.log(rImage);

  recipeNameEl.textContent = rName;
  recipePicEl.setAttribute(`src`, rImage);
}


function spoonAPICaller(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        console.log(data);
        //id:videoID gives youtube.com/watch?v=[videoID]
        createRecipeInfo(data);
      });
    } else {
      alert(`Error: ${response.statusText}`);
    }
  })
  .catch(function(error) {
    alert(`Unable to connect to API`);
  });
}



formEl.addEventListener(`submit`, function(event) {
  event.preventDefault();

  // console.log(inputEl.value);

  if(!inputEl.value) {
    console.log(`nothign entered`);
    closeModal();
    inputEl.value = ``;
  } else {
    // console.log(inputEl.value);
    let spoonInput = inputEl.value;
    
    let apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${spoonInput}&number=5&apiKey=${spoonAPIKey}`;

    closeModal();
    inputEl.value = ``;

    spoonAPICaller(apiURL);
  }
});
