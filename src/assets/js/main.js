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
  
    function saveToLocalStorage() {
        localStorage.setItem('loanAmount', document.getElementById('loanAmount').value);
        localStorage.setItem('initialPayment', document.getElementById('initialPayment').value);
        localStorage.setItem('interestRate', document.getElementById('interestRate').value);
        localStorage.setItem('loanTerm', document.getElementById('loanTerm').value);
    }
  
    document.getElementById('calculateButton').addEventListener('click', function() {
        const monthlyPayment = calculateMonthlyPayment();
        document.getElementById('monthlyPaymentResult').innerText = `${monthlyPayment.toFixed(2)} ₽`;
        document.getElementById('toFeedbackFormButton').removeAttribute('disabled');
        saveToLocalStorage();
    });
  
    const ids = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm', 'monthlyPaymentResult'];
      ids.forEach(id => {
          const element = document.getElementById(id);
          const value = localStorage.getItem(id);
          if (value !== null && element) {
              element.value = value;
          }
          if (element) {
              element.addEventListener('change', function() {
                  localStorage.setItem(id, this.value);
              });
          }
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
  