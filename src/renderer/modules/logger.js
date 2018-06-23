export const logger = {
  /**
   * 错误记录
   * @param {{msg: string, error: Error}} param0
   */
  error ({ msg, error }) {
    console.error(msg, error)
  }
}
