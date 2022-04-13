module.exports = {
  source: ['sd-input/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'specify',
      buildPath: '',
      files: [
        {
          destination: '_variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
