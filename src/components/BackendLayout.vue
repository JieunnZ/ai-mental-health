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
        <el-main><RouterView></RouterView></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container{
    height: 100%;
  }
}
</style>
