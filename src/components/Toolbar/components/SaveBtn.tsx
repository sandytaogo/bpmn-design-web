import { defineComponent, ref } from 'vue'
import { NButton } from 'naive-ui'
import modeler from '@/store/modeler'
import RemoteService from '@/utils/RemoteService'
import {getParam} from '@/utils/tools'
import { useI18n } from 'vue-i18n'

const SaveBtn = defineComponent({
  name: 'SaveBtn',
  setup() {
    const { t } = useI18n()
    const modelerStore = modeler()
    const saveBpmnFile = async (e) => {

      const modeler = modelerStore.getModeler!
      const { xml } = await modeler.saveXML({format: true, preamble: true })
      let bpmnId = getParam('bpmnId')
      let processId = getParam('processId')
      try {
        RemoteService.post('../user/workflow/bpm/save', {bpmnId:bpmnId, id: processId, data: xml}).then((res) => {
          if (res.code == 200) {
            window._messageBox.success(res.msg);
          } else {
            window._messageBox.error(res.msg);
          }
        })
      } catch (e) {
        window._messageBox.error('尚未登录或系统繁忙');
      }
    }
    return () => (
      <span>
        <NButton type="info" secondary onClick={saveBpmnFile}>
          {t('toolbar.saveBtn')}
        </NButton>
      </span>
    )
  }
})

export default SaveBtn
