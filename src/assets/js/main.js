//= components/validationForm.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('feedbackFormScreen').classList.add('hidden');
  
    function calculateMonthlyPayment() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const initialPayment = parseFloat(document.getElementById('initialPayment').value);
        const interestRateYearly = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanTermYears = parseInt(document.getElementById('loanTerm').value);
  
        const interestRateMonthly = interestRateYearly / 12;
        const loanTermMonths = loanTermYears * 12;
  
        return ((loanAmount - initialPayment) * Math.pow((1 + interestRateMonthly), loanTermMonths) * interestRateMonthly) / (Math.pow((1 + interestRateMonthly), loanTermMonths) - 1);
    }

    const inputFields = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm'];

    inputFields.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('input', function() {
                if (allFieldsFilled()) {
                    const monthlyPayment = calculateMonthlyPayment();
                    document.getElementById('monthlyPaymentResult').innerText = `${monthlyPayment.toFixed(2)} ₽`;
                    document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
                }
                saveToLocalStorage();
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
  