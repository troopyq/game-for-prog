const _start = document.querySelector('#start')
const _msg = document.querySelector('.msg')
const _bounce = document.querySelector('.bounce')
const _target = document.querySelector('.target')
const _game = document.querySelector('.game')

const STEPS = [
  false, false, false, false, false
]

const sndShowMsg = new Audio('./assets/sounds/msg.wav')
const sndHideMsg = new Audio('./assets/sounds/ok.wav')
const sndStart = new Audio('./assets/sounds/start.wav')
const sndClick = new Audio('./assets/sounds/click.wav')
const sndSuccess = new Audio('./assets/sounds/success.wav')
const sndError = new Audio('./assets/sounds/error.wav')
const sndBg = new Audio('./assets/sounds/background.mp3')

class Message{
  constructor({msgElement, msgSelector, isSound = true}){
    // this.msgElement = msgElement ?? document.querySelector(msgSelector) ?? null
    this.msgElement = document.querySelector('#message').content.cloneNode(true).querySelector('.msg')
    this.isSound = isSound
    this.isShow = false

    const wrap = document.createElement('div')
    wrap.classList.add('msg__wrap')
    wrap.append(this.msgElement)
    document.querySelector('.wrapper').append(wrap)
    this.msgDom = document.querySelector('.msg')
  }
  soundShow(){
    sndShowMsg.volume = 0.15
    sndShowMsg.play()
  }
  soundHide(){
    sndHideMsg.volume = 0.15
    sndHideMsg.play()
  }
  show(text) {
    console.log('show')
    if(this.isShow) return
    
    
    if(text){
      this.msgDom.querySelector('.msg__text').innerHTML = text
    }
    setTimeout(() => {
      this.isShow = true
      this.soundShow()
      this.msgDom.classList.add('msg-open')
      
    }, 200);
    
    this.msgDom.querySelector('.msg__accept span').addEventListener('click', () => {
      this.soundHide()
      this.hide()
    }, {once: true})
  }
  hide() {
    this.isShow = false
    this.msgDom.classList.remove('msg-open')
  }
}


let acl = new Accelerometer({frequency: 30});
let msg = new Message({msgElement: _msg})

acl.start();

_start.addEventListener('click', start)
_start.addEventListener('click', () => {
  
  window.onblur = () => {
    sndBg.muted = true
    sndBg.pause()
  }
  window.onfocus = () => {
    sndBg.muted = false
    sndBg.loop = true
    sndBg.volume = 0.75
    sndBg.play()
  }

  
  
  sndBg.play()
}, {once: true})
_start.addEventListener('click', () => {
  sndStart.volume = 0.3
  sndStart.play()
})


function start(e) {
  
  
  
  // TODO: сделать msg <template> и передавать сюда текст
  console.log('Произошла ошибка. Чтобы исправить её, зайдите с телефона, нажмите НАЧАТЬ и потрясите его')
  let msgText = `<p>Ой, что-то пошло не так...</p>
  <p>Посмотри в логах, где ошибка и исправь</p>`
  msg.show(msgText)

  acl.addEventListener('reading', checkShake)

}


function step3() {
  
  renderPinCode()
  msg.show(`<p>С каждой минутой время постоянно уходит... Поспеши!!!</p>`)
  console.log('С каждой минутой время постоянно уходит... Поспеши!!!')
  let PIN = generatePIN();
  console.log(PIN)
  let reloadPin = setInterval(() => {
    PIN = generatePIN();
  }, 1000);

  const touch = document.querySelector('.touch')
  const pins = touch.querySelectorAll('.pin span')
  const _pin = touch.querySelector('.pin')
  const btnList = touch.querySelectorAll('.touch__number')

  let code = []

  btnList.forEach(btn => {
    btn.addEventListener('mousedown', onClickNum)
  })

  function onClickNum(e) {
    
    sndClick.volume = 0.65
    sndClick.play()

    const num = e.target.getAttribute('data-num')
    
    if(code.length < 4){
      code.push(num)
      pins[code.length - 1].textContent = code[code.length - 1]
    } else{
      clear()
    }
    // авторизация пин кода
    if(code.length === 4){
      if(code.join('') === PIN){
        console.log('Код верный')

        sndSuccess.volume = 0.8
        sndSuccess.play()

        clearInterval(reloadPin)
        setTimeout(() => {
          touch.classList.add('success')
        }, 800);

        touch.onanimationend = () => {
          document.querySelector('.game-touch').outerHTML = ''
        };
        
        _pin.classList.add('success')
        btnList.forEach(btn => {
          btn.removeEventListener('click', onClickNum)
        })
      } else{
        // Если код неверный
        sndError.volume = 0.8
        sndError.play()

        _pin.classList.add('error')
        setTimeout(() => {
          clear()
          _pin.classList.remove('error')
        }, 700);
      }
    }
    // очистка пин кода
    function clear() {
      code = []
      pins.forEach(el => el.textContent = '*')
    }
    
  }

}


function checkShake() {
  if(Math.abs(acl.y) > 35){
    fixAcl() 
  }
}

function fixAcl() {
  console.log('Молодец! Ты исправил ошибку :)')

  msg.hide()

  setTimeout(() => {
    let text = `
    <p>Ошибка исправлена</p>
    <p>Оказывается надо было просто вызвать функцию fixAcl()</p>
    <p>Ну или потрясти телефоном в твоем случае :3</p>
    <p>Попробуйте еще раз НАЧАТЬ игру</p>
    `
    msg.show(text)

    _start.removeEventListener('click', start)
    // запускаем следующий шаг
    _start.addEventListener('click', step3, {once: true})
  }, 300);

    
    acl.removeEventListener('reading', checkShake)
}








function renderPinCode(e) {
  const tempBlock = document.querySelector('#touch-block')
  const tempNum = document.querySelector('#touch-num')

  const cloneBlock = tempBlock.content.cloneNode(true);
  
  for(let i = 1; i <= 9; i++){
    const cloneNum = tempNum.content.cloneNode(true);
    const numb = cloneNum.querySelector('.touch__number')
    numb.textContent = i
    numb.setAttribute('data-num', i)
    // берем
    const numList = cloneBlock.querySelector('.touch__list')
    numList.append(cloneNum)
    if(i === 9){
      i = 0 
      const cloneNum = tempNum.content.cloneNode(true);
      const numb = cloneNum.querySelector('.touch__number')
      numb.textContent = i
      numb.setAttribute('data-num', i)
      // берем
      const numList = cloneBlock.querySelector('.touch__list')
      numList.append(cloneNum)
      i = 9
    }
  }

  document.querySelector('.game-touch').append(cloneBlock)
}


function generatePIN() {
  let d = new Date()
  let h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  let m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  return `${h}${m}`;
}

function step(num) {
  for(let i = 0; i < STEPS.length; i++){
    if(STEPS[i]){
      if(i === num){

      }
    }
  }
}
