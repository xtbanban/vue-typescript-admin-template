<template>
  <div class="app-container">
    <el-form
        ref="addForm"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        :rules="rules"
      >
      <el-form-item label="IP地址" prop="IP">
        <el-input v-model="formInline.IP" placeholder="IP地址"></el-input>
      </el-form-item>
      <el-form-item label="共享密钥" prop="Secert">
       <el-input v-model="formInline.Secert" placeholder="共享密钥" show-password></el-input>
      </el-form-item>
      <el-switch v-model="formInline.AutoInsert" active-text="自动增加">
      </el-switch>
      <el-switch v-model="formInline.AutoAccept" active-text="自动接入">
      </el-switch>
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
        label="*IP地址*"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.IP }}
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.edit"
            v-model="scope.row.name"
            size="small"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分组"
        width="150"
        align="center"
      >
      <template slot-scope="scope">
        <el-input
            v-if="scope.row.edit"
            v-model="scope.row.group"
            size="small"
          />
          <span v-else>{{ scope.row.group }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="*共享密钥*"
        width="150"
        align="center"
      >
      <template slot-scope="scope">
          <span v-if="scope.row.edit">{{ scope.row.Secert }}</span>
          <span v-else>{{ Showpassword }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="自动增加"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="!scope.row.edit"
            :type="(scope.row.AutoInsert) ? 'success' : 'danger'" 
            disable-transitions>
            {{ (scope.row.AutoInsert) ? '是' : '否' }}
          </el-tag>
          <el-switch
            v-show="scope.row.edit"
            v-model="scope.row.AutoInsert"
            active-color="#13ce66"
            inactive-color="#ff4949" >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="自动接入"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="!scope.row.edit"
            :type="(scope.row.AutoAccept) ? 'success' : 'danger'" 
            disable-transitions>
            {{ (scope.row.AutoAccept) ? '是' : '否' }}
          </el-tag>
          <el-switch
            v-show="scope.row.edit"
            v-model="scope.row.AutoAccept"
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
              @click="handleDelete(scope.row.IP)"
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
import { getdevice, adddevice, updatedevice, deletedevice } from '@/api/device'
import { IDeviceData } from '@/api/types'

@Component({
  name: 'Device'
})
export default class extends Vue {
  private Showpassword = '******'
  private list: IDeviceData[] = []
  private pagesize = 0 // 不分页
  private currentpage = 1
  private total = 0
  private listLoading = true
  private listQuery = {
    page: this.currentpage,
    limit: this.pagesize
  }

  private rules = {
    IP: [{ required: true, message: '必须输入IP地址', trigger: 'blur' }],
    Secert: [{ required: true, message: '必须输入共享密钥', trigger: 'blur' }]
  }

  private formInline = {
    IP: '',
    Secert: '',
    AutoInsert: true,
    AutoAccept: false,
    status: true,
    name: '',
    group: ''
  }

  private onaddSubmit() {
    (this.$refs.addForm as Form).validate(async(valid) => {
      if (valid) {
        await adddevice(this.formInline)
        this.getList()
        this.$message({
          message: '成功增加交换机。',
          type: 'success'
        })
      }
    })
  }

  private handleDelete(IP: string) {
    this.$confirm('此操作将永久删除该数据, 是否继续?\n(' + IP + ')', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deldevice(IP)
    })
  }

  private async deldevice(IP: string) {
    await deletedevice({ IP })
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
    const { data } = await getdevice(this.listQuery)
    const items = data.items
    this.list = items.map((v: any) => {
      this.$set(v, 'edit', false)
      v.originalAutoInsert = v.AutoInsert
      v.originalAutoAccept = v.AutoAccept
      v.originalname = v.name
      v.originalgroup = v.group
      return v
    })
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private cancelEdit(row: any) {
    row.AutoInsert = row.originalAutoInsert
    row.AutoAccept = row.originalAutoAccept
    row.name = row.originalname
    row.group = row.originalgroup
    row.edit = false
  }

  private async confirmEdit(row: any) {
    row.edit = false
    row.originalAutoInsert = row.AutoInsert
    row.originalAutoAccept = row.AutoAccept
    row.originalname = row.name
    row.originalgroup = row.group
    const IP = row.IP
    const AutoInsert = row.AutoInsert
    const AutoAccept = row.AutoAccept
    const name = row.name
    const group = row.group
    await updatedevice({ IP, AutoInsert, AutoAccept, name, group })
    this.$message({
      message: '交换机信息已保存。',
      type: 'success'
    })
  }
}
</script>
