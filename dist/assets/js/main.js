"use strict";

function isIntegerValue(value) {
  return Number.isInteger(value);
}
function isValidValue(value) {
  var checkInteger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return value > 0 && (!checkInteger || isIntegerValue(value));
}
function isValidLoanTerm(value) {
  return value > 0 && value <= 5 && isIntegerValue(value);
}
function calculateMonthlyPayment() {
  var loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
  var initialPayment = parseFloat(document.getElementById('initialPayment').value) || 0;
  var interestRateYearly = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
  var loanTermYears = parseInt(document.getElementById('loanTerm').value) || 0;
  if (!isValidValue(loanAmount, true) || !isValidValue(initialPayment, true) || !isValidValue(interestRateYearly) || !isValidLoanTerm(loanTermYears)) {
    return 0;
  }
  var interestRateMonthly = interestRateYearly / 12;
  var loanTermMonths = loanTermYears * 12;
  var monthlyPayment = (loanAmount - initialPayment) * Math.pow(1 + interestRateMonthly, loanTermMonths) * interestRateMonthly / (Math.pow(1 + interestRateMonthly, loanTermMonths) - 1);
  return monthlyPayment < 0 ? 0 : monthlyPayment.toFixed(2);
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
function updateLabelColors() {
  var inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
  inputFields.forEach(function (id) {
    var inputElement = document.getElementById(id);
    var labelElement = inputElement.nextElementSibling;
    if (isValidValue(parseFloat(inputElement.value))) {
      labelElement.style.color = 'purple';
    } else if (inputElement.value.trim() === '') {
      labelElement.style.color = 'transparent';
    } else {
      labelElement.style.color = 'red';
    }
  });
}
function checkFieldsAndSetButtonState() {
  var inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
  if (inputFields.every(function (id) {
    return document.getElementById(id).value.trim() !== "";
  }) && isValidValue(parseFloat(document.getElementById('loanAmount').value), true) && isValidValue(parseFloat(document.getElementById('initialPayment').value), true) && isValidValue(parseFloat(document.getElementById('interestRate').value) / 100) && isValidLoanTerm(parseInt(document.getElementById('loanTerm').value))) {
    var monthlyPayment = calculateMonthlyPayment();
    document.getElementById('monthlyPaymentResult').innerText = "".concat(monthlyPayment, " \u20BD");
    document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
  } else {
    document.getElementById('toFeedbackFormButton').setAttribute('disabled', 'disabled');
  }
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('feedbackFormScreen').classList.add('hidden');
  loadFromLocalStorage();
  checkFieldsAndSetButtonState();
  updateLabelColors();
  var inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm', 'middleName'];
  inputFields.forEach(function (id) {
    var inputElement = document.getElementById(id);
    var labelElement = inputElement.nextElementSibling;
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
var mask;
function setupPhoneNumberMask() {
  var phoneNumberElement = document.getElementById('phoneNumber');
  if (phoneNumberElement) {
    var maskOptions = {
      mask: '+{7}(000)000-00-00'
    };
    mask = IMask(phoneNumberElement, maskOptions);
  }
}
function setupEmailMask() {
  var emailElement = document.getElementById('email');
  if (emailElement) {
    var emailMaskOptions = {
      mask: /^\S*@?\S*$/
    };
    var emailMask = IMask(emailElement, emailMaskOptions);
  }
}
function saveFeedbackFormToLocalStorage() {
  var data = {
    lastName: document.getElementById('lastName').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    phoneNumber: mask.value,
    email: document.getElementById('email').value
  };
  localStorage.setItem('feedbackFormData', JSON.stringify(data));
}
function loadFeedbackFormFromLocalStorage() {
  var data = JSON.parse(localStorage.getItem('feedbackFormData'));
  if (data) {
    document.getElementById('lastName').value = data.lastName || "";
    document.getElementById('firstName').value = data.firstName || "";
    document.getElementById('middleName').value = data.middleName || "";
    if (mask) {
      mask.value = data.phoneNumber || "";
      mask.updateValue();
    }
    document.getElementById('email').value = data.email || "";
  }
}
function validateFormFields() {
  var formFields = ["lastName", "firstName", "phoneNumber", "email"];
  formFields.forEach(function (fieldId) {
    var inputElement = document.getElementById(fieldId);
    var labelElement = inputElement.nextElementSibling;
    var value = fieldId === 'phoneNumber' ? mask.value : inputElement.value;
    if (value.trim() !== '') {
      inputElement.classList.remove('error');
      inputElement.classList.add('valid');
      labelElement.style.color = 'purple';
    } else {
      inputElement.classList.add('error');
      inputElement.classList.remove('valid');
      labelElement.style.color = 'red';
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
  saveFeedbackFormToLocalStorage();
}
function submitFeedbackForm() {
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
}
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("feedbackFormScreen");
  var formFields = ["lastName", "firstName", "phoneNumber", "email"];
  setupPhoneNumberMask();
  setupEmailMask();
  formFields.forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("input", validateFormFields);
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitFeedbackForm();
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
  loadFeedbackFormFromLocalStorage();
  validateFormFields();
});