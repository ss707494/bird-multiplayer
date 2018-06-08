import React, { Component } from 'react';
import io from 'socket.io-client';
import './style.css';
import common from '../flappybird/lib/common'

const {toImg, alert} = common;
const win = {
  ctx: '',
  lesson_canvas: '',
  aniId: 0,
  state: 1,
  data: 0,
  aniFun: [],
  main: () => {},
  img0: toImg('images/flappybird/bird1_0.png'),
  backImg: toImg('images/flappybird/bg_day.png'),
  img_down: toImg('images/flappybird/pipe_down.png'),
  img_up: toImg('images/flappybird/pipe_up.png'),
  canvan_w: 400,
  canvan_h: 500,
  socket: '',
}

let data = win.data,
    state = 1,
    main = win.main,
    ctx = win.ctx,
    aniFun = win.aniFun,
    aniId = win.aniId,
    img0 = win.img0,
    backImg = win.backImg,
    img_up = win.img_up,
    img_down = win.img_down,
    lesson_canvas = win.lesson_canvas,
    canvan_w= 400,
    canvan_h= 500,
    socket

window.io = io;
window.alert = alert;
Object.keys(win).map(e => {
  window[e] = win[e];
})

main = () => {
  if (state === 0) {
    cancelAnimationFrame(aniId)
    return
  }
  ctx.clearRect(0, 0, canvan_w, canvan_h);
  aniFun.map(e => e());
  aniId = window.requestAnimationFrame(main);
}

window.main = () => {
  if (window.state === 0) {
    window.cancelAnimationFrame(window.aniId)
    return
  }
  window.ctx.clearRect(0, 0, window.canvan_w, window.canvan_h);
  window.aniFun.map(e => e());
  window.aniId = window.requestAnimationFrame(window.main);
}

const test = () => {
  return

  state = 1;
  data = {
    y: 20,
    v_y: 0,
    a_y: .15,
    x_b: 0,
  };
  lesson_canvas.onclick = e => {
    data.v_y = -8;
  }
  aniFun = [() => {
    if (data.y > canvan_h) {
      data.v_y = - data.v_y;
    }
    data.y = data.y + data.v_y;
    data.v_y = data.v_y + data.a_y;

    data.x_b = data.x_b - 1;
    if (data.x_b + canvan_w < 0) {
      data.x_b = 0
    }
    ctx.drawImage(backImg, data.x_b, 0, canvan_w, canvan_h);
    ctx.drawImage(backImg, data.x_b + canvan_w, 0, canvan_w, canvan_h);
    ctx.drawImage(img0, 20, data.y, 48, 48);
  }]

  data.p_x = canvan_w;
  data.p_y = 150;
  data.p_space = 200;
  aniFun.push(() => {
    if (data.p_x < -70) {
      data.p_x = canvan_w;
    }
    data.p_x = data.p_x - 1;
    ctx.drawImage(img_up, data.p_x, data.p_y + data.p_space, 70, 350);
    ctx.drawImage(img_down, data.p_x, data.p_y - 350, 70, 350);
  })

  aniFun.push(() => {
    // 碰撞
    const thick = 8
    const o = {
      x: 20 + thick,
      y: data.y + thick,
      w: 44 - 2 * thick,
      h: 44 - 2 * thick,
    }
    const p = {
      x: data.p_x,
      y: data.p_y,
      w: 70,
      h: 350,
      space: data.p_space,
    }
    const _1 = (x, y, w, space) => (x_p, y_p) => x_p > x && x_p < x + w && (y_p < y || y_p > y + space)
    const _2 = _1(p.x, p.y, p.w, p.space)
    if (_2(o.x, o.y) || _2(o.x+o.w, o.y) || _2(o.x, o.y + o.h) || _2(o.x+o.w, o.y + o.h)){
      state = 0;
      alert('碰到了');
    }
  })

  // 创建连接
  socket = io.connect('http://localhost:6040');

  // 注册连接事件
  socket.on('connected', () => {
    console.log('客户端已连接');
  })

  // 注册其他事件
  socket.on('msg', data => {
    console.log('客户端收到消息:', 'data');
  })

  main();
}

