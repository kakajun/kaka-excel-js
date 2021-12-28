<template>
  <div >
     <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button @click="exportEvent">导出xlsxBy pugin</vxe-button>
        <vxe-button @click="exportOut">导出demo</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-grid
      border
      ref="xTable"
      height="600"
      :span-method="rowspanMethod"
      :columns="tableColumn"
      :data="tableDatas"
    ></vxe-grid>
  </div>
</template>

<script>
import { columns, datas } from "./mock.js";
import excelExport from "./out";
// import excelExport from "../lib/kakaExcelJs.umd.js";
export default {
  name: "exportDemo",
  components: {},
  data() {
    return {
      tableColumn: columns,
      tableDatas: datas,
      bookType: "xlsx",
      filename: "export-demo",
      sheet: [
        {
          title: "XX统计表",
          table: datas,
          columns,
          sheetName: "XX统计表",
          // 这个是数值转换单位,传10000转换为万元
          currencyType: 10000,
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
                sz: 20,
                color: { rgb: "000" },
                bold: true,
              },
            fill: {
              // 背景颜色设置
              fgColor: { rgb: "f0f8ff" }
            },
            alignment: {
              // 是否居中center | 左对齐left | 右对齐right
              horizontal: "center",
              vertical: "center",
            },
            },
          ],
        },
      ],
    };
  },
  methods: {
    /**
     * @description: html 导出
     * @param {*}
     * @return {*}
     */
    exportEvent() {
      this.$refs.xTable.exportData({
        filename: "export",
        sheetName: "Sheet1",
        type: "xlsx",
      });
    },

    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["sex"];
      const cellValue = row[column.property];
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
    exportOut() {
      // const sheet=this.sheet
      // // 这里模拟一万条数据
      // let arr=[]
      // for (let index = 0; index < 200; index++) {
      //   arr= arr.concat(datas)
      // }
      // sheet[0].table=arr
      const options = {
        bookType: this.bookType,
        filename: this.filename,
        // sheet,
        sheet:this.sheet,
        onError: this.onError,
      };
      excelExport(options);
    },
    /**
     * @name: 导出错误
     * @param {String} err/错误信息
     * @return:
     */
    onError(err) {
      console.log(err);
    },
  },
};
</script>

<style lang="scss" scoped></style>
