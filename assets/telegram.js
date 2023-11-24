const TOKEN = '6506225535:AAE0_AQf7ljB2l9Vo3LINrrUm4Y4jy8hjbg'
const CHAT_ID = '-1002040526890'
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`

document.addEventListener('DOMContentLoaded', () => {
  let formCall = document.querySelector('.mainForm').addEventListener('submit', (e) => {
    e.preventDefault()

    let name = document.querySelector('#name-form2-8').value
    let phone = document.querySelector('#number-form2-8').value
    if(!!phone){
      axios.post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: 'HTML',
        text: `Новая заявка с сайта
Имя: ${name || 'Не указано'}
Телефон: ${phone}
`
      }).then((res)=>{
        if(res.status === 200){
          document.querySelector('#number-form2-8').value = 'Вы успешно оставили заявку' 
          setTimeout(()=>{
            document.querySelector('#number-form2-8').value = ''
            document.querySelector('.mainFormPopup').classList.add('d-none')
            document.querySelector('body').style.overflow = 'auto'
          }, 100)
        }
      })
    } else {
      console.log('заполните поля')
    }
  })
})