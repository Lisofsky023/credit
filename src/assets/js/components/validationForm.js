document.addEventListener("DOMContentLoaded", function() {

  const form = document.getElementById("feedbackFormScreen");
  const submitButton = document.getElementById("submitForm");
  const formFields = ["lastName", "firstName", "phoneNumber", "email"];

  formFields.forEach(fieldId => {
    document.getElementById(fieldId).addEventListener("input", validateFormFields);
  });

  function validateFormFields() {
    const formValues = {
      lastName: document.getElementById("lastName").value,
      firstName: document.getElementById("firstName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      email: document.getElementById("email").value
    };
  }

  form.addEventListener("submit", function(event) {
    event.preventDefault(); 

      const formData = {
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
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

  document.getElementById('toFeedbackFormButton').addEventListener('click', function () {
    document.getElementById('calculatorScreen').classList.add('hidden');
    document.getElementById('feedbackFormScreen').classList.remove('hidden');
  });

  document.getElementById('backToCalculator').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('feedbackFormScreen').classList.add('hidden');
    document.getElementById('calculatorScreen').classList.remove('hidden');
  });

});

    

