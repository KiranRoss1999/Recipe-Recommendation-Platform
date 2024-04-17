const ytAPIKey = 'AIzaSyCawopGL82AFkgjtzzGG56lw1ZIb4HZcmQ';
const spoonAPIKey = `7a974e772bec455da7a065c595ebe2b3`;
// const spoonAPIKey = "07b90ac4c2c44b42b5f99c3bc714f49e";

//modal stuff
const modalEl = document.getElementById(`search-modal`);
const modalButton = document.getElementById(`modal-button`);
const modalClose = document.getElementById(`close-modal`);
const formClose = document.getElementById(`close-form`);

//form stuff
const inputEl = document.getElementById(`input-ingredient`);
const formEl = document.getElementById(`search-form`);
const selectEl = document.getElementById(`search-select`);
const addIngEl = document.getElementById(`add-ingredient-button`);
const formInputsDivEl = document.getElementById(`form-inputs`);
const isVegetarianEl = document.getElementById(`vegetarian-check`);

//recipe displays
const recipeNameEl = document.getElementById(`recipe-name`);
const recipeInfoEl = document.getElementById(`recipe-info`);
const recipeIngEl = document.getElementById(`recipe-ingredients`);
const recipePicEl = document.getElementById(`recipe-picture`);
const recipeSumBoxEl = document.getElementById(`recipe-info-container`);
const ytVidEl = document.getElementById(`yt-video`);

//created buttons
const createdRecipesEl = document.getElementById(`recipe-buttons`);
const createdButtonsEl = document.getElementsByClassName(`created-buttons`);

//amount of extra ingredients allowed to be added
const maxAdd = 2;
let clicked = 0;

//vegetarian checker
let vegCheck = 0;

let recipeNames = JSON.parse(localStorage.getItem(`recipes`));
if(recipeNames === null) {
  recipeNames = [];
}

function saveRecipes (recipes) {
  localStorage.setItem(`recipes`, JSON.stringify(recipes));
}

//function opens modal
function openModal() {
  modalEl.classList.add(`is-active`);
}

//function closes modal
function closeModal() {
  modalEl.classList.remove(`is-active`);
}

//show modal on clicking right button
modalButton.addEventListener(`click`, function(event) {
  // console.log(`it clicked`);
  openModal();
  clearInputs();
  clicked = 0;
});

//close modal on click the x icon
modalClose.addEventListener(`click`, function(event) {
  closeModal();
});

//close modal on clicking cancel button on form
formClose.addEventListener(`click`, function(event) {
  closeModal();
});

//creating buttons with recipe names from ingredient search
function createButtonsIng(data) {
  
  for(let i = 0; i < data.length; i++) {
    let name = data[i].title;
    let recipeId = data[i].id;
    let listEl = document.createElement(`li`);
    let buttonEl = document.createElement(`button`);

    buttonEl.textContent = name;
    buttonEl.setAttribute(`id`, recipeId);
    buttonEl.classList = `created-buttons`;

    listEl.appendChild(buttonEl);
    createdRecipesEl.appendChild(listEl);
  }

  //make buttons display info when clicked
  buttonInit();
}

//creating buttons with recipe names from recipe search
function createButtonsRecipe(data) {

  for(let i = 0; i < data.results.length; i++) {
    let name = data.results[i].title;
    let recipeId = data.results[i].id;
    let listEl = document.createElement(`li`);
    let buttonEl = document.createElement(`button`);

    buttonEl.textContent = name;
    buttonEl.setAttribute(`id`, recipeId);
    buttonEl.classList = `created-buttons`;

    listEl.appendChild(buttonEl);
    createdRecipesEl.appendChild(listEl);
  }

  buttonInit();
}

//clearing display to make room for a new display call
function clearDisplay() {

  // console.log(recipeIngEl.childNodes);
  let ingLength = recipeInfoEl.childNodes.length
  for(let i = 0; i < ingLength; i++) {
    recipeIngEl.childNodes[i].remove();
  }

  // console.log(recipeInfoEl.childNodes);
  let infoLength = recipeInfoEl.childNodes.length;
  for(let j = 0; j < infoLength; j++) {
    recipeInfoEl.childNodes[j].remove();
  }

  // console.log(recipeSumBoxEl.childNodes);
  let sumLength = recipeSumBoxEl.childNodes.length;
  for(let k = 2; k < sumLength; k++) {
    recipeSumBoxEl.childNodes[k].remove();
  }

}

//clearing buttons when a new search is submitted
function clearButtons() {

  while(createdRecipesEl.firstChild) {
    createdRecipesEl.firstChild.remove();
  }
}

//displaying recipe info
function createRecipeInfo(data) {
  let rName = data.title;
  let rImage = data.image;
  let instructions = data.instructions;
  let summary = data.summary;

  // console.log(summary);

  for(let i = 0; i < data.extendedIngredients.length; i++) {
    let instEl = document.createElement(`p`);
    instEl.textContent = data.extendedIngredients[i].original;
    recipeIngEl.appendChild(instEl);
  }
  recipeIngEl.classList = `box`;

  recipeNameEl.textContent = rName;
  recipePicEl.setAttribute(`src`, rImage);

  let recipeInfo = document.createElement('p');
  recipeInfo.innerHTML = summary;
  recipeSumBoxEl.appendChild(recipeInfo);
  recipeSumBoxEl.classList = `box`;
  
  let infoEl = document.createElement(`p`);
  infoEl.innerHTML = instructions;
  recipeInfoEl.appendChild(infoEl);
  recipeInfoEl.classList = `box`;

  ytAPICaller(rName);
}

