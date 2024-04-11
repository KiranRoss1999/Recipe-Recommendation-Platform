let popupEl = document.querySelector('#INSERT ID HERE');

// CREATE NON-NATIVE POPUP FOR WHEN FILTERS ARE EMPTY
function renderPopup(event)
event.preventDefault();
console.log(event);

if (usernameInput.value === "") {
  alert("Please give yourself a username!"); // REPLACE WITH NON-NATIVE POPUP NOT ALERT (SHOW/HIDE METHODS)
};
popupEl.addEventListener("click", renderPopup);


// FUNCTION TO RETRIEVE USER DATA FROM LOCAL STORAGE
function storeUser() {
    // add loop for array to make sure each blog is added and not replaced
  
    let newUser = {
      userName: usernameInput.value,
    };
  
    let userData = JSON.parse(localStorage.getItem("NAME OF LOCAL")) ?? [];
  
    userData.push(newUser);
  
    console.log(userData);
    let userDataStringedUp = JSON.stringify(userData);
    localStorage.setItem("NAME", userDataStringedUp);
};

  // CREATE SUBMIT FILTER OPTION FUNCTION
  // TEXTBOX FOR FOOD NAME
  // DROPDOWN FOR FILTER
