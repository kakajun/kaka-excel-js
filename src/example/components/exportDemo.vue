<template>
 <div   id="xGrid2">
   <vxe-toolbar>
  <template v-slot:buttons>
    <vxe-button @click="exportEvent">导出.xlsx</vxe-button>
  </template>
</vxe-toolbar>
     <vxe-button @click='exportOut'>导出demoOne</vxe-button>
        <vxe-button @click='exportOut(2)'>导出demoTwo</vxe-button>
         <vxe-grid
          border
          ref="xTable"
          height="300"
          :span-method="rowspanMethod"
          :columns="tableColumn"
          :data="tableDatas"></vxe-grid>
 </div>
</template>

<script>
import {columns,datas} from '../mock.js';
import excelExportOne from '../out-one/excelExport';
import excelExportTwo from '../out-two/excelExport';

 export default {
   name:'',
   components: {

   },
   data () {
     return {
        tableColumn:columns,
        tableDatas:datas,
        bookType: "xlsx",
      filename: "export-demo",
      sheet: [
        {
          title: "插件信息2",
          table: datas,
          columns,
          sheetName: "插件信息2",
          globalStyle: {
            font: {
              color: { rgb: "ff7e00" },
            },
          },
          cellStyle: [
            {
              cell: "A1",
              font: {
                name: "宋体",
                sz: 14,
                color: { rgb: "ffffff" },
                bold: true,
              },
              fill: {
                fgColor: { rgb: "ff7e00" },
              },
            },
          ],
        },
      ],
     }
   },
   created(){

   },
   methods:  {
             /**
              * @description: html 导出
              * @param {*}
              * @return {*}
              */
             exportEvent() {
      this.$refs.xTable.exportData({
        filename: 'export',
        sheetName: 'Sheet1',
        type: 'xlsx'
      })
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
       exportOut(two){
         debugger
        const options = {
        bookType: this.bookType,
        filename: this.filename,
        sheet: this.sheet,
        onError: this.onError,
      };
      if (two==2) {
        excelExportTwo(options)
      }else{
        excelExportOne(options);
      }
    },
      /**
     * @name: 导出错误
     * @param {String} err/错误信息
     * @return:
     */
    onError(err) {
      console.log(err);
    },

   }
 }
</script>

<style  lang='scss' scoped>


</style>
