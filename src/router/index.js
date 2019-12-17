import Vue from 'vue'
import Router from 'vue-router'
import UserSystem from '@/components/UserSystem'
import RoleSys from '@/components/RoleSys'
import PdmSys from '@/components/PdmSys'
import PdmsysComfirm from '@/components/PdmsysComfirm'
import SechuleSys from '@/components/SechuleSys'
import MaterialOrder from '@/components/MaterialOrder'
import Echart1 from '@/components/Echart1'
import EchartJS1 from '@/components/EchartJS1'
import EchartJS2 from '@/components/EchartJS2'
import EchartJS3 from '@/components/EchartJS3'

Vue.use(Router)
Vue.component(UserSystem.name, UserSystem)

export default new Router({
  routes: [
    {
      path: '/user',
      name: 'UserSystem',
      component: UserSystem
    }, {
      path: '/role',
      name: 'RoleSys',
      component: RoleSys
    }, {
      path: '/pdm',
      name: 'PdmSys',
      component: PdmSys
    }, {
      path: '/pdmcomfirm',
      name: 'PdmsysComfirm',
      component: PdmsysComfirm
    }, {
      path: '/sechule',
      name: 'SechuleSys',
      component: SechuleSys
    }, {
      path: '/order',
      name: 'MaterialOrder',
      component: MaterialOrder
    },
    {
      path: '/echart1',
      name: 'Echart1',
      component: Echart1
    },
    {
      path: '/echartjs1',
      name: 'EchartJS1',
      component: EchartJS1
    },
    {
      path: '/echartjs2',
      name: 'EchartJS2',
      component: EchartJS2
    },
    {
      path: '/echartjs3',
      name: 'EchartJS3',
      component: EchartJS3
    }
  ]
})
