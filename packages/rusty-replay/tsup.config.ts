import { defineConfig } from 'tsup';
import pkg from './package.json';

export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.build.json',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2017',
  splitting: false,
  shims: true,
  external: ['react', 'rrweb', 'rrweb-player', '@rrweb/types', 'axios'],
  // external: [
  //   ...Object.keys(pkg.peerDependencies ?? {}),
  //   // axios도 외부에 두고 싶다면 여기에 추가
  //   'axios',
  // ],
});
