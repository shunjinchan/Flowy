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
 * @param {string} keys
 * @param {{keyName: string, keyCode: number, cmdKey: boolean, shiftKey: boolean, ctrlKey: boolean, altKey: boolean, innerHTML: string, evt: Event}} data
 */
/* eslint-enable */
function detectKey (keys, data) {
  const modifierKeys = ['alt', 'cmd', 'shift', 'ctrl']
  keys = keys.split(' ')

  if (keys.length === 1) {
    if (
      keys[0] === data.keyName &&
      modifierKeys.every(key => data[`${key}Key`] === false)
    ) return true
    return false
  }

  if (keys.length >= 2) {
    if (keys.some(key => key === data.keyName)) {
      // 配置的修饰键
      const confModifierKeys = keys.filter(key => {
        return modifierKeys.some(modifierKey => modifierKey === key)
      })
      // 其他修饰键
      const otherModifierKeys = modifierKeys.filter(modifierKey => {
        return confModifierKeys.every(key => key !== modifierKey)
      })

      // 比对修饰键，按下的按键值为 true，没有按下的为 false
      if (
        confModifierKeys.every(key => data[`${key}Key`] === true) &&
        otherModifierKeys.every(key => data[`${key}Key`] === false)
      ) {
        return true
      }
      return false
    }
    return false
  }

  return false
}

export { convertKeyName, detectKey }
