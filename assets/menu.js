document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelector('.formClose').addEventListener('click', ()=>{
    document.querySelector('.mainFormPopup').classList.add('d-none')
    document.querySelector('body').style.overflow = 'auto'
  })
  document.querySelector('.formOpen').addEventListener('click', ()=>{
    document.querySelector('.mainFormPopup').classList.remove('d-none')
    document.querySelector('body').style.overflow = 'hidden'
  })
})