import { getLastEditNode } from '@/modules/storage'

export default {
  root: {},
  lastEditNode: getLastEditNode() || 'root'
}
