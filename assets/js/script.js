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
const recipeIngEl = document.getElementById(`recipe-ingredients`);
const recipePicEl = document.getElementById(`recipe-picture`);
const createdRecipesEl = document.getElementById(`recipe-buttons`);
const createdButtonsEl = document.getElementsByClassName(`created-buttons`);
const recipeSumBoxEl = document.getElementById(`recipe-info-container`);
const ytVidEl = document.getElementById(`yt-video`);

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
  if(newSearch === 1) {
    for(let i = 0; i < data.length; i++) {
      let name = data[i].title;
      let recipeId = data[i].id;
      let listEl = document.createElement(`li`);
      let buttonEl = document.createElement(`button`);
      // buttonEl.setAttribute(`type`, `button`);
      buttonEl.textContent = name;
      buttonEl.setAttribute(`id`, recipeId);
      buttonEl.classList = `created-buttons`;
      listEl.appendChild(buttonEl);
      createdRecipesEl.appendChild(listEl);
    }
  }

  //make buttons display info when clicked
  buttonInit();
}

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

  recipeNameEl.textContent = rName;
  recipePicEl.setAttribute(`src`, rImage);

  let recipeInfo = document.createElement('p');
  recipeInfo.innerHTML = summary;
  recipeSumBoxEl.appendChild(recipeInfo);
  
  let infoEl = document.createElement(`p`);
  infoEl.innerHTML = instructions;
  recipeInfoEl.appendChild(infoEl);

  ytAPICaller(rName);
}

function embedVid(data) {

  // let imgFrame = document.getElementById(`figure`);
  let vidId = data.items[0].id.videoId;
  // console.log(vidId);

  let ytLink = `https://www.youtube.com/embed/` + vidId;
  // console.log(ytLink);

  ytVidEl.setAttribute(`src`, ytLink);
}

//api caller when form is submitted
function spoonAPICallerInit(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        // console.log(data);
        //id:videoID gives youtube.com/watch?v=[videoID]
        // createRecipeInfo(data);
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

//api caller when button is clicked
function spoonAPICallerButton(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        console.log(data);
        //id:videoID gives youtube.com/watch?v=[videoID]
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

function ytAPICaller(data) {

// let ytQuery = data + ` recipe`;
let ytQuery = data;
// console.log(ytQuery);

let apiURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${ytQuery}&topicId=Food&key=${ytAPIKey}`;

fetch(apiURL)
.then(function(response) {
  if(response.ok) {
    response.json().then(function(data) {
      console.log(data);
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

    newSearch = 1;
    
    let apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${spoonInput}&number=5&apiKey=${spoonAPIKey}`;

    closeModal();
    inputEl.value = ``;

    spoonAPICallerInit(apiURL);
  }
});

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