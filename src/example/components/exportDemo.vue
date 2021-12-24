<template>
 <div class=''  id="xGrid2">
     <button type="button" @click='exportOut'>导出demo</button>
 <vxe-grid

          border
          ref="xGrid2"
          height="300"
          :span-method="rowspanMethod"
          :columns="tableColumn"
          :data="tableDatas"></vxe-grid>
 </div>
</template>

<script>
import exportExcel from "../tableExportExcel"
 export default {
   name:'',
   components: {

   },
   data () {
     return {
           tableColumn: [
                { field: 'name', title: 'Name',type:"string" },
                { field: 'role', title: 'Role' ,type:"string" },
                { field: 'sex', title: 'Sex', formatter: this.formatterSex ,type:"string" },
                { field: 'age', title: 'Age',type:"decimal" },
                { field: 'address', title: 'Address', showOverflow: true,type:"string"  }
              ],
              tableDatas: [
                { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
                { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
                { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
                { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
                { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', age: 30, address: 'Shanghai' },
                { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: '0', age: 21, address: 'Shenzhen' },
                { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: '1', age: 29, address: 'Guangzhou' },
                { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: '1', age: 35, address: 'Shenzhen' },
                { id: 10009, name: 'Test9', nickname: 'T9', role: 'Test', sex: '1', age: 24, address: 'Shenzhen' },
                { id: 100010, name: 'Test10', nickname: 'T10', role: 'Develop', sex: '0', age: 20, address: 'Guangzhou' }
              ]
     }
   },
 methods:  {
            formatterSex ({ cellValue }) {
              if (cellValue === '1') {
                return '男'
              } else if (cellValue === '0') {
                return '女'
              }
              return ''
            },
            async impotEvent () {
              const { files } = await this.$refs.xGrid1.readFile({
                types: ['xls', 'xlsx']
              })
              const fileReader = new FileReader()
              fileReader.onload = (ev) => {
                const data = ev.target.result
                const workbook = XLSX.read(data, { type: 'binary' })
                const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets.Sheet1)
                const tableData = []
                // 解析数据
                csvData.split('\n').forEach((vRow) => {
                  if (vRow) {
                    const vCols = vRow.split(',')
                    const item = {}
                    vCols.forEach((val, cIndex) => {
                      const column = this.tableColumn[cIndex]
                      if (column.field) {
                        item[column.field] = val
                      }
                    })
                    tableData.push(item)
                  }
                })
                this.tableData1 = tableData
              }
              fileReader.readAsBinaryString(files[0])
            },
            // 通用行合并函数（将相同多列数据合并为一行）
            rowspanMethod ({ row, _rowIndex, column, visibleData }) {
              const fields = ['sex']
              const cellValue = row[column.property]
              if (cellValue && fields.includes(column.property)) {
                const prevRow = visibleData[_rowIndex - 1]
                let nextRow = visibleData[_rowIndex + 1]
                if (prevRow && prevRow[column.property] === cellValue) {
                  return { rowspan: 0, colspan: 0 }
                } else {
                  let countRowspan = 1
                  while (nextRow && nextRow[column.property] === cellValue) {
                    nextRow = visibleData[++countRowspan + _rowIndex]
                  }
                  if (countRowspan > 1) {
                    return { rowspan: countRowspan, colspan: 1 }
                  }
                }
              }
            },
   exportOut(){
     exportExcel('xGrid2',this.tableColumn, this.tableDatas,"test")
    }

   }
 }
</script>

<style  lang='scss' scoped>


</style>
