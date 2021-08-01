<template>
  <div class="app-container">
    <el-form
        ref="addForm"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        :rules="rules"
      >
      <el-form-item label="接入用户" prop="Login">
        <el-input v-model="formInline.Login" placeholder="接入用户名"></el-input>
      </el-form-item>
      <el-form-item label="接入密码" prop="Password">
       <el-input v-model="formInline.Password" placeholder="接入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="用户真实名" prop="UserName">
       <el-input v-model="formInline.UserName" placeholder="用户真实名称"></el-input>
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="onaddSubmit">增加</el-button>
      </el-form-item>
    </el-form>

    <div class="block" v-if="!(pagesize===0)">
      <el-pagination
       @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :page-size="pagesize"
        :current-page="currentpage"
        :total="total">
      </el-pagination>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在载入..."
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="顺序"
        width="55"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 + ((currentpage - 1) * pagesize) }}
        </template>
      </el-table-column>
      <el-table-column
        label="接入用户"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.Login }}
        </template>
      </el-table-column>
      <el-table-column
        label="接入密码"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.Password }}
        </template>
      </el-table-column>
      <el-table-column
        label="真实用户名"
        width="260"
        align="center"
      >
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
            <el-input
              v-model="scope.row.UserName"
              size="small"
            />
          </template>
          <span v-else>{{ scope.row.UserName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交换机IP"
        width="140"
        align="center"
      >
      <template slot-scope="scope">
          {{ scope.row.SWIP }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-tag :type="(scope.row.status) ? 'success' : 'danger'">
              {{ (scope.row.status) ? '正常' : '拒绝' }}
            </el-tag>
          </template>
          <template v-else>
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" >
            </el-switch>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.edit">
          <el-button
            type="success"
            size="small"
            @click="confirmEdit(scope.row)"
          >
            保存
          </el-button>
          <el-button
              size="small"
              type="warning"
              @click="cancelEdit(scope.row)"
            >
              取消
          </el-button>
          </div>
          <div v-else>
          <el-button
            type="primary"
            size="small"
            @click="scope.row.edit=!scope.row.edit"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.Login)"
          >
            删除
          </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="!(pagesize===0)">
      <el-pagination
       @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :page-size="pagesize"
        :current-page="currentpage"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { getclient, addclient, updateclient, deleteclient } from '@/api/client'
import { IClientData } from '@/api/types'

@Component({
  name: 'Client'
})
export default class extends Vue {
  private list: IClientData[] = []
  private pagesize = 0 // 不分页
  private currentpage = 1
  private total = 0
  private listLoading = true
  private listQuery = {
    page: this.currentpage,
    limit: this.pagesize
  }

  private rules = {
    Login: [{ required: true, message: '必须输入接入用户名', trigger: 'blur' }],
    Password: [{ required: true, message: '必须输入接入密码', trigger: 'blur' }],
    UserName: [{ required: true, message: '必须输入用户真实名称', trigger: 'blur' }]
  }

  private formInline = {
    Login: '',
    Password: '',
    UserName: '',
    SWIP: '',
    status: 1
  }

  private onaddSubmit() {
    (this.$refs.addForm as Form).validate(async(valid) => {
      if (valid) {
        await addclient(this.formInline)
        this.getList()
        this.$message({
          message: '成功增加接入用户。',
          type: 'success'
        })
      }
    })
  }

  private handleDelete(Login: string) {
    this.$confirm('此操作将永久删除该数据, 是否继续?(' + Login + ')', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.delclient(Login)
    })
  }

  private async delclient(Login: string) {
    await deleteclient({ Login })
    this.getList()
  }

  created() {
    this.getList()
  }

  private handleCurrentChange(val: number) {
    this.currentpage = val
    this.listQuery.page = val
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getclient(this.listQuery)
    // this.list = data.items
    const items = data.items
    this.list = items.map((v: any) => {
      this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      v.originalUserName = v.UserName
      return v
    })
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private cancelEdit(row: any) {
    row.UserName = row.originalUserName
    row.edit = false
    // this.$message({
    //   message: '用户名称恢复回原值。',
    //   type: 'warning'
    // })
  }

  private async confirmEdit(row: any) {
    row.edit = false
    row.originalUserName = row.UserName
    const Login = row.Login
    const UserName = row.UserName
    await updateclient({ Login, UserName })
    this.$message({
      message: '用户名称已保存。',
      type: 'success'
    })
  }
}
</script>
