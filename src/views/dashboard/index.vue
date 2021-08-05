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
        合计：<span class="number">{{totalclient}}</span>
      </div>
      <div class="text item">
        允许接入：
        <el-tooltip class="item" effect="dark" content="能接入网络的有效接入设备。" placement="top-start">
          <span class="number">{{available}}</span>
        </el-tooltip>
      </div>
      <div class="text item">
        新增等待关联：
        <el-tooltip class="item" effect="dark" content="交换机自动增加的设备，需要填写真实用户名称，以关联用户。" placement="top-start">
          <span class="number">{{newwaitset}}</span>
        </el-tooltip>
      </div>
      <div class="text item">
        能接入未关联：
        <el-tooltip class="item" effect="dark" content="没有真实名称又能接入的设备，有安全隐患。" placement="top-start">
          <span class="number">{{noset}}</span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="将所有未关联真实名称的接入设备设置为拒绝接入，以满足安全需求。" placement="top-start">
          <el-button class="button card-rigth" type="primary" @click="handledoneset">一键设置</el-button>
        </el-tooltip>  
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
        合计：<span class="number">{{totaldevice}}</span>
      </div>
      <div class="text item">
        自动增加：
        <el-tooltip class="item" effect="dark" content="为方便增加设备，所有交换机都应设置自动增加。" placement="top-start">
          <span class="number">{{autoinsert}}</span>
        </el-tooltip>
        <span v-if="!(autoinsert===totaldevice)">
          <el-tooltip class="item" effect="dark" content="安全警告。" placement="top-start">
            <i class="el-icon-warning-outline icon-rigth"></i>
          </el-tooltip>
        </span>
      </div>
      <div class="text item">
        自动接入：
        <el-tooltip class="item" effect="dark" content="为安全接入，所有交换机都应不设置为自动接入。" placement="top-start">
          <span class="number">{{autoaccept}}</span>
        </el-tooltip>
        <span v-if="autoaccept>0">
          <el-tooltip class="item" effect="dark" content="安全警告。" placement="top-start">
            <i class="el-icon-warning-outline icon-rigth"></i>
          </el-tooltip>
        </span>
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
import { getclientdashboard, oneclickset } from '@/api/client'
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

  private handledoneset() {
    this.$confirm('此操作未关联的设备全部设置为拒绝接入, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.tooneset()
    })
  }

  private async tooneset() {
    await oneclickset()
    this.getclientList()
    this.getdeviceList()
    this.$message({
      message: '一键设置完成。',
      type: 'success'
    })
  }
}
</script>

<style lang="scss" scoped>
  .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 22px;
  }
  .text {
    font-size: 18px;
    height: 30px;
  }
  .number {
    font-size: 22px;
  }
  .item {
    margin-bottom: 18px;
  }
  .box-card {
    width: 450px;
    margin: 40px;
  }
  .card-rigth {
    float: right
  }
  .icon-rigth {
    float: right;
    padding-right: 80px;
    height: 30px;
  }
</style>
