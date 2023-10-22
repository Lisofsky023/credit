//= components/validationForm.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('feedbackFormScreen').classList.add('hidden');
  
    function calculateMonthlyPayment() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const initialPayment = parseFloat(document.getElementById('initialPayment').value) || 0;
        const interestRateYearly = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
        const loanTermYears = parseInt(document.getElementById('loanTerm').value) || 0;
      
        if (loanAmount === 0 || interestRateYearly === 0 || loanTermYears === 0) {
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
    
    loadFromLocalStorage();

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
  