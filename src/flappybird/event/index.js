import _ from 'lodash'
import common from '../lib/common.js'
const {f_log} = common

const eventsList = []

const touchHandler = (e, data) => {
  return [{type: 'tap', option: -4}]
}

const eventsOpe = {
  tap: (data, option = -12) => {
    let list = data.list
    const objN = _.findIndex(list, e => e.type === 'bullet')
    let _obj = list[objN]
    if (_obj) {
      list[objN] = {..._obj, v_y: _obj.c_v_y || option}
    }
    return {...data, list}
  },
  addPipe: (data, option) => {
    const [data0, data1, data2, ...others] = data.list
    const list = [data0, data1, data2, data.initOnePipe({x: 700, ...option}), ...others]
    return {...data, list}
  },
  updatePlayers: (data, option) => {
    let list = data.list
    const objN = _.findIndex(list, e => e.type === 'players')
    let _obj = list[objN]
    list[objN] = {...list[objN], list: option.data}
    return {...data, list}
  },
  playerTap: (data, option) => {
    const {playerId} = option
    const newData = _.find(option.list, e => e.type === 'bullet')

    let list = data.list
    const objN = _.findIndex(list, e => e.type === 'players')
    let _obj = list[objN]
    if (_obj) {
      const index = _.findIndex(_obj.list, e => e.playerId === playerId);
      // console.log('old', _.get(list, [objN, 'list', index, 'data']))
      list = _.set(list, [objN, 'list', index, 'data'], {...newData, v_y: newData.c_v_y} );
      // list[objN] = {..._obj, v_y: _obj.c_v_y || option}
      // console.log('new', newData);
    }
    return {...data, list}
  },
  gameover: (data, option) => {
    const {playerId} = option
    const newData = _.find(option.list, e => e.type === 'bullet')
    let list = data.list
    const objN = _.findIndex(list, e => e.type === 'players')
    let _obj = list[objN]
    if (_obj) {
      const index = _.findIndex(_obj.list, e => e.playerId === playerId);
      // console.log('old', _.get(list, [objN, 'list', index, 'data']))
      list = _.set(list, [objN, 'list', index, 'data'], {...newData, overTime: option.time} );
      // console.log('new', newData);
    }
    return {...data, list}
  },
  AllOver: (data, option) => {
    const res = option.sort((e1, e2) => e1.time - e2.time).map((e,i) => i + '. name: ' + e.playerName + ' score:' + e.score + '\n'
    ).join('')
    alert(res);
    return {...data, state: 2};
  },
}

const dealEvents = (data, eventsList = []) => {
  return {
    eventList: [],
    data: eventsList.reduce((data, event) => !(eventsOpe[event.type]) ? data : eventsOpe[event.type](data, event.option), data)
  }
}

export default {
  touchHandler,
  eventsList,
  dealEvents,
}
