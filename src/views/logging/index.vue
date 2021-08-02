<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="clientvalue" placeholder="请选择接入设备">
        <el-option
          v-for="item in clientlist"
          :key="item.Login"
          :label="item.UserName"
          :value="item.Login">
          <span style="float: left">{{ item.UserName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Login }}</span>
        </el-option>
      </el-select>
      <!-- {{ clientvalue }} -->
      <span class="demonstration">月</span>
        <el-date-picker
          v-model="valuemonth"
          type="month"
          placeholder="选择月">
        </el-date-picker>
        <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        显示
      </el-button>
      <!-- <div class="block">
        {{ valuemonth }}
      </div>
      <div class="block">
        {{ valuenextmonth }}
      </div> -->
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
        label="用户"
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
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="时刻"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.logtime }}
          <!-- <span>{{ scope.row.logtime | parseTime }}</span> -->
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
    }
    // parseTime: (timestamp: string) => {
    //   return new Date(timestamp).toISOString()
    // }
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
  private valuemonth = new Date(this.now.getFullYear(), this.now.getMonth(), 1, 0, 0, 0)
  private valuenextmonth = new Date()
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

  private handleFilter() {
    this.valuenextmonth = new Date(this.valuemonth.getFullYear(), this.valuemonth.getMonth() + 1, 1, 0, 0, 0)

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
    const { data } = await getLogging(this.listQuery, { Login: this.clientvalue })
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>
