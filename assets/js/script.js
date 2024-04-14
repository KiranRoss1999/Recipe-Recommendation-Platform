const ytAPIKey = 'AIzaSyCawopGL82AFkgjtzzGG56lw1ZIb4HZcmQ';
const spoonAPIKey = `7a974e772bec455da7a065c595ebe2b3`;
const formYTEl = document.getElementById(`yt-form`);
const formSpoonEl = document.getElementById(`spoon-form`);
const ytInputEl = document.getElementById(`yt-input`);
const spoonInputEl = document.getElementById(`spoon-input`);
const spoonDropEl = document.getElementById(`spoon-dropdown`);
const cardContainer = document.getElementById(`card-container`);

let recipeNames = JSON.parse(localStorage.getItem(`recipes`));
if(recipeNames === null) {
  recipeNames = [];
}

function saveRecipes (recipes) {
  localStorage.setItem(`recipes`, JSON.stringify(recipes));
}

spoonDropEl.addEventListener(`change`, function(event) {
  if(event.target.value === `By Nutrition`) {
    console.log(`it works`);
  } 
});

function createCard(data) {
  for(let i = 0; i < data.length; i++) {
    let name = data[i].title;
    // console.log(name);
    recipeNames.push(name);
    saveRecipes(recipeNames);

    let imgUrl = data[i].image;
    // console.log(imgUrl);

    let cardBody = document.createElement(`div`);

    let cardTitle = document.createElement(`h3`);
    cardTitle.textContent = name;
    cardBody.appendChild(cardTitle);

    let cardImg = document.createElement(`img`);
    cardImg.src = imgUrl;
    cardBody.appendChild(cardImg);

    let cardURL = document.createElement(`a`);
    cardURL.href = 

    cardContainer.appendChild(cardBody);
  }
}

function ytLinkAdder(link){
  let linkURL = `youtube.com/watch?v=` + link;
}


formSpoonEl.addEventListener(`submit`, function(event) {
  event.preventDefault();

  let spoonInput = spoonInputEl.value;
  // let spoonInput = [];

  let apiURLRecipeByIngredients = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${spoonInput}&number=5&apiKey=${spoonAPIKey}`;

  // spoonAPICaller(apiURLRecipeByIngredients);

//  for(let i = 0; i < recipeNames.length; i++) {
//   console.log(recipeNames[i]);
//  }

  ytAPICaller(recipeNames);
});

function ytAPICaller(recipes) {
  let qName = recipes;
  // console.log(qName);
    // let apiURL = `https://www.googleapis.com/youtube/v3/search?topicId=food&part=snippet&q=%23%23${ytInput}&key=${ytAPIKey}`;


  for(let i = 0; i < qName.length; i++) {

    let apiURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${qName[i]}&topicId=Food&key=${ytAPIKey}`;
    // console.log(apiURL);

    fetch(apiURL)
    .then(function(response) {
      if(response.ok) {
        response.json().then(function(data) {
          // console.log(data);
          //id:videoID gives youtube.com/watch?v=[videoID]

        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
    .catch(function(error) {
    alert(`Unable to connect to API`);
    });
  }

}

function spoonAPICaller(url) {
  fetch(url)
  .then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        // console.log(data);
        //id:videoID gives youtube.com/watch?v=[videoID]
        createCard(data);
      });
    } else {
      alert(`Error: ${response.statusText}`);
    }
  })
  .catch(function(error) {
    alert(`Unable to connect to API`);
  });
}

