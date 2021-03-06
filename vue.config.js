const config= {
  publicPath: "./",
  productionSourceMap: false,
}
// 只有在打包lib时才忽略,否则dev时会报错
if (process.title&&process.title.indexOf('lib')>-1) {
config.configureWebpack={
    externals: {
        'pikaz-xlsx-style': 'pikaz-xlsx-style',
    'file-saver': 'file-saver',
       "debug":'debug'
    }
  }
}
module.exports= config;
