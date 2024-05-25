import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import EditItem from '@/components/common/EditItem.vue'
import i18n from '@/i18n'

import {createDiscreteApi, create, NColorPicker, NConfigProvider, NMessageProvider,
        NDialogProvider, NButton, NButtonGroup, NTag, NCollapse, NCollapseItem, NDataTable, 
        NPopover, NDrawer, NDrawerContent, NModal, NCode, NForm, NFormItem, NInput, 
        NInputNumber, NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NSelect, NSwitch 
} from 'naive-ui'

const naive = create({ components: [ NColorPicker, NConfigProvider, NMessageProvider, 
      NDialogProvider, NButton, NButtonGroup, NTag, NCollapse, NCollapseItem, NDataTable,
      NPopover, NDrawer, NDrawerContent, NModal, NCode, NForm, NFormItem, NInput,
      NInputNumber, NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NSelect, NSwitch]
})

const { message, notification, dialog, loadingBar } = createDiscreteApi([
    'message',
    'dialog',
    'notification',
    'loadingBar'
])
window._messageBox = message

const pinia = createPinia()

