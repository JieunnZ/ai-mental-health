<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
</script>
<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <SideBar></SideBar>
      <el-container>
        <el-header><NavBar></NavBar></el-header>
        <el-main class="main-content"><RouterView class="content-container"></RouterView></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .el-header {
    height: 74px !important;
  }
  .main-container{
    height: 100%;
    .content-container{
      padding: 20px;
      background-color: #fff;
      min-height: calc(100vh - 74px);
    }
  }
}
</style>
