import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createNetlifySSRFunction(api, quasarConf) {
  // Create the Netlify function
  console.log('Creating Netlify function')
  const distDir = quasarConf.build.distDir
  const code = fs.readFileSync(path.join(__dirname, './runtime.js'), 'utf-8')
  fs.writeFileSync(path.join(distDir, 'index.mjs'), code, 'utf-8')
}


export default function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app-*" CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^1.5.0 || ^2.0.0-beta.1')
  }
  else if (api.hasWebpack) {
    api.compatibleWith('@quasar/app-webpack', '^3.10.0 || ^4.0.0-beta.1')
  }


  /**
   * @param {function} fn
   *   (cfg: Object, ctx: Object) => undefined
   */
  api.extendQuasarConf((conf) => {
    conf.build.distDir = '.netlify/v1/functions/index'
  })

  /**
   * @param {function} fn
   *   (esbuildConf: Object, api) => undefined
   */
  if (api.hasVite === true) {
    api.extendSSRWebserverConf((esbuildConf) => {
      console.log('you are using vite, we need bundle the code')
      esbuildConf.bundle = true;
      console.log("you are using vite, we need replace index.js to main.mjs")
      esbuildConf.outfile = esbuildConf.outfile.replace(/index\.js$/, 'main.mjs')
    })
  }

  api.afterBuild((api, { quasarConf }) => {
    const distDir = quasarConf.build.distDir
    if (api.hasWebpack === true) {
      console.log('you are using webpack, we need rename index.mjs to main.mjs')
      fs.renameSync(path.join(distDir, 'index.mjs'), path.join(distDir, 'main.mjs'))
    }
    createNetlifySSRFunction(api, quasarConf)
    console.log('install production dependencies')
    execSync('npm install', { cwd: distDir, encoding: 'utf-8' })
    console.log('success')
  })
}
