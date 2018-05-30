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
    const list = [data0, data1, data2, data.initOnePipe({x: 400, ...option}), ...others]
    return {...data, list}
  },
  updatePlayers: (data, option) => {
    let list = data.list
    const objN = _.findIndex(list, e => e.type === 'players')
    let _obj = list[objN]
    list[objN] = {...list[objN], list: option.data}
    return {...data, list}
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
