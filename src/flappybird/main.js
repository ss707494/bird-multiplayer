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
const {f_log, randomInt, getCanvas} = common
const { touchHandler, eventsList, dealEvents } = _event

let ctx,
    isSimple,
    playerName,
    playerId,
    socket;

let data = {...adata};
let eventsL = eventsList;
window.eventsL = eventsL;
let aniId;

export default function Main2() {
  isSimple = !window.confirm("多人模式");
  // isSimple = true
  // playerName = 'ss'
  playerName = window.prompt('请输入名字:', '');
  if (!isSimple) {
    socket = initSocket(window)
    socket.on('connected', () => {
      socket.emit('initClient', { playerName, data: _.find(data.list, e => e.type === 'bullet') }, (id, data) => {
        playerId = id
        initGame();
      });
    })
    setTimeout(() => {
      if (!socket.connected) {
        alert('未连接服务器, 启动单机模式');
        socket.close()
        isSimple = true
        addPipe();
        initGame();
      }
    }, 30000)
  }else {
    addPipe();
    initGame();
  }
}

const initGame = () => {
  data = {...data, isSimple, playerName, playerId}
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
    canvas.addEventListener('click', dealEvent )
  } else {
    var evt = window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart';
    canvas.addEventListener(evt, dealEvent);
  }
}

