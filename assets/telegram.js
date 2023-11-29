const TOKEN = '6506225535:AAE0_AQf7ljB2l9Vo3LINrrUm4Y4jy8hjbg'
const CHAT_ID = '-1002040526890'
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`

document.addEventListener('DOMContentLoaded', () => {
  let formCall = document.querySelector('.pop-up-form-netpeak-site').addEventListener('submit', (e) => {
    e.preventDefault()

    let name = document.querySelector('#name-6').value
    let phone = document.querySelector('#phone-6').value
    let question = document.querySelector('#question-6').value
    if(!!phone){
      axios.post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: 'HTML',
        text: `Новая заявка с сайта:
  Имя: ${name || 'Не указано'}
  Телефон: ${phone}
  Вопрос: ${question || 'Не указано'}
`
      }).then((res)=>{
        if(res.status === 200){
          setTimeout(() => {
          document.querySelector('.pop-up-form-netpeak-site').reset();
          document.querySelector('.pop-up-content-main-form').classList.add('d-none')
          document.querySelector('.pop-up-form-netpeak-site').classList.add('d-none')
        
          document.querySelector('body').style.overflow = 'auto'
          console.log('Окно скрыто.');
          },200)
        }
      })
    } else {
      console.log('заполните поля')
    }
  })
})