const _start = document.querySelector('#start')
const _msg = document.querySelector('.msg')
const _bounce = document.querySelector('.bounce')
const _target = document.querySelector('.target')
const _game = document.querySelector('.game')

const GAME = {
  bounce: {
    pos: {
      x: 0,
      y: 0
    }
  },
  field: {
    l: 0,
    r: 0,
    t: 0,
    b: 0
  }
}

const STEPS = [
  false, false, false, false, false
]


// GAME.field.l = _game.offsetLeft
// GAME.field.t = _game.offsetTop
// GAME.field.r = _game.offsetLeft + _game.offsetWidth
// GAME.field.b = _game.offsetTop + _game.offsetHeight


let acl = new Accelerometer({frequency: 30});


// acl.addEventListener('reading', step2)

function step2() {
  if(Math.abs(acl.y) > 35){
    fixAcl() 
  }
}


function step3() {
  renderPinCode()
  console.log('Время постоянно уходит... Поспеши!!!')
  let PIN = `${new Date().getHours()}${new Date().getMinutes()}`;
  let reloadPin = setInterval(() => {
    PIN = `${new Date().getHours()}${new Date().getMinutes()}`;
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
      i=0
      const cloneNum = tempNum.content.cloneNode(true);
      const numb = cloneNum.querySelector('.touch__number')
      numb.textContent = i
      numb.setAttribute('data-num', i)
      // берем
      const numList = cloneBlock.querySelector('.touch__list')
      numList.append(cloneNum)
      i=9
    }
  }

  document.querySelector('.game-touch').append(cloneBlock)
}


function fixAcl() {
  console.log('Молодец! Ты исправил ошибку :)')
    _msg.classList.remove('msg-open')
    setTimeout(() => {
      _msg.querySelector('.msg__text').innerHTML = `
      <p>Ошибка исправлена</p>
      <p>Оказывается надо было просто вызвать функцию fixAcl()</p>
      <p>Ну или потрясти телефон в твоем случае :3</p>
      <p>Попробуйте еще раз НАЧАТЬ игру</p>
      `
      _msg.classList.add('msg-open')
      _msg.querySelector('.msg__accept span').onclick = () => {
        _msg.classList.remove('msg-open')
        
      }
      _start.removeEventListener('click', start)
      // запускаем следующий шаг
      _start.addEventListener('click', step3, {once: true})
    }, 700);

    
    acl.removeEventListener('reading', step2)
}


acl.start();



_start.addEventListener('click', start)

function start(e) {
  
  _msg.classList.add('msg-open')

  acl.addEventListener('reading', step2)

  console.log('Произошла ошибка. Чтобы исправить её, зайдите с телефона, нажмите НАЧАТЬ и потрясите его')


  _msg.querySelector('.msg__accept span').onclick = () => {
    _msg.classList.remove('msg-open')
  }
  
}

function step(num) {
  for(let i = 0; i < STEPS.length; i++){
    if(STEPS[i]){
      if(i === num){

      }
    }
  }
}




/* acl.addEventListener('reading', () => {
  // document.querySelector('.log').innerHTML = `X = ${acl.x.toFixed(0)}<br>Y = ${acl.y.toFixed(0)}<br>Z = ${acl.z.toFixed(0)}`
  // console.log("Acceleration along the X-axis " + acl.x.toFixed(1));
  // console.log("Acceleration along the Y-axis " + acl.y.toFixed(1));
  // console.log("Acceleration along the Z-axis " + acl.z.toFixed(1));
  if(Math.abs(acl.y) > 35){
    console.log('Ты сделал задание')
  }
  let ax = +acl.x.toFixed(2)
  let ay = +acl.y.toFixed(2) 
  console.log([ax, ay])
  let x = (GAME.bounce.pos.x += -ax * 1.2).toFixed(2)
  let y = (GAME.bounce.pos.y += +ay * 1.2).toFixed(2)

  console.dir(GAME.field)
  console.dir(GAME.bounce.pos)

  // if(x >= GAME.field.r){
  //   x = GAME.field.r
  // }
  // if(x <= GAME.field.l){
  //   console.log('left')
  //   x = GAME.field.l
  // }
  // if(y <= GAME.field.t){
  //   y = GAME.field.t
  // }
  // if(y >= GAME.field.b){
  //   y = GAME.field.b
  // }
  
  if(x <= 0){
    x = 0
  }
  if(x + _bounce.clientWidth >= _game.clientWidth){
    x = _game.clientWidth - _bounce.offsetWidth -1
  }
  if(y <= 0){
    y = 0
  }
  if(y + _bounce.clientHeight >= _game.clientHeight){
    y = _game.clientHeight -  _bounce.offsetHeight -1
  }

  document.querySelector('.log').innerHTML = `X = ${x}<br>Y = ${y}`
  // console.log('x: ', x)
  // console.log('y: ', y)
  _bounce.style.top = `${y}px`
  _bounce.style.left = `${x}px`

  
  
}); */