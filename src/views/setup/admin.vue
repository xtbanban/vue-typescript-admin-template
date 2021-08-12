<template>
  <div class="app-container">
    <el-card class="box-card">
    <el-form
      ref="addForm"
      :model="adminform"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item>
        <h2>修改管理员密码</h2>
      </el-form-item>
      <el-form-item label="输入原密码：" prop="password">
        <el-input v-model="adminform.password" placeholder="请输入原密码" show-password />
      </el-form-item>
      <el-form-item label="输入新密码：" prop="newpassword">
        <el-input v-model="adminform.newpassword" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="再次新密码：" prop="newpassword2">
        <el-input v-model="adminform.newpassword2" placeholder="请再次输入新密码" show-password />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
           @click.native.prevent="onSubmitadmin"
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
  name: 'Setup-admin'
})
export default class extends Vue {
  private adminform = {
    username: 'admin',
    password: '',
    newpassword: '',
    newpassword2: ''
  };

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码必须大于6位字符'))
    } else {
      callback()
    }
  }

  private validateNewPassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码必须大于6位字符'))
    } else {
      if (this.adminform.password === this.adminform.newpassword) {
        callback(new Error('新旧密码相等。'))
      }
      callback()
    }
  }

  private validateNewPassword2 = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码必须大于6位字符'))
    } else {
      if (!(this.adminform.newpassword === this.adminform.newpassword2)) {
        callback(new Error('两次密码不相等。'))
      }
      callback()
    }
  }

  private rules = {
    password: [{ validator: this.validatePassword, trigger: 'blur' }],
    newpassword: [{ validator: this.validateNewPassword, trigger: 'blur' }],
    newpassword2: [{ validator: this.validateNewPassword2, trigger: 'blur' }]
  }

  private onSubmitadmin() {
    (this.$refs.addForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        await update(this.adminform)
        this.$message({
          message: '成功修改系统管理员密码。',
          type: 'success'
        })
      }
    })
  }

  private resetForm() {
    (this.$refs.addForm as ElForm).resetFields()
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
