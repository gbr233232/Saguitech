const path = require('path'); // Importação do módulo 'path'

module.exports = {
  entry: './src/index.js',  // Arquivo de entrada
  output: {
    filename: 'bundle.js',  // Nome do arquivo gerado
    path: path.resolve(__dirname, 'dist')  // Diretório de saída
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
