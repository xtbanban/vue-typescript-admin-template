<template>
  <div class="app-container">
    <div class="block">
      <el-pagination
       @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :page-size="pagesize"
        :current-page="currentpage"
        :total="total">
      </el-pagination>
      <span>{{ pageshow1 }}</span>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="ID"
        width="55"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 + ((currentpage - 1) * pagesize) }}
        </template>
      </el-table-column>
      <el-table-column
        label="Login"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.Login }}
        </template>
      </el-table-column>
      <el-table-column
        label="SWIP"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.SWIP }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="acc_code"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.acc_code }}
        </template>
      </el-table-column>
      <el-table-column
        label="resp_code"
        width="170"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.resp_code }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Status"
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
        label="logtime"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.logtime }}</span>
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getArticles } from '@/api/articles'
import { IArticleData } from '@/api/types'

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
  private list: IArticleData[] = []
  private pagesize = 20
  private currentpage = 1
  private total = 0
  private listLoading = true
  private listQuery = {
    page: this.currentpage,
    limit: this.pagesize
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
    const { data } = await getArticles(this.listQuery)
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>
