import React, { Component } from 'react';
import './style.css';
import common from '../flappybird/lib/common'

let data, main
const win = {
  ctx: '',
  lesson_canvas: '',
  aniId: 0,
  state: 1,
  data: 0,
  aniFun: () => {},
  main: () => {},
  img0: common.toImg('images/flappybird/bird1_0.png'),
  canvan_w: 400,
  canvan_h: 500,
}

Object.keys(win).map(e => {
  window[e] = win[e]
})

window.main = () => {
  window.ctx.clearRect(0, 0, window.canvan_w, window.canvan_h);
  if (window.state === 0) {
    window.cancelAnimationFrame(window.aniId)
    return
  }
  window.aniFun();
  window.aniId = window.requestAnimationFrame(window.main);
}

const hhh = () => {
  // main = () => {
  //   ctx.clearRect(0, 0, canvan_w, canvan_h);
  //   if (data.state === 0) {
  //     window.cancelAnimationFrame(aniId)
  //     return
  //   }
  //   aniFun();
  //   aniId = window.requestAnimationFrame(main);
  // }
  // aniFun = () => {
  //   data = data + 0.1;
  //   ctx.drawImage(img0, 20, data, 48, 48);
  // }

  data = 20;
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
    code: '  main = () => {\n' +
    '    ctx.clearRect(0, 0, canvan_w, canvan_h);\n' +
    '    if (state === 0) {\n' +
    '      window.cancelAnimationFrame(aniId)\n' +
    '      return\n' +
    '    }\n' +
    '    aniFun();\n' +
    '    aniId = window.requestAnimationFrame(main);\n' +
    '  }\n' +
    '  aniFun = () => {\n' +
    '    data = data + 0.1;\n' +
    '    ctx.drawImage(img0, 20, data, 48, 48);\n' +
    '  }\n' +
    '  data = 20;\n' +
    '  main();\n'
  }, {
    text: '',
    content: '',
    code: '' +
    '  state=1;\n' +
    '  data = 20;\n' +
    '  main();\n'
  },
]

class Lesson extends Component {

  componentDidMount() {
    window.lesson_canvas = this.lesson_canvas
    window.ctx = this.lesson_canvas.getContext('2d');
  }

  clickBut = (i) => (e) => {
    try {
      eval(i);
    }catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
        <div className="lesson_box">
          <div className="text">
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
                    <div>
                      <button onClick={this.clickBut(e.code)}>run</button>
                    </div>
                  </div>
                </div>))}
              </ol>
            </section>
          </div>
          <div className="canvas">
            <canvas id="lesson_canvas" width={window.canvan_w} height={window.canvan_h}  ref={(lesson_canvas) => { this.lesson_canvas = lesson_canvas }}/>
            <button onClick={() => {window.ctx.clearRect(0, 0, window.canvan_w, window.canvan_h)
            }}>clean</button>
            <button onClick={e => {window.state = 0}}>stop</button>
          </div>
        </div>
    )
  }
}

export default Lesson;