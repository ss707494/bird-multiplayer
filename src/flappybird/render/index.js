import _ from 'lodash'
import common from '../lib/common.js'
const {f_log, randomInt, toImg, getCanvas} = common

const render = (ctx, {list, state, objName, ..._else}) => {
  list.map(({type, ...data}) => {
    if (__render[type]) {
      __render[type](ctx, data, state, {..._else, list})
    }
  })
}

const _collision = data => data

const drawOnePlay = (option = 1) => (ctx, data, state, _else) => {
  if (state === 0) return
  const {img, imgNum, x, y, w = 20, h = 50, angle = 40} = data
  ctx.save()
  ctx.globalAlpha = option
  ctx.translate(x + w / 2,  y + h / 2)
  ctx.rotate(angle * Math.PI / 180)
  const _data0 = _else.imgData
  ctx.drawImage(_data0['img' + imgNum], - w / 2, - h / 2, w, h)
  ctx.font="18px Georgia";
  ctx.fillText(data.name || _else.playerName,  - w / 2, - h / 2)
  ctx.globalAlpha = 1
  ctx.restore()
}

const __render = {
  bullet: (ctx, data, state, _else) => {
    if (state === 4) return
    drawOnePlay(1)(ctx, data, state, _else)
  },
  players: (ctx, data, state, _else) => {
    if (state === 0 ) return
    data.list.filter(e => e.playerId !== _else.playerId).map((e, i) => {
      if (e.isOver) return
      drawOnePlay(0.4)(ctx, {name:e.playerName, ...e.data}, state, _else)
    })
  },
  playersName: (ctx, data, state, _else) => {
    ctx.save()
    if (state === 4) {
      ctx.fillStyle = "#f00";
    }
    ctx.font="18px Georgia";
    ctx.fillText(_else.playerName, 20, 20)
    ctx.fillStyle = "#000";
    ctx.restore()
    _.find(_else.list, e => e.type === 'players').list.map((e,i) => {
      ctx.save()
      if (_.get(e, 'isOver')) {
        ctx.fillStyle = "#f00";
      }
      ctx.font="18px Georgia";
      ctx.fillText(e.playerName, 20, i * 20 + 40)
      ctx.fillStyle = "#000";
      ctx.restore()
    })
  },
  backImg: (ctx, data) => {
    const {img, x, y, w = 20, h = 50} = data
    ctx.drawImage(img, x, y, w, h)
    ctx.drawImage(img, x + w, y, w, h)
  },
  pipe: (ctx, data) => {
    const {img_up, img_down, x, y, w, h, space} = data
    ctx.drawImage(img_down, x, y - h, w, h)
    ctx.drawImage(img_up, x, y + space, w, h)
  },
  gameOver: (ctx, data, state) => {
    if (state === 2) {
      const {img, x, y, w, h} = data
      ctx.drawImage(img, x, y, w, h)
    }
  },
  gameStart: (ctx, data, state) => {
    if (state === 0) {
      const {img, x, y, w, h} = data
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, getCanvas().width, getCanvas().height)
      ctx.drawImage(img, x, y, w, h)
    }
  },
  score: (ctx, data, state, _else) => {
    if (state === 1) {
      const {x, y, w, h} = data
      const { score } = _else
      const scoList = ('' + score).split('')
      scoList.map((e, i) => {
        ctx.drawImage(toImg('images/flappybird/font_0'+(48+~~e)+'.png'), x - w * scoList.length / 2 + i * w, y, w, h)
      })
    }
  },
}

export default render
