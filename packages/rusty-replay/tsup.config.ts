import { defineConfig } from 'tsup';
import pkg from './package.json';

export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.build.json',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  platform: 'browser',
  clean: true,
  target: 'es2017',
  splitting: false,
  shims: true,
  external: [
    'react',
    'rrweb',
    'rrweb-player',
    '@rrweb/types',
    'axios',
    'require-in-the-middle',
    'import-in-the-middle',
    '@opentelemetry/instrumentation',
    '@opentelemetry/context-zone',
    '@opentelemetry/core',
    '@opentelemetry/sdk-trace-web',
    '@opentelemetry/sdk-trace-base',
    '@opentelemetry/instrumentation-fetch',
    '@opentelemetry/instrumentation-xml-http-request',
    '@opentelemetry/exporter-trace-otlp-proto',
    '@opentelemetry/resources',
    '@opentelemetry/semantic-conventions',
  ],
  // external: [
  //   ...Object.keys(pkg.peerDependencies ?? {}),
  //   'axios',
  // ],
});
