<script setup lang="ts">
  import { type PropType, ref } from 'vue'
  import { getBusinessObject, type ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
  import debounce from 'lodash.debounce'
  import useElementUpdateListener from '@/hooks/useElementUpdateListener'
  import catchUndefElement from '@/utils/CatchUndefElement'
  import editor from '@/store/editor'
  import modeler from '@/store/modeler'
  import { SelectOption } from 'naive-ui'
  import RemoteService from '@/utils/RemoteService'
  import {sm2} from 'sm-crypto'
  import { useI18n } from 'vue-i18n'

  function getExPropValue<T>(element: any, propKey: string): T {
    const exPropKey = `${editor().getProcessEngine}:${propKey}`
    return element && element.get ? element.get(exPropKey) : element ? element[exPropKey] : element
  }
  const updateExModdleProp = debounce (
    function (
      element: BpmnElement,
      moddleElement: ModdleElement,
      propKey: string,
      propValue: unknown
    ) {
      const modeling = modeler().getModeling
      const exPropKey = `${editor().getProcessEngine}:${propKey}`
      modeling!.updateModdleProperties(element, moddleElement, {
        [exPropKey]: propValue === '' ? undefined : propValue
      })
    },
    300,
    { leading: true }
  )

  const props = defineProps({
    labelWidth: {
      type: Number as PropType<number>,
      default: 100
    }
  })

  let scopedElement: BpmnElement | undefined = undefined
  let scopedBO: ModdleElement | undefined = undefined

  type UserAssigneeProp =
    | 'assignee'
    | 'candidateUsers'
    | 'candidateGroups'
    | 'dueDate'
    | 'followUpDate'
    | 'priority'

  const PROP_KEYS: UserAssigneeProp[] = [
    'assignee',
    'candidateUsers',
    'candidateGroups',
    'dueDate',
    'followUpDate',
    'priority'
  ]

  const { t } = useI18n()

  var publickey = window.localStorage.getItem("bg_server_sm2_public_key");
  var privatekey = window.localStorage.getItem("bg_sm2_private_key");
  const EmptyUAForm = PROP_KEYS.reduce((a, b) => (a[b] = '') || a, {})

  const UAForm = ref(EmptyUAForm as Record<UserAssigneeProp, string>)

  const updateUserAssignProp = (key: UserAssigneeProp, value: string) => {
    updateExModdleProp(scopedElement!, scopedBO!, key, value)
  }

  const reloadElementData = () =>
    catchUndefElement((element) => {
      console.log(element.id)
      scopedElement = element
      scopedBO = getBusinessObject(element)
      for (const key of PROP_KEYS) {
        UAForm.value[key] = getExPropValue(scopedBO!, key) || ''
      }
      console.log(UAForm.value)
    })
  useElementUpdateListener(reloadElementData)

  const candidateUsersOptions = []

  const candidateUsersOptionsRef = ref<SelectOption[]>(candidateUsersOptions)

  const candidateUsersLoadingRef = ref(false)
    
  const candidateUsersHandleSearch = function(search) {
    candidateUsersLoadingRef.value = true
    if (publickey && publickey) {
        let kw= sm2.doEncrypt(search, publickey, 0)
        RemoteService.get('../user/system/user/search?kw=' + kw).then((res) => {
            let encryptText = res.startsWith("04") ? res.substring(2, res.length) : res
            console.log(encryptText)
            let data = sm2.doDecrypt(encryptText, privatekey, 0);
            console.log(data)
           // data = $.parseJSON(data)
           data = JSON.parse(data)
            var optionData = [];
            for (let i =0; i < data.length; i++) {
              optionData.push({value:data[i].id, label:data[i].account ? data[i].account : data[i].mobile})
            }
            candidateUsersOptionsRef.value = optionData
            candidateUsersLoadingRef.value = false
        })
    } else {
      setTimeout(() => {
        candidateUsersOptionsRef.value = [{value:'-1', label:'请登录系统'}]
        candidateUsersLoadingRef.value = false
      , 1000});
    }
  } 

</script>

<template>
  <n-collapse-item name="element-user-assignment">
    <template #header>
      <collapse-title title="用户分配">
        <lucide-icon name="Contact" />
      </collapse-title>
    </template>
    <div>
      <edit-item :label-width="labelWidth" :label="$t('panel.assignee')">
        <n-select v-model:value="UAForm.assignee" placeholder="分配人" :options="candidateUsersOptionsRef" :loading="candidateUsersLoadingRef" filterable clearable remote @search="candidateUsersHandleSearch"
          @change="updateUserAssignProp('assignee', $event)"
        />
      </edit-item>
      <edit-item :label-width="labelWidth" :label="$t('panel.candidateUsers')">
        <n-select v-model:value="UAForm.candidateUsers" placeholder="候选人" :options="candidateUsersOptionsRef" :loading="candidateUsersLoadingRef" filterable clearable remote multiple @search="candidateUsersHandleSearch"
        @change="updateUserAssignProp('candidateUsers', $event)" />
      </edit-item>
      <edit-item :label-width="labelWidth" :label="$t('panel.candidateGroups')">
        <n-input v-model:value="UAForm.candidateGroups" @change="updateUserAssignProp('candidateGroups', $event)" />
      </edit-item>
      <edit-item
        :label-width="labelWidth"
        :label="$t('panel.dueDate')"
        description="The due date as an EL expression (e.g. ${someDate}) or an ISO date (e.g. 2015-06-26T09:54:00)."
      >
        <n-input v-model:value="UAForm.dueDate" @change="updateUserAssignProp('dueDate', $event)" />
      </edit-item>
      <edit-item
        :label-width="labelWidth"
        :label="$t('panel.followUpDate')"
        description="The follow up date as an EL expression (e.g. ${someDate}) or an ISO date (e.g. 2015-06-26T09:54:00)."
      >
        <n-input
          v-model:value="UAForm.followUpDate"
          @change="updateUserAssignProp('followUpDate', $event)"
        />
      </edit-item>
      <edit-item :label-width="labelWidth" :label="$t('panel.priority')">
        <n-input
          v-model:value="UAForm.priority"
          @change="updateUserAssignProp('priority', $event)"
        />
      </edit-item>
    </div>
  </n-collapse-item>
</template>
