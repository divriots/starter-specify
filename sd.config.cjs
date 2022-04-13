module.exports = {
  source: ['sd-input/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'specify',
      buildPath: 'sd-output/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
