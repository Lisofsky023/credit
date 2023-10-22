//= components/validationForm.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('feedbackFormScreen').classList.add('hidden');

    function isIntegerValue(value) {
        return Number.isInteger(value);
    }

    function isValidValue(value, checkInteger = false) {
        return value > 0 && (!checkInteger || isIntegerValue(value));
    }

    function isValidLoanTerm(value) {
        return value > 0 && value <= 5 && isIntegerValue(value);
    }

    function calculateMonthlyPayment() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const initialPayment = parseFloat(document.getElementById('initialPayment').value) || 0;
        const interestRateYearly = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
        const loanTermYears = parseInt(document.getElementById('loanTerm').value) || 0;

        if (!isValidValue(loanAmount, true) || 
            !isValidValue(initialPayment, true) || 
            !isValidValue(interestRateYearly) || 
            !isValidLoanTerm(loanTermYears)) {
            return 0;
        }

        const interestRateMonthly = interestRateYearly / 12;
        const loanTermMonths = loanTermYears * 12;

        const monthlyPayment = ((loanAmount - initialPayment) * Math.pow((1 + interestRateMonthly), loanTermMonths) * interestRateMonthly) / 
                               (Math.pow((1 + interestRateMonthly), loanTermMonths) - 1);

        return monthlyPayment < 0 ? 0 : monthlyPayment.toFixed(2);
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

    function updateLabelColors() {
        const inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
        inputFields.forEach(id => {
            const inputElement = document.getElementById(id);
            const labelElement = inputElement.nextElementSibling;
    
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
        const inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
        if (inputFields.every(id => document.getElementById(id).value.trim() !== "") && 
            isValidValue(parseFloat(document.getElementById('loanAmount').value), true) && 
            isValidValue(parseFloat(document.getElementById('initialPayment').value), true) &&
            isValidValue(parseFloat(document.getElementById('interestRate').value) / 100) &&
            isValidLoanTerm(parseInt(document.getElementById('loanTerm').value))) {

            const monthlyPayment = calculateMonthlyPayment();
            document.getElementById('monthlyPaymentResult').innerText = `${monthlyPayment} ₽`;
            document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
        } else {
            document.getElementById('toFeedbackFormButton').setAttribute('disabled', 'disabled');
        }
    }

    loadFromLocalStorage();
    checkFieldsAndSetButtonState();
    updateLabelColors();

    const inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];
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
