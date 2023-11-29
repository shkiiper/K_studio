document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded сработал');
  
  const formClose = document.querySelector('.formClose');
  const formOpen = document.querySelector('.formOpen');
  const mainFormPopup = document.querySelector('.mainFormPopup');

  console.log(formClose, formOpen, mainFormPopup);

  formClose.addEventListener('click', () => {
    console.log('Кнопка закрытия нажата');
    mainFormPopup.classList.add('d-none');
    document.querySelector('body').style.overflow = 'auto';
  });

  formOpen.addEventListener('click', () => {
    console.log('Кнопка открытия нажата');
    mainFormPopup.classList.remove('d-none');
    document.querySelector('body').style.overflow = 'hidden';
  });
});
