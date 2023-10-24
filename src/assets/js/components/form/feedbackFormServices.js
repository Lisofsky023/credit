function setupPhoneNumberMask() {
    const phoneNumberElement = document.getElementById('phoneNumber');
    let localMask;

    if (phoneNumberElement) {
        const maskOptions = {
            mask: '+{7}(000)000-00-00'
        };
        localMask = IMask(phoneNumberElement, maskOptions);
        const labelElement = phoneNumberElement.nextElementSibling;

        phoneNumberElement.addEventListener('input', () => {
            const unmaskedValue = localMask.unmaskedValue;

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
    const emailElement = document.getElementById('email');
    let localMask;

    if (emailElement) {
        const emailMaskOptions = {
            mask: /^\S*@?\S*$/
        };
        localMask = IMask(emailElement, emailMaskOptions);
    }
    return localMask;
}

function saveFeedbackFormToLocalStorage(phoneMask) {
    const lastNameElement = document.getElementById('lastName');
    const firstNameElement = document.getElementById('firstName');
    const middleNameElement = document.getElementById('middleName');
    const emailElement = document.getElementById('email');

    const data = {
        lastName: lastNameElement.value,
        firstName: firstNameElement.value,
        middleName: middleNameElement.value,
        phoneNumber: phoneMask ? phoneMask.value : "",
        email: emailElement.value
    };
    localStorage.setItem('feedbackFormData', JSON.stringify(data));
}

function loadFeedbackFormFromLocalStorage(phoneMask, emailMask) {
    const lastNameElement = document.getElementById('lastName');
    const firstNameElement = document.getElementById('firstName');
    const middleNameElement = document.getElementById('middleName');
    const emailElement = document.getElementById('email');

    const data = JSON.parse(localStorage.getItem('feedbackFormData'));

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
