"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("feedbackFormScreen");
  var formFields = ["lastName", "firstName", "phoneNumber", "email"];
  var mask;
  var phoneNumberElement = document.getElementById('phoneNumber');
  if (phoneNumberElement) {
    var maskOptions = {
      mask: '+{7}(000)000-00-00'
    };
    mask = IMask(phoneNumberElement, maskOptions);
  }
  var emailElement = document.getElementById('email');
  if (emailElement) {
    var emailMaskOptions = {
      mask: /^\S*@?\S*$/
    };
    var emailMask = IMask(emailElement, emailMaskOptions);
  }
  formFields.forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("input", validateFormFields);
  });
  function validateFormFields() {
    formFields.forEach(function (fieldId) {
      var inputElement = document.getElementById(fieldId);
      var labelElement = inputElement.nextElementSibling;
      var value = fieldId === 'phoneNumber' ? mask.value : inputElement.value;
      if (value.trim() === '') {
        inputElement.classList.add('error');
        inputElement.classList.remove('valid');
        labelElement.style.color = 'red';
      } else {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        labelElement.style.color = 'purple';
      }
      inputElement.addEventListener('focus', function () {
        if (this.value.trim() === '') {
          labelElement.style.color = 'red';
        }
      });
      inputElement.addEventListener('blur', function () {
        if (this.value.trim() === '') {
          labelElement.style.color = 'transparent';
        }
      });
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = {
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
  function isValidValue(value) {
    return value > 0;
  }
  function calculateMonthlyPayment() {
    var loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    var initialPayment = parseFloat(document.getElementById('initialPayment').value) || 0;
    var interestRateYearly = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
    var loanTermYears = parseInt(document.getElementById('loanTerm').value) || 0;
    if (!isValidValue(loanAmount) || !isValidValue(interestRateYearly) || !isValidValue(loanTermYears)) {
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
  var inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
  function checkFieldsAndSetButtonState() {
    if (allFieldsFilled() && inputFields.every(function (id) {
      return isValidValue(parseFloat(document.getElementById(id).value));
    })) {
      var monthlyPayment = calculateMonthlyPayment();
      document.getElementById('monthlyPaymentResult').innerText = "".concat(monthlyPayment.toFixed(2), " \u20BD");
      document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
    } else {
      document.getElementById('monthlyPaymentResult').innerText = "Ошибка ввода";
      document.getElementById('toFeedbackFormButton').setAttribute('disabled', 'disabled');
    }
  }
  loadFromLocalStorage();
  checkFieldsAndSetButtonState();
  inputFields.forEach(function (id) {
    var inputElement = document.getElementById(id);
    var labelElement = inputElement.nextElementSibling; // предполагается, что label следует сразу после input

    if (inputElement) {
      inputElement.addEventListener('focus', function () {
        if (this.value.trim() === '') {
          labelElement.style.color = 'red';
        }
      });
      inputElement.addEventListener('blur', function () {
        if (this.value.trim() === '') {
          labelElement.style.color = 'transparent'; // скрываем label
        }
      });

      inputElement.addEventListener('input', function () {
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