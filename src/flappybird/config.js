/**
 * Created by Administrator on 2/19.
 */

export default (x => {
  // 根据窗口大小 生成canvas
  // const clientWidth = document.body.clientWidth;
  const clientWidth = 300 || window.screen.availWidth;
  const clientHeight = 700 || window.screen.availHeight -20;
  // const clientWidth = window.screen.availWidth;
  // const clientHeight = window.screen.availHeight -20;
	let l,
		l1 = (clientHeight ) / 18,
		// l2 = (clientWidth - 20) / 11;
    l2 = clientWidth > clientHeight ? l1 /18 * 9 : clientWidth / 18;
	l = ~~(l1 < l2 ? l1 : l2);
	return {
		width: l2 * 18,
		height: l1 * 18,
		l: l,
		hz: 500, // 下落速度
		aniHz: 60, // 刷新频率
	}
})()
