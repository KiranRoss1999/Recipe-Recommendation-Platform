//api keys
const ytAPIKey = "AIzaSyCawopGL82AFkgjtzzGG56lw1ZIb4HZcmQ";
// const ytAPIKey = `AIzaSyB8JunYZS0Tfsbqfzs5h2nSe-k9L1AgVGI`;

// const spoonAPIKey = `7a974e772bec455da7a065c595ebe2b3`;
// const spoonAPIKey = `69a78db739a642a7872981d09f236e5a`;
// const spoonAPIKey = `dc0bf729c1574eea929baf3fa523b239`;
const spoonAPIKey = `6fd0fad522364dd69dd61639b15aa659`;
// const spoonAPIKey = `75fbd3ac66284b7e9e621722cddc49f9`;

const mitraAPIKey = "07b90ac4c2c44b42b5f99c3bc714f49e";

//modal stuff
const modalEl = document.getElementById(`search-modal`);
const modalButton = document.getElementById(`modal-button`);
const modalClose = document.getElementById(`close-modal`);
const formClose = document.getElementById(`close-form`);
const vegetarianDivEl = document.getElementById(`vegetarian-div`);

//form stuff
const inputEl = document.getElementById(`input-ingredient`);
const formEl = document.getElementById(`search-form`);
const selectEl = document.getElementById(`search-select`);
const addIngEl = document.getElementById(`add-ingredient-button`);
const addIngDivEl = document.getElementById(`ing-button-div`);
const formInputsDivEl = document.getElementById(`form-inputs`);
const isVegetarianEl = document.getElementById(`vegetarian-check`);

//extra ingredients selectors
const ingredientEl = document.getElementsByClassName(`input`);

//recipe displays
const recipeNameEl = document.getElementById(`recipe-name`);
const recipeInfoEl = document.getElementById(`recipe-info`);
const recipeIngEl = document.getElementById(`recipe-ingredients`);
const recipePicEl = document.getElementById(`recipe-picture`);
const recipeSumBoxEl = document.getElementById(`recipe-info-container`);
const ytVidEl = document.getElementById(`yt-video`);
const favButtonEl = document.getElementById(`fav-button`);
const favDivEl = document.getElementById(`favourites`);
const recipeSummaryEl = document.getElementById(`recipe-summary`);

//created buttons
const createdRecipesEl = document.getElementById(`recipe-buttons`);
const createdButtonsEl = document.getElementsByClassName(`created-buttons`);

//dark mode toggles
const modeBtn = document.querySelector("#mode-toggle");
const bodyEl = document.querySelector("body");
modeBtn.addEventListener("click", function () {
  bodyEl.classList.toggle("inverted-colors");
  const pageMode = bodyEl.classList.contains("inverted-colors")
    ? "inverted"
    : "normal";
  localStorage.setItem("mode", pageMode);
  if (bodyEl.classList.contains("inverted-colors")) {
    bodyEl.style.backgroundColor = "var(--dark0)";
  } else {
    bodyEl.style.backgroundColor = "var(--primary-color)";
  }
  modeBtn.textContent = bodyEl.classList.contains("inverted-colors")
    ? "☀️"
    : "🌙";
});

function init() {
  const pageMode = localStorage.getItem("mode");
  if (pageMode === "inverted") {
    bodyEl.classList.add("inverted-colors");
    bodyEl.style.backgroundColor = "var(--dark0)";
    modeBtn.textContent = "🌙";
  }
}
init();

//amount of extra ingredients allowed to be added
const maxAdd = 2;
let clicked = 0;

//local data checker
let matched = 0;

//recipe tracker for button clicks
let displayedRecipe = {
  id: ``,
  name: ``,
};

//grabbing and stored data
let savedRecipes = JSON.parse(localStorage.getItem(`recipes`));
if(savedRecipes === null) {
  savedRecipes = [];
}

//function opens modal
function openModal() {
  modalEl.classList.add(`is-active`);
}

//function closes modal
function closeModal() {
  modalEl.classList.remove(`is-active`);
}

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

