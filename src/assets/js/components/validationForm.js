document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("feedbackFormScreen");
  const formFields = ["lastName", "firstName", "phoneNumber", "email"];
  let mask;
  const phoneNumberElement = document.getElementById('phoneNumber');
  if(phoneNumberElement) {
      const maskOptions = {
          mask: '+{7}(000)000-00-00'
      };
      mask = IMask(phoneNumberElement, maskOptions);
  }

  const emailElement = document.getElementById('email');
  if(emailElement) {
      const emailMaskOptions = {
          mask: /^\S*@?\S*$/
      };
      const emailMask = IMask(emailElement, emailMaskOptions);
  }

  formFields.forEach(fieldId => {
      document.getElementById(fieldId).addEventListener("input", validateFormFields);
  });

  function validateFormFields() {
      formFields.forEach(fieldId => {
          const inputElement = document.getElementById(fieldId);
          const labelElement = inputElement.nextElementSibling;
          const value = (fieldId === 'phoneNumber') ? mask.value : inputElement.value;

          if (value.trim() === '') {
              inputElement.classList.add('error');
              inputElement.classList.remove('valid');
              labelElement.style.color = 'red';
          } else {
              inputElement.classList.remove('error');
              inputElement.classList.add('valid');
              labelElement.style.color = 'purple';
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
  }

  form.addEventListener("submit", function(event) {
      event.preventDefault();

      const formData = {
          lastName: document.getElementById('lastName').value,
          firstName: document.getElementById('firstName').value,
          middleName: document.getElementById('middleName').value,
          phoneNumber: mask.value,
          email: document.getElementById('email').value,
          loanAmount: document.getElementById('loanAmount').value,
          initialPayment: document.getElementById('initialPayment').value,
          interestRate: document.getElementById('interestRate').value,
          loanTerm: document.getElementById('loanTerm').value,
          monthlyPayment: document.getElementById('monthlyPaymentResult').innerText
      };

      fetch('http://localhost/request', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Ошибка сети или сервера');
          }
          return response.json();
      })
      .then(data => {
          if (data.success) {
              alert('Данные успешно отправлены!');
          } else {
              alert('Произошла ошибка при отправке данных!');
          }
      })
      .catch(error => {
          console.error('Ошибка:', error);
          alert('Произошла ошибка при отправке данных!');
      });
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
});
