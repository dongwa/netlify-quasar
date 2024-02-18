import fs from 'fs'
import path from 'path'

function createNetlifySSRFunction(api,quasarConf) {
  // Create the Netlify function
  const distDir = path.resolve(api.appDir, quasarConf.build.distDir)
  const netifyFuncDir = path.join(distDir, '/netlify/functions')
  fs.mkdirSync(netifyFuncDir, {
    recursive: true
  })
  const code = 'const ssr = require(\'../../index.js\')\nexports.handler = ssr.default.handler'
  fs.writeFileSync(path.join(netifyFuncDir, 'index.js'), code, {
    encoding: 'utf-8'
  })

  // Create the static resource directory for Netlify
  const clientDir = path.join(distDir, 'client')
  let str = '# Redirects from what the browser requests to what we serve\n'
  const files = fs.readdirSync(clientDir)
  for (const file of files) {
    // I'm using the lazy method here. You should use the fs. stat method to determine if the file is a directory
    if (file.includes('.')) {
      str += `/${file}                        /${file}\n`
    } else {
      str += `/${file}/*                        /${file}/:splat\n`
    }
  }

  fs.writeFileSync(path.join(clientDir, '_redirects'), str, {
    encoding: 'utf-8'
  })
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

  api.afterBuild((api, { quasarConf }) => {
    createNetlifySSRFunction(api,quasarConf)
  })
}
