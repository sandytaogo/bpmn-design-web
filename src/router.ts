import {createRouter, createWebHistory} from 'vue-router'


import HomeView from './views/home.vue'
import BpmnView from './views/bpmn.vue'
import AboutView from './views/about.vue'

const routes = [
    {title:'首页', path: '/', component: HomeView},
    {title:'bpmn desigin', path: '/bpmn', component: BpmnView},
    { title:'关于', path: '/about', component: AboutView},
  ]

const router =  createRouter({
    history:createWebHistory(),
    routes : routes
})

export default router