//pushing the video onto youtube. we just grab the first result from the api call
function embedVid(data) {

  let vidId = data.items[0].id.videoId;
  // console.log(vidId);

  let ytLink = `https://www.youtube.com/embed/` + vidId;
  // console.log(ytLink);

  ytVidEl.setAttribute(`src`, ytLink);
}

//api caller when form is submitted and ingredients is selected
function spoonAPICallerIng(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        // console.log(data);
        createButtonsIng(data);
      });
    } else {
      alert(`Error: ${response.statusText}`);
    }
  })
  .catch(function(error) {
    alert(`Unable to connect to API`);
  });
}

//api caller when form is submitted and recipe name is selected
function spoonAPiCallerRecipe(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        // console.log(data);
        createButtonsRecipe(data);
      });
    } else {
      alert(`Error: ${response.statusText}`);
    }
  })
  .catch(function(error) {
    alert(`Unable to connect to API`);
  });
}

//api caller when button is clicked
function spoonAPICallerButton(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        // console.log(data);
        clearDisplay();
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

//api caller for youtube
function ytAPICaller(data) {

let ytQuery = data;
// console.log(ytQuery);

let apiURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${ytQuery}&topicId=Food&key=${ytAPIKey}`;

fetch(apiURL)
.then(function(response) {
  if(response.ok) {
    response.json().then(function(data) {
      // console.log(data);
      embedVid(data);
    });
  } else {
    alert(`Error: ${response.statusText}`);
  }
})
.catch(function(error) {
  alert(`Unable to connect to API`);
});

}

//function for when form is submitted
formEl.addEventListener(`submit`, function(event) {
  event.preventDefault();

  // console.log(inputEl.value);

  if(!inputEl.value) {
    console.log(`Nothing entered`);
    closeModal();
    inputEl.value = ``;
  } else {
    clicked = 0;
    // console.log(inputEl.value);
    let spoonInput = inputEl.value;

    // console.log(selectEl.value);
    if(isVegetarianEl.checked) {
      // console.log(`its checked`);
      vegCheck = 1;
    } else {
      vegCheck = 0;
      // console.log(`its not checked`);
    }

    //calling api depending on selector
    if(selectEl.value === `By Ingredient`) {
      // console.log(`it matches ingredient`);
      if(vegCheck = 1) {
        let apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${spoonInput}&include-tags=vegetarian&number=5&apiKey=${spoonAPIKey}`;
        clearButtons();
        spoonAPICallerIng(apiURL);
      } else {
        let apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${spoonInput}&number=5&apiKey=${spoonAPIKey}`;
        clearButtons();
        spoonAPICallerIng(apiURL);
      }
      
    } else if(selectEl.value === `By Recipe Name`) {
      // console.log(`it matches recipe name`);
      if(vegCheck = 1) {
        let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${spoonInput}&include-tags=vegetarian&number=5&apiKey=${spoonAPIKey}`;
        clearButtons();
        spoonAPiCallerRecipe(apiURL);
      } else {
        let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${spoonInput}&number=5&apiKey=${spoonAPIKey}`;
        clearButtons();
        spoonAPiCallerRecipe(apiURL);
      }
    } else {
      console.log(`it doesnt match`);
    }
    
    closeModal();
    inputEl.value = ``;


  }
});

//function for when created buttons are clicked
function buttonInit() {

  for(let i = 0; i < createdButtonsEl.length; i++) {
    createdButtonsEl[i].addEventListener(`click`, function(event) {
      // console.log(`it works`);

      let recipeId = createdButtonsEl[i].id;

      let buttonIDAPI = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonAPIKey}`;

      spoonAPICallerButton(buttonIDAPI);

      // console.log(recipeId);
    
    });
  }
  // console.log(createdButtonsEl.length);
}

//make extra inputs
function addInput() {
  let inputId = `input` + clicked;
  let input = document.createElement(`input`);
  input.classList = `input`;
  input.setAttribute(`type`, `text`);
  input.setAttribute(`id`, inputId);

  formInputsDivEl.appendChild(input);    
}

//clear extra inputs on new search
function clearInputs() {

  if(formInputsDivEl.children[2]) {
    // console.log(formInputsDivEl.children[2]);
    formInputsDivEl.children[2].remove();
  }

  if(formInputsDivEl.children[1]) {
    // console.log(formInputsDivEl.children[1]);
    formInputsDivEl.children[1].remove();
  }

  // console.log(formInputsDivEl.childElementCount);
}

addIngEl.addEventListener(`click`, function(event) {

  event.preventDefault();

  // console.log(`button clicked`);
  if(selectEl.value === `By Ingredient`) {
    // console.log(`its works`);

    if(clicked < maxAdd) {
      addInput();
      clicked++;
    } else {
      console.log(`Max extra ingridients is 3`);
    }
  }

});