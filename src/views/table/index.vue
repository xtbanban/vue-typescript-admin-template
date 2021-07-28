<template>
  <div class="app-container">
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
          {{ scope.$index }}
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
        width="160"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    console.log('getlist:', this.listLoading)
    const { data } = await getArticles(this.listQuery)
    this.list = data.items
    console.log('data:', data)
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>
