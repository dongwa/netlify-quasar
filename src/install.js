import fs from 'fs'

/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 */

export default function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app-*" CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0 || ^2.0.0-beta.1')
  }
  else if (api.hasWebpack) {
    api.compatibleWith('@quasar/app-webpack', '^3.10.0 || ^4.0.0-beta.1')
  }

  // create netlify.toml
  const netlifyConfigFilePath = api.resolve.app('netlify.toml')
  if (!fs.existsSync(netlifyConfigFilePath)) {
    const netlifySSRConfig = `
[build]
  base = '.'
  publish = 'dist/ssr/client'
  command = 'quasar build -m ssr'

[functions]
  external_node_modules = ["express"]
  directory = 'dist/ssr/netlify/functions'

[[redirects]]
  force = true 
  from = "/assets/*"
  status = 200
  to = "/assets/:splat"

[[redirects]]
  force = true
  from = "/*"
  status = 200
  to = "/.netlify/functions/index/:splat"
    `
    fs.writeFileSync(netlifyConfigFilePath, netlifySSRConfig)
  } else {
    console.log(`The netlify.toml file already exists in the root directory, 
    and we will not change the content of your file. 
    You are responsible for its correctness.
    If there are any issues, please refer to:
    https://github.com/quasarframework/quasar/discussions/16565`)
  }
}
