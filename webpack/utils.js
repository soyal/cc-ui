/*
* 生成externals
* @param {Array<string>} libNames 
*/
exports.getExternals = (libNames) => {
  const result = {}

  libNames.forEach((libName) => {
    result[libName] = {
      commonjs: libName,
      commonjs2: libName,
      amd: libName
    }
  })

  return result
}