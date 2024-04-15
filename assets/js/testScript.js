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
const createdRecipesEl = document.getElementById(`recipe-buttons`);

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

function createButtons(data) {
  for(let i = 0; i < data.length; i++) {
    let name = data[i].title;
    let listEl = document.createElement(`li`);
    let buttonEl = document.createElement(`button`);
    buttonEl.textContent = name;
    listEl.appendChild(buttonEl);
    createdRecipesEl.appendChild(listEl);
  }
}

function createRecipeInfo(data) {
  let rName = data[0].title;
  let rImage = data[0].image;
  let otherIng = [];
  let nameIng = data[0].usedIngredients[0].original;

  for(let i = 0; i < data[0].missedIngredients.length; i++) {
    otherIng.push(data[0].missedIngredients[i].original);
  }

  // console.log(nameIng);
  // console.log(otherIng);

  recipeNameEl.textContent = rName;
  recipePicEl.setAttribute(`src`, rImage);
  
  let namedIng = document.createElement(`p`);
  namedIng.textContent = nameIng
  recipeInfoEl.appendChild(namedIng);

  for(let j = 0; j < otherIng.length; j++) {
    let missedIng = document.createElement(`p`);
    missedIng.textContent = otherIng[j];
    recipeInfoEl.appendChild(missedIng);
  }
}


function spoonAPICaller(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        console.log(data);
        //id:videoID gives youtube.com/watch?v=[videoID]
        createRecipeInfo(data);
        createButtons(data);
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
