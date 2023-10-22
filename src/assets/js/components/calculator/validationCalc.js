document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('feedbackFormScreen').classList.add('hidden');

  loadFromLocalStorage();
  checkFieldsAndSetButtonState();
  updateLabelColors();

  const inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm', 'middleName'];
  inputFields.forEach(id => {
      const inputElement = document.getElementById(id);
      const labelElement = inputElement.nextElementSibling;
  
      inputElement.addEventListener('focus', function() {
          if (this.value.trim() === '') {
              labelElement.style.color = 'red';
          }
      });
  
      inputElement.addEventListener('blur', function() {
          if (this.value.trim() === '') {
              labelElement.style.color = 'transparent';
          }
      });
  
      inputElement.addEventListener('input', function() {
          if (isValidValue(parseFloat(this.value))) {
              this.classList.remove('error');
              this.classList.add('valid');
              labelElement.style.color = 'purple';
          } else {
              this.classList.remove('valid');
              this.classList.add('error');
              labelElement.style.color = 'red';
          }
          saveToLocalStorage();
          checkFieldsAndSetButtonState();
      });
  });

  document.getElementById('toFeedbackFormButton').addEventListener('click', function () {
      document.getElementById('calculatorScreen').classList.add('hidden');
      document.getElementById('feedbackFormScreen').classList.remove('hidden');
  });
  document.getElementById('backToCalculator').addEventListener('click', function() {
      document.getElementById('feedbackFormScreen').classList.add('hidden');
      document.getElementById('calculatorScreen').classList.remove('hidden');
  });
});
