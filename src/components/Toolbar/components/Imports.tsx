import { defineComponent, ref } from 'vue'
import { NButton } from 'naive-ui'
import modeler from '@/store/modeler'
import { useI18n } from 'vue-i18n'
import RemoteService from '@/utils/RemoteService'
import {getParam} from '@/utils/tools'

const Imports = defineComponent({
  name: 'Imports',
  setup() {
    const { t } = useI18n()
    const modelerStore = modeler()
    
    const importRef = ref<HTMLInputElement | null>(null)

    const openImportWindow = () => {
      importRef.value && importRef.value.click()
    }

    const changeImportFile = () => {
      if (importRef.value && importRef.value.files) {
        const file = importRef.value.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          const xmlStr = this.result
          modelerStore.getModeler!.importXML(xmlStr as string)
        }
        importRef.value.value = ''
        importRef.value.files = null
      }
    }

    let bpmnId = getParam('bpmnId')
    if (bpmnId) {
      RemoteService.get('../user/bpm/get', {params:{bpmnId:bpmnId}}).then((res) => {
        if (res.code == 200) {
          modelerStore.getModeler!.importXML(res.data as string)
        } else {
          window._messageBox.error(res.msg);
        }
      })
    }
    
    return () => (
      <span>
        <NButton type="info" secondary onClick={openImportWindow}>{t('toolbar.openFile')}</NButton>
        <input type="file" ref={importRef} style="display: none" accept=".xml,.bpmn" onChange={changeImportFile}></input>
      </span>
    )
  }
})

export default Imports
