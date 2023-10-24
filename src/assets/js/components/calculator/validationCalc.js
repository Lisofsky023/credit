document.addEventListener('DOMContentLoaded', () => {
    const calculatorScreen = document.getElementById('calculatorScreen');
    const feedbackFormScreen = document.getElementById('feedbackFormScreen');
    const toFeedbackFormButton = document.getElementById('toFeedbackFormButton');
    const backToCalculatorButton = document.getElementById('backToCalculator');
    const inputFieldsIds = ['loanAmount', 'initialPayment', 'interestRate', 'loanTerm', 'middleName'];

    feedbackFormScreen.classList.add('hidden');
    
    loadFromLocalStorage();
    checkFieldsAndSetButtonState();
    updateLabelColors();

    inputFieldsIds.forEach(id => {
        const inputElement = document.getElementById(id);
        const labelElement = inputElement.nextElementSibling;
    
        inputElement.addEventListener('focus', () => {
            if (inputElement.value.trim() === '') {
                labelElement.style.color = 'red';
            }
        });
    
        inputElement.addEventListener('blur', () => {
            if (inputElement.value.trim() === '') {
                labelElement.style.color = 'transparent';
            }
        });
    
        inputElement.addEventListener('input', () => {
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

    toFeedbackFormButton.addEventListener('click', () => {
        calculatorScreen.classList.add('hidden');
        feedbackFormScreen.classList.remove('hidden');
    });
    
    backToCalculatorButton.addEventListener('click', () => {
        feedbackFormScreen.classList.add('hidden');
        calculatorScreen.classList.remove('hidden');
    });
});
