import { logger } from '@/modules/logger'

export default {
  getNode: (state) => {
    return (_id) => {
      if (state.hasOwnProperty(_id)) return state[_id]
      logger.error({
        msg: `state 中没有找到 _id 为 ${_id} 的节点`
      })
      return null
    }
  },

  lastEditNode (state) {
    return state.lastEditNode
  }
}
