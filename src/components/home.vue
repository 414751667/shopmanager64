<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="图片加载失败">
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏-->
        <el-menu
          accordion
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <!-- 1 -->
          <el-submenu 
          :index="item1.order+''" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data(){
      return {
        menus:[]
      }
    },
  // 如果用户没登陆 --> if(!token)-->改标识this.$router.push-->显示logo.vue
  // 如果登陆了 --> if(token)-->继续渲染home.vue
  // 代码位置

  beforeMount () {
    
    //判断token有没有
  },
  mounted () {
    // console.log(111)
  },
  created(){
    this.getMenus();
  },
  methods: {
    //动态导航
     async getMenus() {
      const res = await this.$http.get(`menus`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.menus = data;
      }
    },
    // 退出
    handleLoginout () {
      // 1.清除token
      localStorage.clear();
      // 2.来到登陆页
      this.$router.push({
        name: 'login'
      })
      // 3.提示
      this.$message.warning('退出成功')
    }
  }
}
</script>

<style>
.container {
  background: #b3c0d1;
  height: 100%;
}
.middle {
  line-height: 60px;
  text-align: center;
  color: #ffffff;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
.aside{
  background: #ffffff;
  margin-top: 2 0px;
}
</style>
