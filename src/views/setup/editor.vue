<template>
  <div class="app-container">
    <el-card class="box-card">
    <el-form
      :model="editorform"
      label-width="120px"
    >
      <el-form-item>
        <h2>修改操作员密码</h2>
      </el-form-item>
      <el-form-item label="登录名：">
        <span>editor</span>
      </el-form-item>
      <el-form-item label="输入新密码：">
        <el-input ref="password" v-model="editorform.newpassword" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="是否可用：">
        <el-switch v-model="editorform.status" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmiteditor"
        >
          确认修改
        </el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Setup-editor'
})
export default class extends Vue {
  private editorform = {
    newpassword: '',
    status: true
  };

  private onSubmiteditor() {
    this.$message('submit!' + this.editorform.newpassword)
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 55%;
}
.line {
  text-align: center;
}
</style>
