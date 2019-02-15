<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登陆</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登陆请求
    handleLogin () {
      // 前提：api-server -> app.js
      this.$http
        .post(`login`, this.formdata)
        .then(res => {
          console.log(res)
          //   const {
          //     data: {
          //       data,
          //       meta: { msg, status }
          //     }
          //   } = res
          const status = res.data.meta.status
          if (status === 200) {
            // 渲染home.vue
            this.$router.push({
              name: 'home'
            })
          } else {
            // 提示框 UI
            this.$message.error('密码错误')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
.login-wrap {
  /* 注意: 百分比布局 父元素height */
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #ffffff;
  border-radius: 5px;
  /* 开发 */
  width: 400px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
