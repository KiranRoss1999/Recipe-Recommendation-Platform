const modalEl = document.getElementById(`search-modal`);
const modalButton = document.getElementById(`modal-button`);
const modalClose = document.getElementById(`close-modal`);
const formClose = document.getElementById(`close-form`);
const inputEl = document.getElementById(`input-ingredient`);
const formEl = document.getElementById(`search-form`);

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

formEl.addEventListener(`submit`, function(event) {
  event.preventDefault();

  // console.log(inputEl.value);
  
  if(!inputEl.value) {
    console.log(`nothign entered`);
    closeModal();
  } else {
    console.log(inputEl.value);
    closeModal();
  }
});
