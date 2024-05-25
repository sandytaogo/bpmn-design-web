import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import { ElementLike } from 'diagram-js/lib/core'

declare global {
  interface Window {
    bpmnInstances: any
    _messageBox: MessageApiInjection
  }

  type BpmnElement = ElementLike & { type: string }
}

declare interface Window {
  bpmnInstances: any
}
