## Introduction

这个插件解决一个前端导出上万条数据, 如果都渲染出来, 页面会卡死, 如果分页导出, 又有一个需要合并的问题, 所以这边在结合 git 上的一些开源项目的基础上进行二次封装, 使得表格数据只需要请求后端接口数据, 不展示所有数据的基础上进行简单的封装，做到开箱即用，降低使用成本。

如果是页面渲染出来后导出,vxe-table-plugin-export-xlsx 是个不错的选择

基于[pikaz-xlsx-style](https://github.com/pikaz-18/pikaz-xlsx-style)进行再次封装,

### With npm or yarn

```bash
yarn add pikaz-excel-js file-saver kaka-excel-js

npm i -S pikaz-excel-js file-saver kaka-excel-js


```

### 举例

```js
import excelExport from "kaka-excel-js";
export default {
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
          columns:this.tableColumn,
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
     * @description: 导出方法
     * @param {*}
     * @return {*}
     */
    exportOut() {
      const sheet=this.sheet
      // 这里模拟十万条数据
      let arr=[]
      for (let index = 0; index < 2000; index++) {
        arr= arr.concat(datas)
      }
      sheet[0].table=arr
      const options = {
        bookType: this.bookType,
        filename: this.filename,
        sheet,
        onError: this.onError,
      };
       const loading = this.$loading({
          lock: true,
          text: '正在导出中,请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        });

       setTimeout(async() => {
        let final=await  excelExport(options);
        if (final) {
            this.$message.success('导出成功!')
        }else {
          this.$message.success('导出失败!')
        }
          loading.close();
        }, 100);
    }
  }
 }
```

## demo

[演示 demo->点击查看](https://kakajun.github.io/kaka-excel-js/)

[![](https://camo.githubusercontent.com/bf5c9492905b6d3b558552de2c848c7cce2e0a0f0ff922967115543de9441522/68747470733a2f2f646576656c6f7065722e737461636b626c69747a2e636f6d2f696d672f6f70656e5f696e5f737461636b626c69747a2e737667)
](https://stackblitz.com/edit/github-66reue)

### 支持数据格式

columns 的格式:

```js
 {
    field: "bqljzj",
    title: "本期累计增加",
    type: "decimal",
    hidden: false,
    children: [
      {
        field: "C",
        title: "账面余额",
        type: "decimal",
      },
      {
        field: "D",
        title: "坏账准备",
        type: "decimal",
      },
    ],
  },
 {
    field: "bankname",
    title: "关联公司",
    type: "string",
    align: "left",
    fixed: true,
    width: "226px",
    unit:"",
  }
```

data 数据格式为普通后端返回的 key-value 格式

### 插件功能

- 支持上万条数据进行导出(亲测 5 万条都 ok),直接请求后端接口拿数据,进行导出,不需要借助前端渲染成 html, 再通过 dom 提取
- unit 为单位转换, 如果里面是'吨','人',"%", 那么生成的表格中数值会直接带上 unit, 否则请不传,或者为空
- 支持 cloums, vxe 的 fileld 和 title 搭配, 如果没有 fileld 就用 id 字段, 如果没有 title 就取 text 字段, 以匹配不同公司字段取名规则
- 支持 hidden=true, 那么导出表中将排除这列
- 自动撑开列宽,根据内容自动计算所需宽度
- 单位转换比如元转万元,只需设置 currencyType=10000

具体使用方法参见[pikaz-excel-js](https://github.com/pikaz-18/pikaz-excel-js.git)

不足:

1. 没有使用 ts+vue3 进行测试, 由于 pikaz-xlsx-style 打包的是 umd 格式, 并不支持在 vite 中用 esm 方式加载, 暂时只能在 webpack 或 vue-cli 中使用

### 后续

如果你发现插件的 bug,请提交 issue

### 变更记录

0.0.6 修复多次导出报错
0.0.7 修复百分比等也要保留两位小数

## Reference

[https://www.jianshu.com/p/31534691ed53](https://www.jianshu.com/p/31534691ed53)

[https://www.cnblogs.com/yinxingen/p/11052184.html](https://www.cnblogs.com/yinxingen/p/11052184.html)
