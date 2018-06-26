const keys = [
  {
    code: [8, 46],
    name: ['Backspace', 'Delete'],
    alias: 'delete'
  },
  // IE11 uses key names without `Arrow` prefix for arrow keys.
  {
    code: 38,
    name: ['Up', 'ArrowUp'],
    alias: 'up'
  },
  {
    code: 37,
    name: ['Left', 'ArrowLeft'],
    alias: 'left'
  },
  {
    code: 39,
    name: ['Right', 'ArrowRight'],
    alias: 'right'
  },
  {
    code: 40,
    name: ['Down', 'ArrowDown'],
    alias: 'down'
  },
  // 系统修饰键
  {
    code: 17,
    name: 'Control',
    alias: 'ctrl'
  },
  {
    code: 16,
    name: 'Shift',
    alias: 'shift'
  },
  {
    code: 18,
    name: 'Alt',
    alias: 'alt'
  },
  {
    code: 91,
    name: 'Meta',
    alias: 'cmd'
  }
]

/**
 * 转换按键名字，处理浏览器兼容与兼容 keypree.js
 * @param {Event} evt
 */
function convertKeyName (evt) {
  let keyName = evt.key.toLowerCase()

  keys.forEach(key => {
    if (
      key.code === evt.keyCode ||
      (
        Array.isArray(key.code) &&
        key.code.some(code => code === evt.keyCode)
      )
    ) {
      keyName = key.alias
    }
  })

  return keyName
}

/* eslint-disable */
/**
 * 检测按键
 * @param {string} keys 按键配置
 * @param {{keyName: string, keyCode: number, cmdKey: boolean, shiftKey: boolean, ctrlKey: boolean, altKey: boolean, innerHTML: string, evt: Event}} evtData keydown 事件回调函数加工后的数据
 */
/* eslint-enable */
function detectKey (keys, evtData) {
  const modifierKeys = ['alt', 'cmd', 'shift', 'ctrl']
  keys = keys.split(' ')

  // 匹配单个按键的情况，如 tab、up、down。需过滤修饰键被按下的情况
  if (keys.length === 1) {
    if (
      keys[0] === evtData.keyName &&
      modifierKeys.every(key => evtData[`${key}Key`] === false) // 没有按下修饰键
    ) return true
    return false
  }

  // 匹配多个按键，按键规则：修饰键（1或多）+普通按键（1）
  if (keys.length >= 2 && keys.some(key => key === evtData.keyName)) {
    // 配置的修饰键
    const confModifierKeys = keys.filter(key => {
      return modifierKeys.some(modifierKey => modifierKey === key)
    })
    // 其他修饰键
    const otherModifierKeys = modifierKeys.filter(modifierKey => {
      return confModifierKeys.every(key => key !== modifierKey)
    })

    // 对比配置的修饰键与当前按下的修饰键是否一样
    if (
      confModifierKeys.every(key => evtData[`${key}Key`] === true) &&
      otherModifierKeys.every(key => evtData[`${key}Key`] === false)
    ) {
      return true
    }
    return false
  }

  return false
}

export { convertKeyName, detectKey }
