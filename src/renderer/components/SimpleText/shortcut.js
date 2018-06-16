import { detectKey } from '@/modules/keyboard'

function monitor (conf, data) {
  conf.forEach(keyConf => {
    if (detectKey(keyConf.keys, data)) {
      typeof keyConf.handler === 'function' && keyConf.handler()
    }
  })
}

function shortcut (data) {
  monitor([
    {
      keys: 'enter',
      handler: this.handleKeydownEnter.bind(this, data.evt)
    },
    {
      keys: 'delete',
      handler: this.handleKeydownDelete.bind(this, data.evt)
    },
    {
      keys: 'cmd b',
      handler: this.handleKeydownMetaAndB.bind(this, data.evt)
    },
    {
      keys: 'cmd u',
      handler: this.handleKeydownMetaAndU.bind(this, data.evt)
    },
    {
      keys: 'cmd i',
      handler: this.handleKeydownMetaAndI.bind(this, data.evt)
    },
    {
      keys: 'shift cmd b',
      handler: this.handleKeydownShiftAndMetaAndB.bind(this, data.evt)
    }
  ], data)
}

export { shortcut }
