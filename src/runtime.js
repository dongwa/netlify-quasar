import { handler } from './main.js'
import { IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';

async function localCall(handler, { method = 'GET', url = '/', headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const req = Object.assign(new IncomingMessage(new EventEmitter()), {
      method,
      url,
      headers: { ...headers },
      body,
    });

    const res = Object.assign(new ServerResponse(req), {
      body: '',
      write(chunk) {
        this.body += chunk.toString();
      },
      end(chunk) {
        if (chunk) this.write(chunk);
        this.emit('finish');
      },
      getHeaders() {
        return this.getHeaderNames().reduce((headers, name) => {
          headers[name] = this.getHeader(name);
          return headers;
        }, {});
      }
    });

    res.on('finish', () => {
      resolve(new Response(res.body, {
        status: res.statusCode,
        headers: res.getHeaders(),
      }));
    });

    res.on('error', (error) => {
      reject(error);
    });

    handler(req, res);
  });
}

export default (req) => {
  const u = new URL(req.url,);
  const url = `${u.pathname}${u.search}`;
  return localCall(handler, {
    method: req.method,
    url,
    headers: req.headers,
  });
}

export const config = {
  name: "server",
  generator: "quasar",
  path: "/*",
  nodeBundler: "none",
  includedFiles: ["**"],
  excludedPath: ["/node_modules/*", "/src/*", "/src-ssr/*"],
  preferStatic: true,
};