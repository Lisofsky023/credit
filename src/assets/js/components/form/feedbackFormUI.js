function validateFormFields() {
  const formFields = ["lastName", "firstName", "phoneNumber", "email"];
  formFields.forEach(fieldId => {
      const inputElement = document.getElementById(fieldId);
      const labelElement = inputElement.nextElementSibling;
      const value = (fieldId === 'phoneNumber') ? mask.value : inputElement.value;

      if (value.trim() !== '') {
          inputElement.classList.remove('error');
          inputElement.classList.add('valid');
          labelElement.style.color = 'purple';
      } else {
          inputElement.classList.add('error');
          inputElement.classList.remove('valid');
          labelElement.style.color = 'red';
      }

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
  });
  saveFeedbackFormToLocalStorage();
}
