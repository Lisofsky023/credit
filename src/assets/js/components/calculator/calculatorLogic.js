const isIntegerValue = value => Number.isInteger(value);

const isValidValue = (value, checkInteger = false) => value > 0 && (!checkInteger || isIntegerValue(value));

const isValidLoanTerm = value => value > 0 && isIntegerValue(value);

function calculateMonthlyPayment() {
    const loanAmountElement = document.getElementById('loanAmount');
    const initialPaymentElement = document.getElementById('initialPayment');
    const interestRateElement = document.getElementById('interestRate');
    const loanTermElement = document.getElementById('loanTerm');
    
    const loanAmount = parseFloat(loanAmountElement.value) || 0;
    const initialPayment = parseFloat(initialPaymentElement.value) || 0;
    const interestRateYearly = (parseFloat(interestRateElement.value) || 0) / 100;
    const loanTermYears = parseInt(loanTermElement.value) || 0;

    if (!isValidValue(loanAmount, true) || 
        !isValidValue(initialPayment, true) || 
        !isValidValue(interestRateYearly) || 
        !isValidLoanTerm(loanTermYears)) {
        return 0;
    }

    const interestRateMonthly = interestRateYearly / 12;
    const loanTermMonths = loanTermYears * 12;
    const monthlyPayment = ((loanAmount - initialPayment) * Math.pow((1 + interestRateMonthly), loanTermMonths) * interestRateMonthly) / (Math.pow((1 + interestRateMonthly), loanTermMonths) - 1);

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
    const loanAmountElement = document.getElementById('loanAmount');
    const initialPaymentElement = document.getElementById('initialPayment');
    const interestRateElement = document.getElementById('interestRate');
    const loanTermElement = document.getElementById('loanTerm');
    const monthlyPaymentResultElement = document.getElementById('monthlyPaymentResult');
    
    const data = JSON.parse(localStorage.getItem('calculatorData'));
  
    if (data) {
        loanAmountElement.value = data.loanAmount || "";
        initialPaymentElement.value = data.initialPayment || "";
        interestRateElement.value = data.interestRate || "";
        loanTermElement.value = data.loanTerm || "";
        monthlyPaymentResultElement.innerText = data.monthlyPaymentResult || "";
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
    const loanAmountElement = document.getElementById('loanAmount');
    const initialPaymentElement = document.getElementById('initialPayment');
    const interestRateElement = document.getElementById('interestRate');
    const loanTermElement = document.getElementById('loanTerm');
    const monthlyPaymentResultElement = document.getElementById('monthlyPaymentResult');
    const toFeedbackFormButtonElement = document.getElementById('toFeedbackFormButton');
    
    if (loanAmountElement.value.trim() !== "" && 
        isValidValue(parseFloat(loanAmountElement.value), true) && 
        isValidValue(parseFloat(initialPaymentElement.value), true) &&
        isValidValue(parseFloat(interestRateElement.value) / 100) &&
        isValidLoanTerm(parseInt(loanTermElement.value))) {

        const monthlyPayment = calculateMonthlyPayment();
        monthlyPaymentResultElement.innerText = `${monthlyPayment} ₽`;
        toFeedbackFormButtonElement.removeAttribute('disabled');
    } else {
        toFeedbackFormButtonElement.setAttribute('disabled', 'disabled');
    }
}
