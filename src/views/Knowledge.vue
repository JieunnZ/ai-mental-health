<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTreeAPI,articlePageAPI,articleDetailAPI,changeArticleStatusAPI,deleteArticleAPI } from '@/apis/admin'
import {ref} from 'vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox,ElMessage } from 'element-plus'
defineOptions({
  name: 'KnowledgePage',
})
const formItem = [
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',placeholder:'请选择分类'},
  {comp:'select',prop:'status',label:'状态',placeholder:'请选择状态',options:[
    {label:'草稿',value:'0'},
    {label:'已发布',value:'1'},
    {label:'已下线',value:'2'},
  ]},
]
// // 分页参数
const pagination = ref({
  currentPage:1,
  size:10,
  total:0
})
// 查询
const handleSearch = async (formData) => {
  const params = {
    ...pagination.value,
    ...formData
  }
  const res = await articlePageAPI(params)
  tableData.value = res.records
  pagination.value.total = res.total
}
// 分页改变
const handleChange = (page) => {
  pagination.value.currentPage = page
  handleSearch()
}
// 新增/编辑成功
const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}
// 新增/编辑弹窗控制
const dialogVisible = ref(false)
// 获取分类
// 分类映射
const categoryMap = ref({})
// 分类列表
const categories = ref([])
// 列表数据
const tableData = ref([])
const getCategoryTree = async () => {
  const res = await categoryTreeAPI()
  categories.value = res.map(item => {
    categoryMap.value[item.id] = item.categoryName  
    return {
      label:item.categoryName,
      value:item.id
    }
  })
  formItem[1].options = categories.value
  handleSearch()
}
getCategoryTree()
// 编辑文章
const currentArticle = ref(null)
const handleEdit = async (row) => {
  if (!row.id) {
    currentArticle.value = null
    dialogVisible.value = true
  }else {
    const res = await articleDetailAPI(row.id)
    currentArticle.value = res
    dialogVisible.value = true
  }
}
// 发布文章
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布文章${row.title}`,'确认',{
    confirmButtonText:'确认发布',
    cancelButtonText:'取消',
    type:'info'
  }).then(async () => {
    await changeArticleStatusAPI(row.id,{status:1})
    ElMessage.success('发布成功')
    handleSearch()
  })
}
// 下线文章
const handleUnpublish = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}`,'确认',{
    confirmButtonText:'确认下线',
    cancelButtonText:'取消',
    type:'warning'
  }).then(async () => {
    await changeArticleStatusAPI(row.id,{status:2})
    ElMessage.success('下线成功')
    handleSearch()
  })
}
// 删除文章
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章${row.title}`,'确认',{
    confirmButtonText:'确认删除',
    cancelButtonText:'取消',
    type:'danger'
  }).then(async () => {
    await deleteArticleAPI(row.id)
    ElMessage.success('删除成功')
    handleSearch()
  })
}
</script>
<template>
  <div class="knowledge">
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <el-table :data="tableData" style="width: 100%; margin-top:25px">
    <el-table-column label="文章标题" style="width: 450px;" fixed="left">
        <template #default="scope">
          <div style="display:flex" align-items="center">
            <el-icon ><timer/></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
    </el-table-column>
    <el-table-column label="分类" style="width: 150px;">
      <template #default="scope">
        <div style="display:flex" align-items="center">
          <span>{{ categoryMap[scope.row.categoryId] }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="authorName" style="width: 150px" label="作者"></el-table-column>
    <el-table-column prop="readCount" style="width: 150px" label="阅读量"></el-table-column>
    <el-table-column prop="updatedAt" style="width: 150px" label="发布时间"></el-table-column>
    <el-table-column label="操作" style="width: 240px;" fixed="right">
      <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button text type="success" v-if="scope.row.status === 0 || scope.row.status === 2" @click="handlePublish(scope.row)">发布</el-button>
          <el-button text type="warning" v-if="scope.row.status === 1" @click="handleUnpublish(scope.row)">下线</el-button>
          <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination layout="prev, pager, next" :total="pagination.total" :page-size="pagination.size" @change="handleChange" style="margin-top:25px"></el-pagination>
    <!-- 新增/编辑弹窗 -->
    <ArticleDialog v-model="dialogVisible" :categories="categories" @success="handleSuccess" :article="currentArticle"></ArticleDialog>
  </div>
</template>

