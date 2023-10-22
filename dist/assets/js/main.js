"use strict";

document.addEventListener("DOMContentLoaded", function () {
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
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
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
    var loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    var initialPayment = parseFloat(document.getElementById('initialPayment').value) || 0;
    var interestRateYearly = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
    var loanTermYears = parseInt(document.getElementById('loanTerm').value) || 0;
    if (loanAmount === 0 || interestRateYearly === 0 || loanTermYears === 0) {
      return 0;
    }
    var interestRateMonthly = interestRateYearly / 12;
    var loanTermMonths = loanTermYears * 12;
    var monthlyPayment = (loanAmount - initialPayment) * Math.pow(1 + interestRateMonthly, loanTermMonths) * interestRateMonthly / (Math.pow(1 + interestRateMonthly, loanTermMonths) - 1);
    return monthlyPayment < 0 ? 0 : monthlyPayment;
  }
  function saveToLocalStorage() {
    var data = {
      loanAmount: document.getElementById('loanAmount').value,
      initialPayment: document.getElementById('initialPayment').value,
      interestRate: document.getElementById('interestRate').value,
      loanTerm: document.getElementById('loanTerm').value,
      monthlyPaymentResult: document.getElementById('monthlyPaymentResult').innerText
    };
    localStorage.setItem('calculatorData', JSON.stringify(data));
  }
  function loadFromLocalStorage() {
    var data = JSON.parse(localStorage.getItem('calculatorData'));
    if (data) {
      document.getElementById('loanAmount').value = data.loanAmount || "";
      document.getElementById('initialPayment').value = data.initialPayment || "";
      document.getElementById('interestRate').value = data.interestRate || "";
      document.getElementById('loanTerm').value = data.loanTerm || "";
      document.getElementById('monthlyPaymentResult').innerText = data.monthlyPaymentResult || "";
    }
  }
  loadFromLocalStorage();
  var inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
  inputFields.forEach(function (id) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.addEventListener('input', function () {
        if (allFieldsFilled()) {
          var monthlyPayment = calculateMonthlyPayment();
          document.getElementById('monthlyPaymentResult').innerText = "".concat(monthlyPayment.toFixed(2), " \u20BD");
          document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
        }
        saveToLocalStorage();
      });
    }
  });
  function allFieldsFilled() {
    return inputFields.every(function (id) {
      var inputElement = document.getElementById(id);
      return inputElement && inputElement.value.trim() !== '';
    });
  }
  document.getElementById('toFeedbackFormButton').addEventListener('click', function () {
    document.getElementById('calculatorScreen').classList.add('hidden');
    document.getElementById('feedbackFormScreen').classList.remove('hidden');
  });
  document.getElementById('backToCalculator').addEventListener('click', function () {
    document.getElementById('feedbackFormScreen').classList.add('hidden');
    document.getElementById('calculatorScreen').classList.remove('hidden');
  });
});