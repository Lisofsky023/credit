function submitFeedbackForm() {
  const formData = {
      lastName: document.getElementById('lastName').value,
      firstName: document.getElementById('firstName').value,
      middleName: document.getElementById('middleName').value,
      phoneNumber: mask.value,
      email: document.getElementById('email').value,
      loanAmount: document.getElementById('loanAmount').value,
      initialPayment: document.getElementById('initialPayment').value,
      interestRate: document.getElementById('interestRate').value,
      loanTerm: document.getElementById('loanTerm').value,
      monthlyPayment: document.getElementById('monthlyPaymentResult').innerText
  };

  fetch('http://localhost/request', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Ошибка сети или сервера');
      }
      return response.json();
  })
  .then(data => {
      if (data.success) {
          alert('Данные успешно отправлены!');
      } else {
          alert('Произошла ошибка при отправке данных!');
      }
  })
  .catch(error => {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке данных!');
  });
}
