function setupPhoneNumberMask() {
    const phoneNumberElement = document.getElementById('phoneNumber');
    let localMask;
    if (phoneNumberElement) {
        const maskOptions = {
            mask: '+{7}(000)000-00-00'
        };
        localMask = IMask(phoneNumberElement, maskOptions);

        phoneNumberElement.addEventListener('input', function() {
            const unmaskedValue = localMask.unmaskedValue;
            const labelElement = phoneNumberElement.nextElementSibling;

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

function saveFeedbackFormToLocalStorage(phoneMask, emailMask) {
    const data = {
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        phoneNumber: phoneMask ? phoneMask.value : "",
        email: document.getElementById('email').value
    };
    localStorage.setItem('feedbackFormData', JSON.stringify(data));
}

function loadFeedbackFormFromLocalStorage(phoneMask, emailMask) {
    const data = JSON.parse(localStorage.getItem('feedbackFormData'));
    if (data) {
        document.getElementById('lastName').value = data.lastName || "";
        document.getElementById('firstName').value = data.firstName || "";
        document.getElementById('middleName').value = data.middleName || "";
        
        if (phoneMask && phoneMask.updateValue) {
            phoneMask.value = data.phoneNumber || "";
            phoneMask.updateValue();
        }

        if (emailMask && emailMask.updateValue) {
            document.getElementById('email').value = data.email || "";
            emailMask.updateValue();
        }
    }
}

