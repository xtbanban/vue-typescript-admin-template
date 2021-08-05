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
        合计：{{all}}
      </div>
      <div class="text item">
        {{'允许接入：60'}}
      </div>
      <div class="text item">
        {{'新增待关联：20'}}
      </div>
      <div class="text item">
        {{'未关联能接入：20'}}
          <el-button class="button" type="text">一键设置</el-button>
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
        {{'合计：20'}}
      </div>
      <div class="text item">
        {{'非自动接入：6'}}
      </div>
      <div class="text item">
        {{'自动增加：2'}}
      </div>
    </el-card>
    </el-col>
  </el-row >
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getdashboard } from '@/api/client'

@Component({
  name: 'Dashboard'
})

export default class extends Vue {
  private listLoading = true
  private all = 10
  private available = 0
  private newwaitset = 0
  private noset = 0

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getdashboard()
    this.all = data.all
    this.available = data.available
    this.newwaitset = data.newwaitset
    this.noset = data.noset
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
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

  .my_label {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #1f2d3d;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
</style>
