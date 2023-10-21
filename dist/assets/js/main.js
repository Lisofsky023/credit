"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var constraints = {
    lastName: {
      presence: true,
      length: {
        minimum: 3,
        message: "должна содержать не менее 3 символов"
      }
    },
    firstName: {
      presence: true,
      length: {
        minimum: 3,
        message: "должно содержать не менее 3 символов"
      }
    },
    phoneNumber: {
      presence: true,
      format: {
        pattern: /^\d{10}$/,
        message: "должен содержать 10 цифр"
      }
    },
    email: {
      presence: true,
      email: {
        message: "не является корректным адресом электронной почты"
      }
    }
  };
  var form = document.getElementById("feedbackFormScreen");
  var submitButton = document.getElementById("submitForm");
  var formFields = ["lastName", "firstName", "phoneNumber", "email"];
  formFields.forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("input", validateFormFields);
  });
  function validateFormFields() {
    var formValues = {
      lastName: document.getElementById("lastName").value,
      firstName: document.getElementById("firstName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      email: document.getElementById("email").value
    };
    var validationErrors = validate(formValues, constraints);
    handleFormErrors(validationErrors);
    if (validationErrors) {
      submitButton.setAttribute("disabled", "disabled");
    } else {
      submitButton.removeAttribute("disabled");
    }
  }
  function handleFormErrors(errors) {
    formFields.forEach(function (field) {
      var errorElement = document.getElementById(field + "Error");
      if (errors && errors[field]) {
        errorElement.textContent = errors[field][0];
      } else {
        errorElement.textContent = "";
      }
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var validationErrors = validateFormFields();
    if (!validationErrors) {
      var formData = {
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
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Ошибка сети или сервера');
        }
        return response.json();
      }).then(function (data) {
        if (data.success) {
          alert('Данные успешно отправлены!');
        } else {
          alert('Произошла ошибка при отправке данных!');
        }
      })["catch"](function (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке данных!');
      });
    }
  });
  document.getElementById('toFeedbackFormButton').addEventListener('click', function () {
    document.getElementById('calculatorScreen').classList.add('hidden');
    document.getElementById('feedbackFormScreen').classList.remove('hidden');
  });
  document.getElementById('backToCalculator').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('feedbackFormScreen').classList.add('hidden');
    document.getElementById('calculatorScreen').classList.remove('hidden');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('feedbackFormScreen').classList.add('hidden');
  function calculateMonthlyPayment() {
    var loanAmount = parseFloat(document.getElementById('loanAmount').value);
    var initialPayment = parseFloat(document.getElementById('initialPayment').value);
    var interestRateYearly = parseFloat(document.getElementById('interestRate').value) / 100;
    var loanTermYears = parseInt(document.getElementById('loanTerm').value);
    var interestRateMonthly = interestRateYearly / 12;
    var loanTermMonths = loanTermYears * 12;
    return (loanAmount - initialPayment) * Math.pow(1 + interestRateMonthly, loanTermMonths) * interestRateMonthly / (Math.pow(1 + interestRateMonthly, loanTermMonths) - 1);
  }
  function saveToLocalStorage() {
    localStorage.setItem('loanAmount', document.getElementById('loanAmount').value);
    localStorage.setItem('initialPayment', document.getElementById('initialPayment').value);
    localStorage.setItem('interestRate', document.getElementById('interestRate').value);
    localStorage.setItem('loanTerm', document.getElementById('loanTerm').value);
  }
  document.getElementById('calculateButton').addEventListener('click', function () {
    var monthlyPayment = calculateMonthlyPayment();
    document.getElementById('monthlyPaymentResult').innerText = "".concat(monthlyPayment.toFixed(2), " \u20BD");
    document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
    saveToLocalStorage();
  });
  var ids = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm', 'monthlyPaymentResult'];
  ids.forEach(function (id) {
    var element = document.getElementById(id);
    var value = localStorage.getItem(id);
    if (value !== null && element) {
      element.value = value;
    }
    if (element) {
      element.addEventListener('change', function () {
        localStorage.setItem(id, this.value);
      });
    }
  });
  document.getElementById('toFeedbackFormButton').addEventListener('click', function () {
    document.getElementById('calculatorScreen').classList.add('hidden');
    document.getElementById('feedbackFormScreen').classList.remove('hidden');
  });
  document.getElementById('backToCalculator').addEventListener('click', function () {
    document.getElementById('feedbackFormScreen').classList.add('hidden');
    document.getElementById('calculatorScreen').classList.remove('hidden');
  });
});