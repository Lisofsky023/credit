//= feedbackFormServices.js
//= feedbackFormUI.js
//= feedbackFormSubmit.js

const phoneMask = setupPhoneNumberMask();
const emailMask = setupEmailMask();

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("feedbackFormScreen");
  const formFields = ["lastName", "firstName", "phoneNumber", "email"];

  formFields.forEach(fieldId => {
      document.getElementById(fieldId).addEventListener("input", validateFormFields);
  });

  form.addEventListener("submit", function(event) {
      event.preventDefault();
      submitFeedbackForm(phoneMask, emailMask);
  });

  document.getElementById('toFeedbackFormButton').addEventListener('click', function() {
      document.getElementById('calculatorScreen').classList.add('hidden');
      document.getElementById('feedbackFormScreen').classList.remove('hidden');
  });

  document.getElementById('backToCalculator').addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('feedbackFormScreen').classList.add('hidden');
      document.getElementById('calculatorScreen').classList.remove('hidden');
  });

  loadFeedbackFormFromLocalStorage(phoneMask, emailMask);
  validateFormFields(phoneMask, emailMask);
  
});


