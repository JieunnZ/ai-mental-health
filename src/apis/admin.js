import serve from '@/untils/request'
// 登录接口
export const loginAPI = (data) => {
  return serve.post('/user/login', data)
}
// 获取分类
export const categoryTreeAPI = () => {
  return serve.get('/knowledge/category/tree')
}
// 知识文章列表
export const articlePageAPI = (params) => {
  return serve.get('/knowledge/article/page', { params })
}
// 图片文件上传
export const uploadFileAPI = (file, businessInfo) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return serve.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 文章新增
export const creatArticleAPI = (data) => {
  return serve.post('/knowledge/article', data)
}
// 获取知识文章详情
export const articleDetailAPI = (id) => {
  return serve.get(`/knowledge/article/${id}`)
}
// 更新知识文章
export const updateArticleAPI = (id, data) => {
  return serve.put(`/knowledge/article/${id}`, data)
}
// 更新文章状态
export const changeArticleStatusAPI = (id, data) => {
  return serve.put(`/knowledge/article/${id}/status`, data)
}
// 删除知识文章
export const deleteArticleAPI = (id) => {
  return serve.delete(`/knowledge/article/${id}`)
}
// 分页查询咨询会话
export const consultationPageAPI = (params) => {
  return serve.get('/psychological-chat/sessions', { params })
}
// 获取会话消息列表
export const getSessionDetailAPI = (sessionId) => {
  return serve.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 分页查询情绪日记
export const emotionalPageAPI = (params) => {
  return serve.get('/emotion-diary/admin/page', { params })
}
// 删除情绪日记
export const deleteEmotionalAPI = (id) => {
  return serve.delete(`/emotion-diary/admin/${id}`)
}
// 获取综合数据分析
export const AnalyticsOverviewAPI = () => {
  return serve.get('/data-analytics/overview')
}
// 用户退出登录
export const logoutAPI = () => {
  return serve.post('/user/logout')
}