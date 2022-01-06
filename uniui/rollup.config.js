import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import serve from 'rollup-plugin-serve'
import pkg from './package.json'
import copy from 'rollup-plugin-copy'

const isDevelopment = process.env.NODE_ENV === 'development'
const { browser, main, module, version } = pkg
const libVersion = `anyup-uniui-${version}`

export default [
  {
    input: 'index.js',
    output: { name: 'anyup', file: browser, format: 'umd' },
    plugins: [
      resolve({
        extensions: ['.js', '.ts']
      }),
      commonjs(),
      isDevelopment ? serve() : uglify({}, minify),
      copy({
        targets: [
          { src: 'components/*', dest: `ext/${libVersion}/components/anyup-uniui/components` },
          { src: 'libs/*', dest: `ext/${libVersion}/components/anyup-uniui/libs` },
          { src: ['index.js', 'index.scss', 'theme.scss', 'u.theme.scss'], dest: `ext/${libVersion}/components/anyup-uniui` }
        ]
      })
    ]
  },
  {
    input: 'index.js',
    output: [
      { file: main, format: 'cjs' },
      { file: module, format: 'es' }
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.ts']
      }),
      isDevelopment ? serve() : uglify({}, minify)
    ]
  }
]
