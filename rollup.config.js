import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import serve from 'rollup-plugin-serve'
import pkg from './package.json'

const isDevelopment = process.env.NODE_ENV === 'development'

export default [
  {
    input: 'index.js',
    output: { name: 'UniHttp', file: pkg.browser, format: 'umd' },
    plugins: [
      resolve({
        extensions: ['.js', '.ts']
      }),
      commonjs(),
      isDevelopment ? serve() : uglify({}, minify)
    ]
  },
  {
    input: 'index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.ts']
      }),
      isDevelopment ? serve() : uglify({}, minify)
    ]
  }
]
