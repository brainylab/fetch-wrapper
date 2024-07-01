import { createConfig } from '@brainylab/eslint-config';
export default createConfig({
	config: { rules: { 'no-restricted-syntax': 'off' } },
	presets: {
		node: true,
		typescript: true,
	},
});
