<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="my_label">选择需要显示的</span>
      <el-tooltip class="item" effect="dark" content="分<关联用户><接入设备>两列排序显示所有接入设备" placement="top-start">
        <el-select
        v-model="clientvalue" placeholder="接入设备" @change="handleChange">
        <el-option
          v-for="item in clientlist"
          :key="item.Login"
          :label="item.UserName"
          :value="item.Login">
          <span style="float: left">{{ item.UserName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Login }}</span>
        </el-option>
        </el-select>
      </el-tooltip>
      <el-divider direction="vertical"></el-divider>
      <span class="my_label">选择时间</span>
      <el-tooltip class="item" effect="dark" content="选择年月（默认当前月份）" placement="top-start">
      <el-date-picker
          v-model="valuemonth"
          type="month"
          placeholder="年及月份"
          editable=false
          @change="handleChange">
      </el-date-picker>
      </el-tooltip>
      <el-divider direction="vertical"></el-divider>
      <el-tooltip class="item" effect="dark" content="显示全部或精简数据（精简只包括：<许可><开始><结束>）" placement="top-start">
      <el-switch
        v-model="showsingle"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="精简"
        inactive-text="全部"
        @change="handleChange">
      </el-switch>
      </el-tooltip>
      <el-divider direction="vertical"></el-divider>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleShow"
      >
        显示
      </el-button>
    </div>
    <div class="block">
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
        label="接入设备"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.Login }}
        </template>
      </el-table-column>
      <el-table-column
        label="交换机"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.SWIP }}
        </template>
      </el-table-column>
      <el-table-column
        label="请求码"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.acc_code }}
        </template>
      </el-table-column>
      <el-table-column
        label="响应码"
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.resp_code }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="动作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status_type | statusFilter">
            {{ scope.row.status_type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="时刻 (排序)"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <!-- {{ scope.row.logtime }} -->
          <span>{{ scope.row.logtime | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
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
import { getLogging, getclientlist } from '@/api/logging'
import { ILoggingData, IClientListData } from '@/api/types'

@Component({
  name: 'Table',
  filters: {
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        Start: 'success',
        'Interim-Update': '',
        Stop: 'danger'
      }
      return statusMap[status]
    },
    parseTime: (timestamp: string) => {
      return new Date(timestamp).toISOString()
    }
  }
})
export default class extends Vue {
  private list: ILoggingData[] = []
  private clientlist: IClientListData[] = []
  private clientvalue = ''
  private pagesize = 20
  private currentpage = 1
  private total = 0
  private listLoading = false
  private now = new Date()
  private valuemonth = new Date(this.now.getFullYear(), this.now.getMonth(), 1, 0, 0, 0) // 当前月
  private valuenextmonth = new Date()
  private showsingle = true
  private listQuery = {
    page: this.currentpage,
    limit: this.pagesize
  }

  created() {
    this.getclient()
  }

  private async getclient() {
    this.listLoading = true
    const { data } = await getclientlist()
    this.clientlist = data.items
    this.listLoading = false
  }

  private handleChange() {
    this.currentpage = 1
    this.listQuery.page = this.currentpage
  }

  private handleShow() {
    if (!this.valuemonth) {
      this.valuemonth = new Date(this.now.getFullYear(), this.now.getMonth(), 1, 0, 0, 0) // 当前月
    }
    this.listLoading = true
    this.getList()
  }

  private handleCurrentChange(val: number) {
    this.currentpage = val
    this.listQuery.page = val
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    this.valuenextmonth = new Date(this.valuemonth.getFullYear(), this.valuemonth.getMonth() + 1, 1, 0, 0, 0) // 下个月
    const { data } = await getLogging(
      this.listQuery,
      {
        Login: this.clientvalue,
        valuemonth: this.valuemonth,
        valuenextmonth: this.valuenextmonth,
        showsingle: this.showsingle
      }
    )
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>

<style scoped>
.my_label {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #1f2d3d;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
</style>
