<template>
  <div class="app-container">
    <el-space wrap size="150">
    <el-card class="box-card">
    <el-form
      :model="adminform"
      label-width="120px"
    >
      <el-form-item>
        <h2>修改管理员密码</h2>
      </el-form-item>
      <el-form-item label="输入原密码：">
        <el-input ref="password" v-model="adminform.password" placeholder="请输入原密码" show-password />
      </el-form-item>
      <el-form-item label="输入新密码：">
        <el-input ref="password" v-model="adminform.newpassword" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="再次新密码：">
        <el-input ref="password" v-model="adminform.newpassword2" placeholder="请再次输入新密码" show-password />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmitadmin"
        >
          确认修改
        </el-button>
      </el-form-item>
    </el-form>
    </el-card>
    <el-card class="box-card">
    <el-form
      :model="editorform"
      label-width="120px"
    >
      <el-form-item>
        <h2>修改操作员密码</h2>
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
    </el-space>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Setup'
})
export default class extends Vue {
  private passwordType = 'password'
  private adminform = {
    password: '',
    newpassword: '',
    newpassword2: ''
  };

  private editorform = {
    newpassword: '',
    status: true
  };

  private onSubmitadmin() {
    this.$message('submit!' + this.adminform.password)
  }

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