//function for when created buttons are clicked
function buttonInit() {

  // console.log(createdButtonsEl);

  for(let i = 0; i < createdButtonsEl.length; i++) {
    createdButtonsEl[i].addEventListener(`click`, function(event) {
      // console.log(`it works`);

      let recipeId = createdButtonsEl[i].id;

      let buttonIDAPI = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonAPIKey}`;

      clearDisplay();
      spoonAPICallerButton(buttonIDAPI);

      // console.log(recipeId);
    
    });
  }
  // console.log(createdButtonsEl.length);
}

//displaying recipe info
function createRecipeInfo(data) {
  let rName = data.title;
  let rImage = data.image;
  let instructions = data.instructions;
  let summary = data.summary;

  // console.log(summary);

  displayedRecipe = {
    id: data.id,
    name: rName, 
  };

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
  recipeSummaryEl.appendChild(recipeInfo);
  recipeSummaryEl.classList = `box`;
  
  let infoEl = document.createElement(`p`);
  infoEl.innerHTML = instructions;
  recipeInfoEl.appendChild(infoEl);
  recipeInfoEl.classList = `box`;

  // ytAPICaller(rName);

  favButtonEl.classList.remove(`is-invisible`);

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
        // clearDisplay();
        createRecipeInfo(data);
        // console.log(displayedRecipe);
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

//make extra inputs for extra ingredients
function addInput() {
  let inputId = `input` + clicked;
  let input = document.createElement(`input`);
  input.classList = `input`;
  input.setAttribute(`type`, `text`);
  input.setAttribute(`id`, inputId);

  formInputsDivEl.appendChild(input);
}

//clearing display to make room for a new display call
function clearDisplay() {

  while(recipeIngEl.firstChild) {
    recipeIngEl.firstChild.remove();
  }

  while(recipeInfoEl.firstChild) {
    recipeInfoEl.firstChild.remove();
  }

  // console.log(recipeSummaryEl.firstChild);
  while(recipeSummaryEl.firstChild) {
    recipeSummaryEl.firstChild.remove();
  }
}

//clearing buttons when a new search is submitted
function clearButtons() {

  while(createdRecipesEl.firstChild) {
    createdRecipesEl.firstChild.remove();
  }
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

//storing recipe id to local storage if favourited
function favouriteRecipe() {

  for(let i = 0; i <savedRecipes.length; i++) {
    if(savedRecipes[i].id === displayedRecipe.id) {
      matched = 1;
    }
  }

  if(matched === 0) {
    savedRecipes.push(displayedRecipe);

    localStorage.setItem(`recipes`, JSON.stringify(savedRecipes));

    //create a button
    let favButtonEl = document.createElement(`button`);
    favButtonEl.classList = `button created-buttons`;
    favButtonEl.setAttribute(`id`, displayedRecipe.id);
    favButtonEl.textContent = displayedRecipe.name;

    let favLiEl = document.createElement(`li`);
    favLiEl.appendChild(favButtonEl);
    favDivEl.appendChild(favLiEl);

    buttonInit();
  } else {
    console.log(`Recipe already saved.`);
    matched = 0;
  }
} 

//displaying favourited recipes
function displayFavouritesOnStartup() {

  // console.log(savedRecipes);

  for(let i = 0; i < savedRecipes.length; i++ ) {


    let favButtonEl = document.createElement(`button`);
    favButtonEl.classList = `button created-buttons is-clipped is-link`;
    favButtonEl.setAttribute(`id`, savedRecipes[i].id);
    favButtonEl.textContent = savedRecipes[i].name;

    let favLiEl = document.createElement(`li`);
    favLiEl.appendChild(favButtonEl);
    favDivEl.appendChild(favLiEl);
  }

  buttonInit();
}

//show modal on clicking right button
modalButton.addEventListener(`click`, function(event) {
  // console.log(`it clicked`);
  openModal();
  clearInputs();

  //reset extra ingredient count
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

//adds extra inputs if user wants to add more ingredients
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

//hiding buttons if irrelevent to selector
selectEl.addEventListener(`change`, function(event) {
  if(selectEl.value === `By Recipe Name`) {
    vegetarianDivEl.classList.remove(`is-invisible`);
    addIngDivEl.classList = `is-invisible`;
  }

  if(selectEl.value === `By Ingredient`) {
    addIngDivEl.classList.remove(`is-invisible`);
    vegetarianDivEl.classList = `is-invisible`;
  }
})

//displaying info if a favourited recipe is clicked
favButtonEl.addEventListener(`click`, function(event) {

  // console.log(displayedRecipe);

  if(event.target) {
    // console.log(savedRecipes);
    favouriteRecipe();
  }
});

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

    //calling api depending on selector
    if(selectEl.value === `By Ingredient`) {
      // console.log(`it matches ingredient`);

      //checking if extra ingredients were added
      if(ingredientEl.length > 1) {
        for(let i = 1; i < ingredientEl.length; i++) {
          // console.log(ingredientEl[i].value);
          
          let extraIng = `,+` + ingredientEl[i].value;
          // console.log(extraIng);
          spoonInput = spoonInput.concat(extraIng);
          // console.log(newString);
        }
      }

      let apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${spoonInput}&number=5&apiKey=${spoonAPIKey}`;
      
      clearButtons();
      spoonAPICallerIng(apiURL);
      
    } else if(selectEl.value === `By Recipe Name`) {
      // console.log(`it matches recipe name`);
      if(isVegetarianEl.checked) {
        let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${spoonInput}&diet=vegetarian&number=5&apiKey=${spoonAPIKey}`;
        clearButtons();
        spoonAPiCallerRecipe(apiURL);
        // console.log(`vegetarian checked`);
        // console.log(apiURL);
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


displayFavouritesOnStartup();

// function with a clear button attached not working
function displayFavouritesOnStartupClear() {

  //   // console.log(savedRecipes);
  
  //   for(let i = 0; i < savedRecipes.length; i++ ) {
  
  
  //     let favButtonEl = document.createElement(`button`);
  //     favButtonEl.classList = `button created-buttons is-clipped fav-buttons`;
  //     favButtonEl.setAttribute(`id`, savedRecipes[i].id);
  //     favButtonEl.textContent = savedRecipes[i].name;
  
  //     let favDelEl = document.createElement(`button`);
  //     favDelEl.classList = `button del-buttons`;
  //     favDelEl.setAttribute(`id`, savedRecipes[i].id);
  //     favDelEl.textContent = `Clear`;
  
  //     let buttonDiv = document.createElement(`div`);
  //     buttonDiv.classList = `buttons has-addons`;
  
  //     buttonDiv.appendChild(favButtonEl);
  //     buttonDiv.appendChild(favDelEl);
  
  
  //     // let favLiEl = document.createElement(`li`);
  //     // favLiEl.appendChild(buttonDiv);
  //     favDivEl.appendChild(buttonDiv);
  //   }
  
  //   buttonInit();
}
  
//carousel js
function displayCarousel() {
  let randomAPI = `https://api.spoonacular.com/recipes/random?number=13&apiKey=${mitraAPIKey}`;

  fetch(randomAPI)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then(function (data) {
      console.log(data);
      carouselData(data);
    })
    .catch(function (error) {
      console.log(
        "There was a problem with the fetch operation: ",
        error.message
      );
    });
}

function carouselData(data) {
  const imgEl = document.getElementsByClassName("imgs");
  const titleEl = document.getElementById("recipeTitle");
  console.log(imgEl);

  for (let i = 0; i < data.recipes.length; i++) {
    const imageUrl = data.recipes[i].image;
    const titleName = data.recipes[i].title;

    imgEl[i].setAttribute("src", imageUrl);
    imgEl[i].setAttribute("data-title", titleName);
    titleEl.textContent = titleName;
  }
}

const TrendingSlider = new Swiper(".trending-slider", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    scale: 1,
    stretch: 0,
    depth: 50,
    modifier: 2.5,
  },
});

// displayCarousel();

// CHANGING THE PAGES FUNCTIONS FOR NAVBAR
const aboutUsPage = document.querySelector("#aboutUsPage");
const homePage = document.querySelector("#homePage");
const contactPage = document.querySelector("#contactPage");
const gitHubPage = document.querySelector("#gitPage");

// Doing reload method instead as it is the same page
homePage.addEventListener("click", function (event) {
  window.location.reload();
});

aboutUsPage.addEventListener("click", function (event) {
  window.location.href = "./about-us.html";
});

contactPage.addEventListener("click", function (event) {
  window.location.href = "./contact-page.html";
});

// Linking to our GitHub Repo for the Project ! :D
gitHubPage.addEventListener("click", function (event) {
  window.location.href =
    "https://github.com/KiranRoss1999/Recipe-Recommendation-Platform";
});