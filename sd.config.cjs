module.exports = {
  source: ['sd-input/**/*.json'],
  transform: {
    /**
     * This simplifies the name a bit
     * As Specify -> style-dictionary parser adds some noisy redundant
     * groupings that we do not want to end up in the token name.
     */
    'reduced-name': {
      type: 'name',
      transformer(token) {
        return `specify-${token.name.split('-').slice(2).join('-')}`;
      },
    },
  },
  platforms: {
    css: {
      // Taken from the CSS transformGroup
      // + our own transformer
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'color/css',
        'reduced-name',
      ],
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