const codeList = [
  {
    text: '建一个画布, 拿到画笔',
    code: 'ctx = this.lesson_canvas.getContext("2d");',
  }, {
    text: '画静态图片',
    code: 'ctx.drawImage(img0, 20, 20, 48, 48)',
  }, {
    text: '画图片动画',
    code: '' +
    'state = 1;\n' +
    '  main = () => {\n' +
    '    if (state === 0) {\n' +
    '      window.cancelAnimationFrame(aniId)\n' +
    '      return\n' +
    '    }\n' +
    '    ctx.clearRect(0, 0, canvan_w, canvan_h);\n' +
    '    aniFun.map(e => e());\n' +
    '    aniId = window.requestAnimationFrame(main);\n' +
    '  }\n' +
    '  aniFun = [() => {\n' +
    '    data = data + 0.4;\n' +
    '    ctx.drawImage(img0, 20, data, 48, 48);\n' +
    '  }]\n' +
    '  data = 20;\n' +
    '  main();\n'
  }, {
    text: '添加加速度',
    content: '',
    code:
    ' data = {\n' +
    '    y: 20,\n' +
    '    v_y: 0,\n' +
    '    a_y: .15,\n' +
    '  };\n' +
    '  state = 1;\n' +
    '  aniFun = [() => {\n' +
    '    data.y = data.y + data.v_y;\n' +
    '    data.v_y = data.v_y + data.a_y;\n' +
    '    ctx.drawImage(img0, 20, data.y, 48, 48);\n' +
    '  }]\n'
  }, {
    text: '添加点击事件, 边缘事件',
    content: '',
    code:
    '  state = 1;\n' +
    '  data = {\n' +
    '    y: 20,\n' +
    '    v_y: 0,\n' +
    '    a_y: .15,\n' +
    '  };\n' +
    '  aniFun = [() => {\n' +
    '    if (data.y > canvan_h) {\n' +
    '      data.v_y = - data.v_y;\n' +
    '    }\n' +
    '    data.y = data.y + data.v_y;\n' +
    '    data.v_y = data.v_y + data.a_y;\n' +
    '    ctx.drawImage(img0, 20, data.y, 48, 48);\n' +
    '  }]\n' +
    '  lesson_canvas.onclick = e => {\n' +
    '    data.v_y = -8;\n' +
    '  }\n'
  }, {
    text: '添加背景',
    content: '',
    code:
    ' state = 1;\n' +
    '  data = {\n' +
    '    y: 20,\n' +
    '    v_y: 0,\n' +
    '    a_y: .15,\n' +
    '    x_b: 0,\n' +
    '  };\n' +
    '  aniFun.unshift(() => {\n' +
    '    data.x_b = data.x_b - 1;\n' +
    '    if (data.x_b + canvan_w < 0) {\n' +
    '      data.x_b = 0\n' +
    '    }\n' +
    '    ctx.drawImage(backImg, data.x_b, 0, canvan_w, canvan_h);\n' +
    '    ctx.drawImage(backImg, data.x_b + canvan_w, 0, canvan_w, canvan_h);\n' +
    '  })\n'
  }, {
    text: '添加障碍物',
    content: '',
    code:
        '  data.p_x = canvan_w;\n' +
        '  data.p_y = 150;\n' +
        '  data.p_space = 200;\n' +
        '  aniFun.push(() => {\n' +
        '    if (data.p_x < -70) {\n' +
        '      data.p_x = canvan_w;\n' +
        '    }\n' +
        '    data.p_x = data.p_x - 1;\n' +
        '    ctx.drawImage(img_up, data.p_x, data.p_y + data.p_space, 70, 350);\n' +
        '    ctx.drawImage(img_down, data.p_x, data.p_y - 350, 70, 350);\n' +
        '  })\n'
  }, {
    text: '添加碰撞检测',
    content: '',
    code:
    '  aniFun.push(() => {\n' +
    '    // 碰撞\n' +
    '    const thick = 8\n' +
    '    const o = {\n' +
    '      x: 20 + thick,\n' +
    '      y: data.y + thick,\n' +
    '      w: 44 - 2 * thick,\n' +
    '      h: 44 - 2 * thick,\n' +
    '    }\n' +
    '    const p = {\n' +
    '      x: data.p_x,\n' +
    '      y: data.p_y,\n' +
    '      w: 70,\n' +
    '      h: 350,\n' +
    '      space: data.p_space,\n' +
    '    }\n' +
    '    const _1 = (x, y, w, space) => (x_p, y_p) => x_p > x && x_p < x + w && (y_p < y || y_p > y + space)\n' +
    '    const _2 = _1(p.x, p.y, p.w, p.space)\n' +
    '    if (_2(o.x, o.y) || _2(o.x+o.w, o.y) || _2(o.x, o.y + o.h) || _2(o.x+o.w, o.y + o.h)){\n' +
    '      state = 0;\n' +
    '      alert(\'碰到了\');\n' +
    '    }\n' +
    '  })\n'
  }, {
    text: 'websocket介绍',
    content: 'WebSocket是一种在单个TCP连接上进行全双工通讯的协议',
    code:
    '',
    noBut: 1,
  }, {
    text: 'socket.io 服务端',
    content: 'on--监听事件; emit--发送事件消息',
    code:
        'const server = require(\'socket.io\');\n' +
        'const io = server(6040)\n' +
        'io.on(\'connection\', function (socket) {\n' +
        '  console.log(\'one player connected\', socket.id);\n' +
        '  socket.on(\'msg\', (msg, callback) => {\n' +
        '    console.log(\'server get one msg\', msg);\n' +
        '  })\n' +
        '  socket.emit(\'connected\')\n' +
        '});\n',
    noBut: 1,
  }, {
    text: 'socket.io 客户端',
    content: '',
    code:
        '  // 创建连接\n' +
        '  socket = io.connect(\'http://localhost:6040\');\n' +
        '  // 注册连接事件\n' +
        '  socket.on(\'connected\', () => {\n' +
        '    console.log(\'客户端已连接\');\n' +
        '  })\n' +
        '  socket.on(\'msg\', data => {\n' +
        '    console.log(\'客户端收到消息:\', \'data\');\n' +
        '  })\n',
  }, {
    text: 'websocket介绍',
    content: 'WebSocket是一种在单个TCP连接上进行全双工通讯的协议',
    code:
        '',
    noBut: 1,
  },
]

