import { vitePreprocess } from '@astrojs/svelte';

export default {
  preprocess: vitePreprocess(),
  alias: {
    $lib: './src/lib',
  },
};