## Introduction

这个插件解决一个前端导出上万条数据, 如果都渲染出来, 页面会卡死, 如果分页导出, 又有一个需要合并的问题, 所以这边在结合git上的一些开源项目的基础上进行二次封装, 使得表格数据只需要请求后端接口数据, 不展示所有数据的基础上进行简单的封装，做到开箱即用，降低使用成本。

基于[pikaz-xlsx-style](https://github.com/pikaz-18/pikaz-xlsx-style)进行再次封装,

具体使用方法参见[pikaz-excel-js](https://github.com/pikaz-18/pikaz-excel-js.git)

不足: 由于pikaz-xlsx-style打包的是umd格式, 并不支持在vite中用esm方式加载, 暂时只能在webpack或vue-cli 中使用

### With npm or yarn

```bash
yarn add pikaz-excel-js file-saver kaka-excel-js

npm i -S pikaz-excel-js file-saver kaka-excel-js
```
## demo


## Reference
[https://www.jianshu.com/p/31534691ed53](https://www.jianshu.com/p/31534691ed53)

[https://www.cnblogs.com/yinxingen/p/11052184.html](https://www.cnblogs.com/yinxingen/p/11052184.html)
