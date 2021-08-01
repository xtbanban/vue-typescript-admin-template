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
        label="IP地址"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.IP }}
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="分组"
        width="120"
        align="center"
      >
      <template slot-scope="scope">
          {{ scope.row.group }}
        </template>
      </el-table-column>
      <el-table-column
        label="共享密钥"
        width="120"
        align="center"
      >
      <template slot-scope="scope">
          {{ scope.row.Secert }}
        </template>
      </el-table-column>
      <el-table-column
        label="自动增加"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.AutoInsert }}
        </template>
      </el-table-column>
      <el-table-column
        label="自动接入"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.AutoAccept }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row.IP)"
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
import { getdevice, adddevice, deletedevice } from '@/api/device'
import { IDeviceData } from '@/api/types'

@Component({
  name: 'Device'
})
export default class extends Vue {
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
    status: 1,
    name: '',
    group: ''
  }

  private onaddSubmit() {
    (this.$refs.addForm as Form).validate(async(valid) => {
      if (valid) {
        await adddevice(this.formInline)
        this.getList()
        this.$notify({
          title: '成功',
          message: '增加成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private handleDelete(IP: string) {
    this.$confirm('此操作将永久删除该数据, 是否继续?(' + IP + ')', '提示', {
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
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>
