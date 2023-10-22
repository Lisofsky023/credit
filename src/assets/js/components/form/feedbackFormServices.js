let mask;

function setupPhoneNumberMask() {
    const phoneNumberElement = document.getElementById('phoneNumber');
    if(phoneNumberElement) {
        const maskOptions = {
            mask: '+{7}(000)000-00-00'
        };
        mask = IMask(phoneNumberElement, maskOptions);
    }
}

function setupEmailMask() {
    const emailElement = document.getElementById('email');
    if(emailElement) {
        const emailMaskOptions = {
            mask: /^\S*@?\S*$/
        };
        const emailMask = IMask(emailElement, emailMaskOptions);
    }
}

function saveFeedbackFormToLocalStorage() {
    const data = {
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        phoneNumber: mask.value,
        email: document.getElementById('email').value
    };
    localStorage.setItem('feedbackFormData', JSON.stringify(data));
}

function loadFeedbackFormFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('feedbackFormData'));
    if (data) {
        document.getElementById('lastName').value = data.lastName || "";
        document.getElementById('firstName').value = data.firstName || "";
        document.getElementById('middleName').value = data.middleName || "";
        if (mask) {
            mask.value = data.phoneNumber || "";
            mask.updateValue();
        }
        document.getElementById('email').value = data.email || "";
    }
}
