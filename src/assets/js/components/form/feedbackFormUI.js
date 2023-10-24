function validateFormFields(phoneMask, emailMask) {
    const formFields = ["lastName", "firstName", "middleName", "email"]; // Убран "phoneNumber"
    const minimumChars = {
        "lastName": 3,
        "firstName": 3,
        "middleName": 3
    };

    formFields.forEach(fieldId => {
        const inputElement = document.getElementById(fieldId);
        const labelElement = inputElement.nextElementSibling;
        labelElement.style.color = 'transparent';

        const updateStyles = () => {
            let value = inputElement.value;

            if (fieldId === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        }

        inputElement.addEventListener('focus', () => {
            labelElement.style.color = 'red';
            updateStyles();
        });

        inputElement.addEventListener('blur', () => {
            if (inputElement.value.trim() === '') {
                labelElement.style.color = 'transparent';
            }
        });

        inputElement.addEventListener('input', updateStyles);
    });

    saveFeedbackFormToLocalStorage();
}