class Lesson extends Component {

  componentDidMount() {
    lesson_canvas = window.lesson_canvas = this.lesson_canvas
    ctx = window.ctx = this.lesson_canvas.getContext('2d');
    // var objDiv = document.getElementById("text");
    // objDiv.scrollTop = objDiv.scrollHeight;
  }

  clickBut = (code, i) => (e) => {
    try {
      window.eval(code);
    }catch (e) {
      console.log(e);
    }
  }
  runALl = (code, i) => e => {
    window.cancelAnimationFrame(window.aniId)
    setTimeout(() => {
      codeList.map((e,i0) => {
        if (i0 <= i) {
          window.eval(codeList[i0].code);
        }
      }, 50)
    })
    return
  }

  render() {
    return (
        <div className="lesson_box">
          <div id="text" className="text">
            <header>
              <h2>用canvas写h5小游戏</h2>
            </header>
            <section>
              <ol>
                {codeList.map((e,i) => (<div key={i}>
                  <li>{e.text}</li>
                  <div>
                    <div className="content">
                      {e.content}
                    </div>
                  <pre>
                  <code>
                    {e.code}
                  </code>
                  </pre>
                    {
                      !e.noBut &&
                      <div>
                        <button onClick={this.clickBut(e.code, i)}>run</button>
                        <button onClick={this.runALl(e.code, i)}>runAll</button>
                      </div>
                    }
                  </div>
                </div>))}
              </ol>
            </section>
          </div>
          <div className="canvas">
            <canvas id="lesson_canvas" width={window.canvan_w} height={window.canvan_h}  ref={(lesson_canvas) => { this.lesson_canvas = lesson_canvas }}/>
            <button onClick={() => {window.ctx.clearRect(0, 0, window.canvan_w, window.canvan_h)
            }}>clean</button>
            <button onClick={e => {state = window.state = 0}}>stop</button>
            <button onClick={e => {state = window.state = 1; window.main && window.main();}}>start</button>
            <button onClick={test}>test</button>
          </div>
        </div>
    )
  }
}

export default Lesson;