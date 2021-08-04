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
        {{'合计：100'}}
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
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Dashboard'
})
export default class extends Vue {
  get name() {
    return UserModule.name
  }

  get roles() {
    return UserModule.roles
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
</style>
