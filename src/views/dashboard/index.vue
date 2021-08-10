<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
          <span>接入设备</span>
          </div>
        </template>
        <div class="text item">
         接入设备合计：
         <span class="number">{{totalclient}}</span>
         <i class="el-icon-circle-check"></i>
        </div>
        <div class="text item">
          允许接入设备：
          <el-tooltip effect="dark" content="能接入网络的有效接入设备。" placement="top-start">
            <span class="number">{{available}}</span>
          </el-tooltip>
          <i class="el-icon-circle-check"></i>
       </div>
       <div class="text item">
         新增等待关联：
         <el-tooltip effect="dark" content="交换机自动增加的设备，需要填写真实用户名称，以关联用户。" placement="top-start">
           <span class="number">{{newwaitset}}</span>
         </el-tooltip>
         <span v-if="newwaitset>0">
          <el-tooltip effect="dark" content="操作提醒：请及时关联用户。" placement="top-start">
            <i class="el-icon-circle-plus"></i>
          </el-tooltip>
         </span>
         <span v-else>
            <i class="el-icon-circle-check"></i>
         </span>
       </div>
        <div class="text item">
         能接入未关联：
         <el-tooltip effect="dark" content="没有真实名称又能接入的设备，有安全隐患。" placement="top-start">
            <span class="number number4">{{noset}}</span>
          </el-tooltip>
          <el-tooltip effect="dark" content="将所有未关联真实名称的接入设备设置为拒绝接入，以满足安全需求。" placement="top-start">
            <el-button class="button" type="primary" @click="handledoneset" :disabled="!noset">一键设置</el-button>
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
        交换机合计数：
        <span class="number">{{totaldevice}}</span>
        <i class="el-icon-circle-check"></i>
      </div>
      <div class="text item">
        设置自动增加：
        <el-tooltip effect="dark" content="为方便增加设备，所有交换机都应设置自动增加。" placement="top-start">
          <span class="number">{{autoinsert}}</span>
        </el-tooltip>
        <span v-if="!(autoinsert===totaldevice)">
          <el-tooltip effect="dark" content="操作提醒：应等于合计数。" placement="top-start">
            <i class="el-icon-circle-plus"></i>
          </el-tooltip>
        </span>
        <span v-else>
            <i class="el-icon-circle-check"></i>
        </span>
      </div>
      <div class="text item">
        设置自动接入：
        <el-tooltip effect="dark" content="为安全接入，所有交换机都应不设置为自动接入。" placement="top-start">
          <span class="number">{{autoaccept}}</span>
        </el-tooltip>
        <span v-if="autoaccept>0">
          <el-tooltip effect="dark" content="安全警告：应等于0。" placement="top-start">
            <i class="el-icon-error"></i>
          </el-tooltip>
        </span>
        <span v-else>
            <i class="el-icon-circle-check"></i>
        </span>
      </div>
    </el-card>
    </el-col>
    <el-col :span="24"><div class="grid-content bg-purple"></div>

    </el-col>
  </el-row>
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
    this.$confirm('此操作将未关联的设备全部设置为拒绝接入, 是否继续?', '提示', {
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
    margin-left: -100px;
  }
  .number4 {
    margin-right: -80px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
  .box-card {
    width: 400px;
    height: 300px;
    margin: 10%;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
   .bg-purple {
    background: #d3dce6;
  }
</style>
