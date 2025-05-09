module.exports = {
    externals: {
      '@shopify/polaris': '@shopify/polaris',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          exclude: /node_modules\/@shopify\/polaris/,
        },
        // other rules...
      ],
    },
  };
  