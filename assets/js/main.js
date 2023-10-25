"use strict";

var isIntegerValue = function isIntegerValue(value) {
  return Number.isInteger(value);
};
var isValidValue = function isValidValue(value) {
  var checkInteger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return value > 0 && (!checkInteger || isIntegerValue(value));
};
var isValidLoanTerm = function isValidLoanTerm(value) {
  return value > 0 && isIntegerValue(value);
};
function calculateMonthlyPayment() {
  var loanAmountElement = document.getElementById('loanAmount');
  var initialPaymentElement = document.getElementById('initialPayment');
  var interestRateElement = document.getElementById('interestRate');
  var loanTermElement = document.getElementById('loanTerm');
  var loanAmount = parseFloat(loanAmountElement.value) || 0;
  var initialPayment = parseFloat(initialPaymentElement.value) || 0;
  var interestRateYearly = (parseFloat(interestRateElement.value) || 0) / 100;
  var loanTermYears = parseInt(loanTermElement.value) || 0;
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
  var loanAmountElement = document.getElementById('loanAmount');
  var initialPaymentElement = document.getElementById('initialPayment');
  var interestRateElement = document.getElementById('interestRate');
  var loanTermElement = document.getElementById('loanTerm');
  var monthlyPaymentResultElement = document.getElementById('monthlyPaymentResult');
  var data = JSON.parse(localStorage.getItem('calculatorData'));
  if (data) {
    loanAmountElement.value = data.loanAmount || "";
    initialPaymentElement.value = data.initialPayment || "";
    interestRateElement.value = data.interestRate || "";
    loanTermElement.value = data.loanTerm || "";
    monthlyPaymentResultElement.innerText = data.monthlyPaymentResult || "";
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
  var loanAmountElement = document.getElementById('loanAmount');
  var initialPaymentElement = document.getElementById('initialPayment');
  var interestRateElement = document.getElementById('interestRate');
  var loanTermElement = document.getElementById('loanTerm');
  var monthlyPaymentResultElement = document.getElementById('monthlyPaymentResult');
  var toFeedbackFormButtonElement = document.getElementById('toFeedbackFormButton');
  if (loanAmountElement.value.trim() !== "" && isValidValue(parseFloat(loanAmountElement.value), true) && isValidValue(parseFloat(initialPaymentElement.value), true) && isValidValue(parseFloat(interestRateElement.value) / 100) && isValidLoanTerm(parseInt(loanTermElement.value))) {
    var monthlyPayment = calculateMonthlyPayment();
    monthlyPaymentResultElement.innerText = "".concat(monthlyPayment, " \u20BD");
    toFeedbackFormButtonElement.removeAttribute('disabled');
  } else {
    toFeedbackFormButtonElement.setAttribute('disabled', 'disabled');
  }
}
document.addEventListener('DOMContentLoaded', function () {
  var calculatorScreen = document.getElementById('calculatorScreen');
  var feedbackFormScreen = document.getElementById('feedbackFormScreen');
  var toFeedbackFormButton = document.getElementById('toFeedbackFormButton');
  var backToCalculatorButton = document.getElementById('backToCalculator');
  var inputFieldsIds = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm', 'middleName'];
  feedbackFormScreen.classList.add('hidden');
  loadFromLocalStorage();
  checkFieldsAndSetButtonState();
  updateLabelColors();
  inputFieldsIds.forEach(function (id) {
    var inputElement = document.getElementById(id);
    var labelElement = inputElement.nextElementSibling;
    inputElement.addEventListener('focus', function () {
      if (inputElement.value.trim() === '') {
        labelElement.style.color = 'red';
      }
    });
    inputElement.addEventListener('blur', function () {
      if (inputElement.value.trim() === '') {
        labelElement.style.color = 'transparent';
      }
    });
    inputElement.addEventListener('input', function () {
      if (isValidValue(parseFloat(inputElement.value))) {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        labelElement.style.color = 'purple';
      } else {
        inputElement.classList.remove('valid');
        inputElement.classList.add('error');
        labelElement.style.color = 'red';
      }
      saveToLocalStorage();
      checkFieldsAndSetButtonState();
    });
  });
  toFeedbackFormButton.addEventListener('click', function () {
    calculatorScreen.classList.add('hidden');
    feedbackFormScreen.classList.remove('hidden');
  });
  backToCalculatorButton.addEventListener('click', function () {
    feedbackFormScreen.classList.add('hidden');
    calculatorScreen.classList.remove('hidden');
  });
});
function setupPhoneNumberMask() {
  var phoneNumberElement = document.getElementById('phoneNumber');
  var localMask;
  if (phoneNumberElement) {
    var maskOptions = {
      mask: '+{7}(000)000-00-00'
    };
    localMask = IMask(phoneNumberElement, maskOptions);
    var labelElement = phoneNumberElement.nextElementSibling;
    phoneNumberElement.addEventListener('input', function () {
      var unmaskedValue = localMask.unmaskedValue;
      if (!unmaskedValue || unmaskedValue.length !== 11 || localMask.value.includes('_')) {
        phoneNumberElement.classList.add('error');
        phoneNumberElement.classList.remove('valid');
        labelElement.style.color = 'red';
      } else {
        phoneNumberElement.classList.remove('error');
        phoneNumberElement.classList.add('valid');
        labelElement.style.color = 'purple';
      }
    });
  }
  return localMask;
}
function setupEmailMask() {
  var emailElement = document.getElementById('email');
  var localMask;
  if (emailElement) {
    var emailMaskOptions = {
      mask: /^\S*@?\S*$/
    };
    localMask = IMask(emailElement, emailMaskOptions);
  }
  return localMask;
}
function saveFeedbackFormToLocalStorage(phoneMask) {
  var lastNameElement = document.getElementById('lastName');
  var firstNameElement = document.getElementById('firstName');
  var middleNameElement = document.getElementById('middleName');
  var emailElement = document.getElementById('email');
  var data = {
    lastName: lastNameElement.value,
    firstName: firstNameElement.value,
    middleName: middleNameElement.value,
    phoneNumber: phoneMask ? phoneMask.value : "",
    email: emailElement.value
  };
  localStorage.setItem('feedbackFormData', JSON.stringify(data));
}
function loadFeedbackFormFromLocalStorage(phoneMask, emailMask) {
  var lastNameElement = document.getElementById('lastName');
  var firstNameElement = document.getElementById('firstName');
  var middleNameElement = document.getElementById('middleName');
  var emailElement = document.getElementById('email');
  var data = JSON.parse(localStorage.getItem('feedbackFormData'));
  if (data) {
    lastNameElement.value = data.lastName || "";
    firstNameElement.value = data.firstName || "";
    middleNameElement.value = data.middleName || "";
    if (phoneMask && phoneMask.updateValue) {
      phoneMask.value = data.phoneNumber || "";
      phoneMask.updateValue();
    }
    if (emailMask && emailMask.updateValue) {
      emailElement.value = data.email || "";
      emailMask.updateValue();
    }
  }
}
function validateFormFields(phoneMask, emailMask) {
  var formFields = ["lastName", "firstName", "middleName", "email"]; // Убран "phoneNumber"
  var minimumChars = {
    "lastName": 3,
    "firstName": 3,
    "middleName": 3
  };
  formFields.forEach(function (fieldId) {
    var inputElement = document.getElementById(fieldId);
    var labelElement = inputElement.nextElementSibling;
    labelElement.style.color = 'transparent';
    var updateStyles = function updateStyles() {
      var value = inputElement.value;
      if (fieldId === 'email') {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          inputElement.classList.add('error');
          inputElement.classList.remove('valid');
          labelElement.style.color = 'red';
          return;
        }
      }
      if (value && value.trim() !== '' && (!minimumChars[fieldId] || value.length >= minimumChars[fieldId])) {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        labelElement.style.color = 'purple';
      } else {
        inputElement.classList.add('error');
        inputElement.classList.remove('valid');
        labelElement.style.color = 'red';
      }
    };
    inputElement.addEventListener('focus', function () {
      labelElement.style.color = 'red';
      updateStyles();
    });
    inputElement.addEventListener('blur', function () {
      if (inputElement.value.trim() === '') {
        labelElement.style.color = 'transparent';
      }
    });
    inputElement.addEventListener('input', updateStyles);
  });
  saveFeedbackFormToLocalStorage();
}
function submitFeedbackForm(phoneMask, emailMask) {
  var formData = {
    lastName: document.getElementById('lastName').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    phoneNumber: phoneMask.value,
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
var phoneMask = setupPhoneNumberMask();
var emailMask = setupEmailMask();

// Выносим элементы DOM в переменные
var feedbackFormScreen = document.getElementById('feedbackFormScreen');
var calculatorScreen = document.getElementById('calculatorScreen');
var toFeedbackFormButton = document.getElementById('toFeedbackFormButton');
var backToCalculator = document.getElementById('backToCalculator');
var formFieldsElements = ["lastName", "firstName", "phoneNumber", "email"].map(function (id) {
  return document.getElementById(id);
});
document.addEventListener("DOMContentLoaded", function () {
  formFieldsElements.forEach(function (fieldElement) {
    fieldElement.addEventListener("input", validateFormFields);
  });
  feedbackFormScreen.addEventListener("submit", function (event) {
    event.preventDefault();
    submitFeedbackForm(phoneMask, emailMask);
  });
  toFeedbackFormButton.addEventListener('click', function () {
    calculatorScreen.classList.add('hidden');
    feedbackFormScreen.classList.remove('hidden');
  });
  backToCalculator.addEventListener('click', function (event) {
    event.preventDefault();
    feedbackFormScreen.classList.add('hidden');
    calculatorScreen.classList.remove('hidden');
  });
  loadFeedbackFormFromLocalStorage(phoneMask, emailMask);
  validateFormFields(phoneMask, emailMask);
});