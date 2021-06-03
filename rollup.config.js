import ts from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import serve from 'rollup-plugin-serve'
import path from 'path'
import pkg from './package.json'

const isDevelopment = process.env.NODE_ENV === 'development'

export default [
  {
    input: 'src/index.ts',
    output: { name: 'UniHttp', file: pkg.browser, format: 'umd' },
    plugins: [
      resolve({
        extensions: ['.js', '.ts']
      }),
      commonjs(),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      isDevelopment ? serve() : uglify({}, minify)
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.ts']
      }),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      isDevelopment ? serve() : uglify({}, minify)
    ]
  }
]
