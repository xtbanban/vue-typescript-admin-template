<template>
  <div class="app-container">
    <el-card class="box-card">
      <h2>一键拒绝</h2>
      <span>将所有未关联真实名称的接入设备设置为拒绝接入，以满足安全需求。</span><p />
      <span>（请注意：可能导致在线用户掉线）</span>
      <el-button class="button butrigth" type="primary" @click="handledaject">全部拒绝</el-button>
      <p />
      <div class="link-top"></div>
      <h2>一键删除</h2>
      <span>将所有未关联真实名称且拒绝接入的设备全部删除，可以设置交换机自动增加。</span><p />
      <span>（可安全操作）</span>
      <el-button class="button butrigth" type="primary" @click="handleddelete">全部删除</el-button>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { oneclickset, oneclickdel } from '@/api/client'

@Component({
  name: 'Setuponekey'
})
export default class extends Vue {
  private handledaject() {
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
    this.$message({
      message: '所选操作完成。(全部拒绝)',
      type: 'success'
    })
  }

  private handleddelete() {
    this.$confirm('此操作将所有未关联且拒绝接入的设备全部删除, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.toonesetdel()
    })
  }

  private async toonesetdel() {
    await oneclickdel()
    this.$message({
      message: '所选操作完成。(全部删除)',
      type: 'success'
    })
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 55%;
}
.butrigth {
  margin-left: 460px;
}
/*中间的过度的横线*/
.link-top {
  width: 100%;
  height: 1px;
  border-top: solid #ACC0D8 1px;
}
</style>
