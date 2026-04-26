<script setup>
import { ref } from 'vue'
import { loginAPI } from '@/apis/admin'
import { Back } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineOptions({
  name:'LoginPage'
})
const formData = ref({
  username:'',
  password:''
})
const ruleFormRef = ref(null)
// 校验规则
const rules = ref({
  username:[
    {required:true,message:'请输入用户名或密码',trigger:'blur'}
  ],
  password:[
    {required:true,message:'请输入密码',trigger:'blur'}
  ]
})
const submitForm=async (formEl) => {
  if (!formEl) return
   formEl.validate( async (valid) => {
    if (valid) {
      const res = await loginAPI(formData.value)
      const token = res.token
      // 判断是否有token
       if (!token) {
          return console.error("登录失败")
        }
        // 登录成功后，将token和userInfo信息存储到localStorage中
        localStorage.setItem('token', token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        // 根据用户角色决定跳转路径
        if (res.userInfo.userType === 2) {
          router.push('/back/dashboard')
        }else {
          router.push('/')
        }
    }
  })
}

</script>
<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back/></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <el-button class="btn" size="large" @click="submitForm(ruleFormRef)" type="primary">登录账号</el-button>
      </el-form>
      <div class="footer">
        <p>还没有账户?<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container{
  width: 384px;
  .title{
    .back-home{
      margin-bottom: 60px;
    }
    .title-text{
      text-align: center;
      h2{
        font-size: 36px;
        margin-bottom: 10px;
      }
      p{
        font-size: 18px;
        color:#6b7280
      }
    }
  }
  .form-container{
    margin-top: 30px;
    .btn{
      margin-top: 40px;
      width: 100%;
    }
    .footer{
      padding: 30px;
      text-align: center;
    }
  }
}
</style>

