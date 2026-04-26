<script setup>
import { ref, nextTick, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFileAPI, creatArticleAPI, updateArticleAPI } from '@/apis/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'
// 使用 defineModel 替代手动的 props + emits
const dialogVisible = defineModel()

const emit = defineEmits(['success'])
const props = defineProps({
  categories:{
    type:Array,
    default:()=>[]
  },
  article:{
    type:Object,
    default:null
  }
})

const formData = ref({
  "title": "",
  "content": "",
  "coverImage": "",
  "categoryId": 1,
  "summary": "",
  "tags": "",
  "tagArray": [],
  "id": ""
})

const rules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
    ,{ max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
})
// 弹窗关闭
const handleClose = () => {
  dialogVisible.value = false // 直接修改，会自动触发 update:modelValue 事件
  formRef.value.resetFields()
  businessId.value = null
  formData.value.tagArray = []
  dialogVisible.value = false
  handleRemove()
}
// 文章标签
const commonTags = [
"情绪管理", "焦虑", "抑郁", "压力", "睡眠",
"冥想", "正念", "放松", "心理健康", "自我成长",
"人际关系", "工作压力", "学习方法", "生活技巧"
]
// 封面图片上传
const imgUrl = ref('')
// 上传前校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  // 校验是否为图片文件
  if (!isImage) {
    ElMessage.error('请上传封面图片，请选择文件')
    return false
  }
  // 校验图片大小是否超过5MB
  const isLm5M = file.size /1024 /1024 <= 5
  if (!isLm5M) {
    ElMessage.error('封面图片大小不能超过5MB')
    return false
  }
  return true
}
// 上传请求
const businessId = ref(null)
const handleUploadRequest = async({file}) => {
  businessId.value = crypto.randomUUID()
  const res = await uploadFileAPI(file, { businessId:businessId.value })
  imgUrl.value = fileBaseUrl + res.filePath
  formData.value.coverImage = res.filePath
}
// 移除封面图片
const handleRemove = () => {
  imgUrl.value = ''
  formData.value.coverImage = ''
}
// 富文本
const handleContentChange = (data) => {
  formData.value.content = data.html
}
const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  if (formData.value.content && editor) {
    nextTick(() => {
      editor.setHtml(formData.value.content)
    })
  }
}
// 提交按钮loading
const loading = ref(false)
// 表单实例
const formRef = ref(null)
// 预览效果/隐藏预览
const btnPreview = ref(false)
// 提交表单
const handleSubmit =  () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
    } 
    const submitData = {
      ...formData.value,
      tags: formData.value.tagArray.join(',')
    }
    delete submitData.tagArray
    if(!isEdit.value) {
      submitData.id = businessId.value
      await creatArticleAPI(submitData)
      loading.value = false
      emit('success')
    }else {
      await updateArticleAPI(props.article.id, submitData)
      loading.value = false
      emit('success')
    }

   })
}
const isEdit = computed(() => !!props.article?.id)
// 编辑文字回显
watch(() => props.article, (newVal) => {
  nextTick(() => {
    if (newVal) {
      Object.assign(formData.value, newVal)
      businessId.value = newVal.id
      imgUrl.value = fileBaseUrl + newVal.coverImage
    }
  })
})
</script>
<template>
  <el-dialog :title="isEdit? '编辑文章' : '新增文章' " width="50%" v-model="dialogVisible" @close="handleClose">
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请输入标签" multiple filterable allow-create style="width: 100%">
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload action="#" class="avatar-uploader" :before-upload="beforeUpload" :http-request="handleUploadRequest" accept="image/*" :show-file-list="false">
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面图片</p>
            </div>
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" style="width: 200px;height: 120px; display: block;">
          </el-upload>
          <div class="cover-remove" v-if="imgUrl">
            <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor v-model="formData.content" placeholder="请输入文章内容,支持富文本格式。可以使用加粗、斜体、列表、标题等格式来丰富文章内容。" :maxCharCount="5000" max-height="400px" @change="handleContentChange" @created="handleEditorCreated"></RichTextEditor>
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color:#8b949e;
  background-color: #f6f8fa;
}
</style>