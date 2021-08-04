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
      <el-form-item label="关联用户" prop="UserName">
       <el-input v-model="formInline.UserName" placeholder="关联用户名称"></el-input>
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
        label="*接入用户*"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.Login }}
        </template>
      </el-table-column>
      <el-table-column
        label="*接入密码*"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.edit">{{ scope.row.Password }}</span>
          <span v-else>{{ Showpassword }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联用户 (排序)"
        width="260"
        align="center"
      >
      <template slot-scope="scope">
        <el-input
          v-if="scope.row.edit"
          v-model="scope.row.UserName"
          size="small"
          />
        <span v-else>{{ scope.row.UserName }}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="*交换机IP*"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.SWIP }}
        </template>
      </el-table-column>
      <el-table-column
        label="接入"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="!scope.row.edit"
            :type="(scope.row.status) ? 'success' : 'danger'" 
            disable-transitions>
            {{ (scope.row.status) ? '允许' : '拒绝' }}
          </el-tag>
          <el-switch
            v-show="scope.row.edit"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949" >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180"
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
  private Showpassword = '******'
  private list: IClientData[] = []
  private pagesize = 20 // 不分页
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
    status: true
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
    this.$confirm('此操作将永久删除该数据, 是否继续?\n(' + Login + ')', '提示', {
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
  }

  private async confirmEdit(row: any) {
    row.edit = false
    row.originalUserName = row.UserName
    const Login = row.Login
    const UserName = row.UserName
    const status = row.status
    await updateclient({ Login, UserName, status })
    this.$message({
      message: '用户信息已保存。',
      type: 'success'
    })
  }
}
</script>
