import common from './lib/common.js'
import _ from 'lodash'
import initSocket from './io/index'
import adata from './data/index.js'
import update from './update/index.js'
import render from './render/index.js'
import _event from './event/index.js'
import collision from './collision/index.js'
import config from './config.js'

window._ = _
const {f_log, randomInt, getCanvas, alert} = common
const {touchHandler, eventsList, dealEvents} = _event

let ctx,
    isSimple,
    playerName,
    playerId,
    isConected,
    socket;

let data = {...adata};
let eventsL = eventsList;
window.eventsL = eventsL;
let aniId;

export default function Main2() {
  alert('请选择模式', {
    buttons: {
      one: {
        text: '单人',
        value: '1',
      },
      two: {
        text: '多人',
        value: '2',
      }
    }
  }).then(value => {
    isSimple = value !== '2'
    alert('请输入名字:', {
      content: {
        element: "input",
      }
    }).then(v => {
      playerName = v || ('**' + Math.floor(Math.random() * 100))
      main0();
    })
  })
}

function main0() {
  // isSimple = !window.confirm("多人模式");
  // isSimple = true
  // playerName = 'ss'
  // playerName = window.prompt('请输入名字:', localStorage.getItem('name') || '');
  // localStorage.setItem('name', playerName)
  if (!isSimple) {
    socket = initSocket(window)

    const socketId = setTimeout(() => {
      if (!socket.connected) {
        alert('未连接服务器, 启动单机模式');
        socket.close()
        isSimple = true
        addPipe();
        initGame();
      }
    }, 30000)

    socket.on('connected', () => {
      if (!isConected) {
        socket.emit('initClient', {playerName, data: _.find(data.list, e => e.type === 'bullet')}, (id, data) => {
          playerId = id
          initGame();
          clearTimeout(socketId);
          isConected = !!1;
        });
      }
    })
  } else {
    addPipe();
    initGame();
  }
}

let hasInit = 0
const initGame = () => {
  data = {...data, isSimple, playerName, playerId}
  if (hasInit) return
  hasInit = 1
  window.canvas = document.getElementById('canv_f')
  const canvas = document.getElementById('canv_f')
  ctx = document.getElementById('canv_f').getContext('2d')
  canvas.width = config.width;
  canvas.height = config.height;
  main()
  bindEvent()
}

const main = _ => {
  ctx.clearRect(0, 0, getCanvas().width, getCanvas().height)
  const _o = dealEvents(data, window.eventsL)
  window.eventsL = _o.eventList
  data = update(_o.data)
  render(ctx, collision(data))
  if (data.state === 2) {
    window.cancelAnimationFrame(aniId)
    return
  }
  if (!data.hasOver && data.state === 4) {
    data.hasOver = 1;
    socket.emit('gameover', data);
  }
  aniId = window.requestAnimationFrame(main)
  return data;
}

const addPipe = () => {
  setInterval(() => {
    window.eventsL.push({type: 'addPipe', option: {space_g: randomInt(80), y_g: randomInt(180)}})
  }, 3000)
}

const bindEvent = () => {
  const dealEvent = e => {
    e.preventDefault()
    if (data.state === 2 || data.state === 0) {
      window.cancelAnimationFrame(aniId)
      window.eventsL = []
      data = ({...data, score: 0, state: data.isSimple ? 1 : 1, list: data.list.filter(e => e.type !== 'pipe')});
      main();
      return
    }
    if (socket && socket.connected) {
      socket.emit('playerTap', data);
    }
    window.eventsL = touchHandler(e, data)
  }
  const canvas = document.getElementById('canv_f');
  let _isTouchDevice = false
  if (window.navigator.msPointerEnabled || 'ontouchstart' in window)
    _isTouchDevice = true;
  else
    _isTouchDevice = false;
  if (_isTouchDevice == false) {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode == 32) {
        dealEvent(event)
      }
    });
    canvas.addEventListener('click', dealEvent)
  } else {
    var evt = window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart';
    canvas.addEventListener(evt, dealEvent);
  }

  const gameStartBtn = document.getElementById('gameStart');
  gameStartBtn.addEventListener('click', function (event) {
    if (socket && socket.connected) {
      socket.emit('gameStart');
    }
  });
  const initGame = document.getElementById('initGame');
  initGame.addEventListener('click', function (event) {
    if (socket && socket.connected) {
      socket.emit('initGame');
      isConected = !!0;
    }
  });

}

