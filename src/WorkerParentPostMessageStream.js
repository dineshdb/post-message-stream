import BasePostMessageStream from './BasePostMessageStream.js'
import { DEDICATED_WORKER_NAME } from './enums.js'

/**
 * Parent-side Dedicated Worker postMessage stream.
 */
export default class WorkerParentPostMessageStream extends BasePostMessageStream {

  constructor ({
    worker,
  } = {}) {

    super()

    this._target = DEDICATED_WORKER_NAME
    this._worker = worker
    this._worker.onmessage = this._onMessage.bind(this)

    this._handshake()
  }

  // private

  _onMessage (event) {
    const message = event.data

    // validate message
    if (
      (typeof message !== 'object') ||
      (!message.data)
    ) {
      return
    }

    this._onData(message.data)
  }

  _postMessage (data) {
    this._worker.postMessage({
      target: this._target,
      data,
    })
  }

  _destroy () {
    this._worker.onmessage = null
    this._worker = null
  }
}
