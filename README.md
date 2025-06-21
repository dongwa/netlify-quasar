# Quasar App Extension netlify

Help you Deploy Quasar to netlify with SSR mode!

[![npm](https://img.shields.io/npm/v/quasar-app-extension-netlify.svg?label=quasar-app-extension-netlify)](https://www.npmjs.com/package/quasar-app-extension-netlify)
[![npm](https://img.shields.io/npm/dt/quasar-app-extension-netlify.svg)](https://www.npmjs.com/package/quasar-app-extension-netlify)

# demo

githug repo:
https://github.com/dongwa/quasar-netlify-test

netlify preview:
https://quasar2-ssr.netlify.app/

# Install
```bash
quasar ext add netlify
```
Quasar CLI will retrieve it from NPM and install the extension.


# usage

## change the listen function in your `src-ssr/server.js|ts` file

- return { handler: ssrHandler }

```js
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app;
  if (process.env.DEV) {
    return server.listen(port, () => {
      if (process.env.PROD) {
        console.log('Server listening at port ' + port);
      }
    });
  } else {
    return {
      handler: server,
    };
  }
});
```


# Uninstall
```bash
quasar ext remove netlify
```
# How to work

Please read:
https://docs.netlify.com/frameworks-api/


# License
MIT (c) donglin
