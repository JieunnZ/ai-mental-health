<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { emotionalPageAPI, deleteEmotionalAPI } from '@/apis/admin'
import { ElMessageBox } from 'element-plus'
import { ref} from 'vue'
defineOptions({
  name: 'EmotionalPage',
})
// 情绪标签类型
const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
// 搜索条件
const formItem = [
  {comp:'input', prop:'userId', label:'用户ID', placeholder:'请输入用户ID'},
  {comp:'select',prop:'moodScreRange',label:'情绪评分',placeholder:'请选择评分范围',options:[
    {label:'低分(1-3分)',value:'1-3'},
    {label:'中分(4-6分)',value:'4-6'},
    {label:'高分(7-10分)',value:'7-10'}
  ]}
] 
//分页参数
const pagination = ref({
  currentPage:1,
  size:10,
  total:0
})
// 分页改变
const handleChange = (page) => {
  pagination.value.currentPage = page
  handleSearch()
}
// 列表数据
const tableData = ref([])
// 查询情绪日记
const handleSearch = async (formData) => {
  const params = {
    ...pagination.value,
    ...formData
  }
  const res = await emotionalPageAPI(params)
  tableData.value = res.records
  pagination.value.total = res.total
}
handleSearch()
// 详情弹窗
const detailDialogVisble = ref(false)
// 会话详情
const currentDetail = ref(null)
// AI情绪分析结果
const aiData = ref(null)
// 查看会话详情
const viewSessionDetail = (row) => {
  currentDetail.value = row
  detailDialogVisble.value = true
  if (row.aiEmotionAnalysis) {
    aiData.value = JSON.parse(row.aiEmotionAnalysis)
  }else{
    aiData.value = {}
  }
}
// 删除情绪日记
const deleteEmotional = async (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async () => {
    await deleteEmotionalAPI(row.id)
    handleSearch()
  })
}
</script>
<template>
  <div class="emotional">
    <PageHead title="情绪日志"></PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <el-table :data="tableData" width="100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <el-avatar>{{scope.row.nickname}}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="120"></el-table-column>
      <el-table-column label="情绪评分" >
        <template #default="scope">
         <el-rate :model-value="scope.row.moodScore" :max="10" disabled></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="120" >
        <template #default="scope">
          <div>
            <p>睡眠：{{ scope.row.sleepQuality }}/5</p>
            <p>压力：{{ scope.row.stressLevel }}/5</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120"></el-table-column>
      <el-table-column prop="diaryContent" label="日记内容" width="250"></el-table-column>
    <el-table-column label="操作" style="width: 240px;" fixed="right">
      <template #default="scope">
          <el-button text type="primary" @click="viewSessionDetail(scope.row)">详情</el-button>
          <el-button text type="danger" @click="deleteEmotional(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination layout="prev, pager, next" :total="pagination.total" :page-size="pagination.size" @change="handleChange" style="margin-top:25px"></el-pagination>
     <!-- 详情弹窗 -->
     <el-dialog v-model="detailDialogVisble" title="情绪日志详情" width="800px" :close-on-click-modal="false">
      <div v-if="currentDetail" class="detail-content">
        <div class="detail-session">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{currentDetail.username}}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{currentDetail.nickname}}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{currentDetail.userId}}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{currentDetail.diaryDate}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-session">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="currentDetail.moodScore" :max="10" disabled></el-rate>
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(currentDetail.dominantEmotion)">{{currentDetail.dominantEmotion || "-"}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{currentDetail.sleepQuality || "-"}}</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{currentDetail.stressLevel || "-"}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-session">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">{{currentDetail.emotionTriggers || "无"}}</el-descriptions-item>
            <el-descriptions-item label="日记内容">{{currentDetail.diaryContent || "无"}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-session">
          <h4>AI情绪分析结果</h4>
          <div class="ai-analysis-result">
           <el-descriptions :column="2" border>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{aiData.primaryEmotion}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress :percentage="aiData.emotionScore" :color="getEmotionScoreColor(aiData.emotionScore)" :stroke-width="8"></el-progress>
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getRiskLevelTagType(aiData.riskLevel)">{{getRiskLevelText(aiData.riskLevel)}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag :type="aiData.isNegative ? 'danger' : 'success'">{{aiData.isNegative ? '负面情绪' : '正面情绪'}}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">{{aiData.suggestion || "无"}}</div>
          </div>
          <div class="ai-risk-section">
            <h5>风险描述</h5>
            <div class="risk-content">{{aiData.riskDescription || "无"}}</div>
          </div>
          <div class="ai-improvements-section">
            <h5>改善建议</h5>
            <ul class="improvement-list">
              <li v-for="item in aiData.improvementSuggestions" :key="item">{{item}}</li>
            </ul>
          </div>
          </div>
        </div>
        <div class="detail-session">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{currentDetail.createdAt}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{currentDetail.updatedAt}}</el-descriptions-item> 
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisble = false">关闭</el-button>
      </template>
     </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;

    i {
      margin-right: 4px;
    }
  }

  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;

    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;

      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }

  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }

  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }

  .improvement-list {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }

  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;

    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;

      i {
        margin-right: 4px;
      }
    }
  }

  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
