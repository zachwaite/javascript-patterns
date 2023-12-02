const path = require('path');

module.exports = {
  entry: './index',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: "node",
}
