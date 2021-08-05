<template>
  <el-row>
    <el-col :span="12">
      <el-card class="box-card">
      <template #header>
        <div class="card-header">
         <span>接入设备</span>
        </div>
      </template>
      <div class="text item">
        合计：{{totalclient}}
      </div>
      <div class="text item">
        允许接入：{{available}}
      </div>
      <div class="text item">
        新增等待关联：{{newwaitset}}
      </div>
      <div class="text item">
        未关联能接入：{{noset}}
        <el-button class="button card-rigth" type="text">一键设置</el-button>
      </div>
    </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
      <template #header>
        <div class="card-header">
         <span>交换机</span>
        </div>
      </template>
      <div class="text item">
        合计：{{totaldevice}}
      </div>
      <div class="text item">
        自动增加：{{autoinsert}}
      </div>
      <div class="text item">
        自动接入：{{autoaccept}}
      </div>
    </el-card>
    </el-col>
  </el-row >
  <!-- <template>
  <el-descriptions title="用户信息">
    <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
    <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
    <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
    <el-descriptions-item label="备注">
      <el-tag size="small">学校</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
  </el-descriptions>
  </template> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getclientdashboard } from '@/api/client'
import { getdevicedashboard } from '@/api/device'

@Component({
  name: 'Dashboard'
})

export default class extends Vue {
  private totalclient = 0
  private available = 0
  private newwaitset = 0
  private noset = 0

  private totaldevice = 0
  private autoinsert =0
  private autoaccept = 0

  created() {
    this.getclientList()
    this.getdeviceList()
  }

  private async getclientList() {
    const { data } = await getclientdashboard()
    this.totalclient = data.total
    this.available = data.available
    this.newwaitset = data.newwaitset
    this.noset = data.noset
  }

  private async getdeviceList() {
    const { data } = await getdevicedashboard()
    this.totaldevice = data.total
    this.autoinsert = data.autoinsert
    this.autoaccept = data.autoaccept
  }
}
</script>

<style lang="scss" scoped>
  .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .box-card {
    width: 450px;
    margin: 40px;
  }
  .card-rigth {
    padding-left: 150px
  }
</style>
