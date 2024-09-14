const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer,
    cssnano({ preset: 'default' }),
    require('autoprefixer'),
    require('postcss-preset-env')
  ]
};