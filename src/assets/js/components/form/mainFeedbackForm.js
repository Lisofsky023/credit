//= feedbackFormServices.js
//= feedbackFormUI.js
//= feedbackFormSubmit.js

const phoneMask = setupPhoneNumberMask();
const emailMask = setupEmailMask();

// Выносим элементы DOM в переменные
const feedbackFormScreen = document.getElementById('feedbackFormScreen');
const calculatorScreen = document.getElementById('calculatorScreen');
const toFeedbackFormButton = document.getElementById('toFeedbackFormButton');
const backToCalculator = document.getElementById('backToCalculator');

const formFieldsElements = [
  "lastName", 
  "firstName", 
  "phoneNumber", 
  "email"
].map(id => document.getElementById(id));

document.addEventListener("DOMContentLoaded", () => {
  formFieldsElements.forEach(fieldElement => {
      fieldElement.addEventListener("input", validateFormFields);
  });

  feedbackFormScreen.addEventListener("submit", (event) => {
      event.preventDefault();
      submitFeedbackForm(phoneMask, emailMask);
  });

  toFeedbackFormButton.addEventListener('click', () => {
      calculatorScreen.classList.add('hidden');
      feedbackFormScreen.classList.remove('hidden');
  });

  backToCalculator.addEventListener('click', (event) => {
      event.preventDefault();
      feedbackFormScreen.classList.add('hidden');
      calculatorScreen.classList.remove('hidden');
  });

  loadFeedbackFormFromLocalStorage(phoneMask, emailMask);
  validateFormFields(phoneMask, emailMask);
});
