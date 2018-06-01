import db from '@/datastore'
import { logger } from '../modules/logger'

export async function findOneAsync (data) {
  try {
    const docs = await db.findOneAsync(data)
    return docs
  } catch (error) {
    logger.error({
      msg: 'error when call method find on async',
      error
    })
    return null
  }
}

export async function insertAsync (data) {
  try {
    const node = await db.insertAsync(data)
    return node
  } catch (error) {
    logger.error({
      msg: 'error when insert node',
      error
    })
    return null
  }
}

export async function updateAsync (query, update, options) {
  try {
    const {
      numAffected,
      affectedDocuments,
      upsert
    } = await db.updateAsync(query, update, options)
    return {
      numAffected,
      affectedDocuments,
      upsert
    }
  } catch (error) {
    logger.error({
      msg: 'error when update node',
      error
    })
    return {}
  }
}
