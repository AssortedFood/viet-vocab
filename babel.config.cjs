// babel.config.cjs
module.exports = {
  presets: [
    // Keep your current env preset
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // Add React JSX support
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
