import * as path from 'path';
import { Configuration } from 'webpack';

module.exports = function override(config: Configuration): Configuration {
  config.resolve = {
    ...config.resolve,
    alias: { ...config.resolve?.alias, '@modules': path.resolve(__dirname, 'src/modules/') },
  };

  return config;
};