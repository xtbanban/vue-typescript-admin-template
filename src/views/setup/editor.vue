<template>
  <div class="app-container">
    <el-card class="box-card">
    <el-form
       ref="addForm"
      :model="editorform"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item>
        <h2>修改操作员信息</h2>
      </el-form-item>
      <el-form-item label="登录名：">
        <span>editor</span>
      </el-form-item>
      <el-form-item label="输入新密码："  prop="newpassword">
        <el-input v-model="editorform.newpassword" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="是否可用：">
        <el-switch v-model="editorform.status" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.native.prevent="onSubmiteditor"
        >
          确认修改
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { update } from '@/api/users'

@Component({
  name: 'Setup-editor'
})
export default class extends Vue {
  private editorform = {
    username: 'editor',
    newpassword: '',
    status: true
  };

  private validateNewPassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码必须大于6位字符'))
    } else {
      callback()
    }
  }

  private rules = {
    newpassword: [{ validator: this.validateNewPassword, trigger: 'blur' }]
  }

  private onSubmiteditor() {
    (this.$refs.addForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        await update(this.editorform)
        this.$message({
          message: '成功修改系统操作员信息。',
          type: 'success'
        })
      }
    })
  }

  private resetForm() {
    (this.$refs.addForm as ElForm).resetFields()
    this.editorform.status = true
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
