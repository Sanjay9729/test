const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  style: {
    postcss: {
      plugins: [
        require("postcss-flexbugs-fixes"),
        postcssPresetEnv({
          stage: 3,
          features: {
            'custom-properties': false,
            'calc': false // 💥 disable problematic postcss-calc
          }
        })
      ]
    }
  }
};
