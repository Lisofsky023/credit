//= components/validationForm.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('feedbackFormScreen').classList.add('hidden');
    function isValidValue(value) {
        return value > 0;
    }

    function calculateMonthlyPayment() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const initialPayment = parseFloat(document.getElementById('initialPayment').value) || 0;
        const interestRateYearly = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
        const loanTermYears = parseInt(document.getElementById('loanTerm').value) || 0;

        if (!isValidValue(loanAmount) || !isValidValue(interestRateYearly) || !isValidValue(loanTermYears)) {
            return 0;
        }

        const interestRateMonthly = interestRateYearly / 12;
        const loanTermMonths = loanTermYears * 12;

        const monthlyPayment = ((loanAmount - initialPayment) * Math.pow((1 + interestRateMonthly), loanTermMonths) * interestRateMonthly) / (Math.pow((1 + interestRateMonthly), loanTermMonths) - 1);

        return monthlyPayment < 0 ? 0 : monthlyPayment;
    }

    function saveToLocalStorage() {
        const data = {
            loanAmount: document.getElementById('loanAmount').value,
            initialPayment: document.getElementById('initialPayment').value,
            interestRate: document.getElementById('interestRate').value,
            loanTerm: document.getElementById('loanTerm').value,
            monthlyPaymentResult: document.getElementById('monthlyPaymentResult').innerText
        };
        localStorage.setItem('calculatorData', JSON.stringify(data));
    }
    

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('calculatorData'));
    
        if (data) {
            document.getElementById('loanAmount').value = data.loanAmount || "";
            document.getElementById('initialPayment').value = data.initialPayment || "";
            document.getElementById('interestRate').value = data.interestRate || "";
            document.getElementById('loanTerm').value = data.loanTerm || "";
            document.getElementById('monthlyPaymentResult').innerText = data.monthlyPaymentResult || "";
        }
    }
    
    const inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
    
    function checkFieldsAndSetButtonState() {
        if (allFieldsFilled() && inputFields.every(id => isValidValue(parseFloat(document.getElementById(id).value)))) {
            const monthlyPayment = calculateMonthlyPayment();
            document.getElementById('monthlyPaymentResult').innerText = `${monthlyPayment.toFixed(2)} ₽`;
            document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
        } else {
            document.getElementById('monthlyPaymentResult').innerText = "Ошибка ввода";
            document.getElementById('toFeedbackFormButton').setAttribute('disabled', 'disabled');
        }
    }

    loadFromLocalStorage();
    checkFieldsAndSetButtonState();

    inputFields.forEach(id => {
        const inputElement = document.getElementById(id);
        const labelElement = inputElement.nextElementSibling; // предполагается, что label следует сразу после input
    
        if (inputElement) {
            inputElement.addEventListener('focus', function() {
                if (this.value.trim() === '') {
                    labelElement.style.color = 'red';
                }
            });
    
            inputElement.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    labelElement.style.color = 'transparent'; // скрываем label
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
        }
    });
    
    
    
    
    function allFieldsFilled() {
        return inputFields.every(id => {
            const inputElement = document.getElementById(id);
            return inputElement && inputElement.value.trim() !== '';
        });
    }
    
    document.getElementById('toFeedbackFormButton').addEventListener('click', function () {
        document.getElementById('calculatorScreen').classList.add('hidden');
        document.getElementById('feedbackFormScreen').classList.remove('hidden');
    });
    document.getElementById('backToCalculator').addEventListener('click', function() {
        document.getElementById('feedbackFormScreen').classList.add('hidden');
        document.getElementById('calculatorScreen').classList.remove('hidden');
    });
  });
  