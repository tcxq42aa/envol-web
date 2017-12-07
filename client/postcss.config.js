/**
 * Created by charles on 2017/12/7.
 */
module.exports = {
  sourceMap: true,
  plugins: [
    require('autoprefixer')({
      browsers: ['last 5 versions']
    })
  ]
}
