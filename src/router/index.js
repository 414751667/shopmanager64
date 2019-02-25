import Vue from 'vue'
import Router from 'vue-router'
import {
  Message
} from 'element-ui';
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Cateparams from '@/components/cateparams.vue'
import Goodscate from '@/components/goodscate.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: Users
    }, {
      name: 'rights',
      path: '/rights',
      component: Rights
    }, {
      name: 'roles',
      path: '/roles',
      component: Roles
    },{
      name: 'goods',
      path: '/goods',
      component: Goodslist
    },{
      name: 'goodsadd',
      path: '/goodsadd',
      component: Goodsadd
    },{
      name: 'params',
      path: '/params',
      component: Cateparams
    },{
      name: 'categories',
      path: '/categories',
      component: Goodscate
    }
  ]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }]
})

//路由的导航守卫
router.beforeEach((to, form, next) => {
  // console.log("路由守卫执行---");

  if (to.name === 'login') {
    next();
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      //提示框
      // this.$message.warning("请先登陆");
      Message.warning("请先登陆！")

      // this,$roter.push({name:"login"})
      router.push({
        name: 'login'
      })
      return;
    }
    //next方法
    next();
  }


})

export default router;
//   if (!localStorage.getItem('token')) {
//   this.$router.push({
//     name: 'login'
//   })
//   this.$message.warning('请先登陆')
// }
