import { request as requestHttp } from 'http';
import { request as requestHttps } from 'https';

// Create an object type UserException
class HttpCliException {
  constructor(code, message) {
    this.code = code;
    this.message = message;
    this.name = 'HttpCliException';
  }
  // Make the exception convert to a pretty string when used as a string
  // (e.g., by the error console)
  toString() {
    return `${this.name}: ${code} ${this.message}`;
  }
}

const HttpCli = (
  params,
  { logger = console, securityHeaders={}, randomizer, errorCreator = (...params) => { return new HttpCliException(...params) } } = {},
) =>
  new Promise(async (resolve, reject) => {
    const {debug, error} = logger;
    let responseBody = '';
    let request;
    const url = createUrl(params);
    
    const ifHttpsRequired = url.protocol === 'https:';
    if (ifHttpsRequired) {
      request = requestHttps;
    } else {
      request = requestHttp;
    }
    const ifPortIsNotEmpty = !!`${url.port}`;
    let port;
    if (ifPortIsNotEmpty) {
      port = Number(url.port);
    } else if (ifHttpsRequired) {
      port = 443;
    } else {
      port = 80;
    }
    const options = {
      url: url.toString(),
      method: params.method || 'GET',
      host: url.hostname,
      path: url.pathname + url.search,
      port,
      protocol: url.protocol,
      headers: {
        'Content-Type': 'application/json',
        ...params.headers,
        // ...(securityHeaders.apiKey && { apiKey: securityHeaders.apiKey }),
        // ...(securityHeaders.apiSecret && { apiSecret: securityHeaders.apiSecret }),
        // ...(securityHeaders.resourceOwnerId && { resourceOwnerId: securityHeaders.resourceOwnerId }),
        ...(randomizer && { ['X-Request-ID']: randomizer.uuid() }),
      },
    };
    debug(`METHOD: ${options.method}`);
    debug(`URL: ${options.url}`);
    debug(`REQUEST HEADERS: ${JSON.stringify(options.headers)}`);
    console.log('requesting xxx');
    console.log(options);
    const req = request(options, res => {
      debug(`STATUS: ${res.statusCode}`);
      debug(`RESPONSE HEADERS: ${JSON.stringify(res.headers)}`);
      return res
        .on('data', data => {
          responseBody += data;
        })
        .on('end', () => {
          try {
            // debug(`Response: ${responseBody}`);
            if(res.statusCode!==200) {
              return reject(errorCreator(res.statusCode, res.statusMessage));
            }
            const contentType = res.headers['content-type'] || '';
            const contentTypeIsJson = contentType.toLowerCase().indexOf('application/json') !== -1
            if (contentTypeIsJson) {
              debug(`Response type is JSON`);
              return resolve({ ...res, body: JSON.parse(responseBody) });
            }
            debug(`Response type is plain text`);
            return resolve({ ...res, body: `${responseBody}` });
          } catch (error) {
            return reject(error);
          }
        }).on('error', e => {
          error(`Got Error`);
          return reject(e);
        });
    });
    req.on('error', e => {
      error(`Got Error`);
      return reject(e);
    });
    req.on('timeout', () => {
      error(`Got Timeout`);
      return reject(errorCreator(408, 'REQUEST TIMEOUT'));
    });
    if (params.body) {
      req.write(JSON.stringify(params.body));
    }
    req.end();
    return req;

    // Functions

    function createUrl(params) {
      if(!params.url) {
        throw new Error('params.url is missing');
      }
      try {
        console.log(params.url);
        return new URL(params.url);
      } catch (error) {
        console.error(`${error}`);
        if(process && process.env) {
          const { NEXT_PUBLIC_SELF_HOST, SELF_HOST } = process.env;
          if(NEXT_PUBLIC_SELF_HOST) {
            return new URL(`${trimTrailingSlash(NEXT_PUBLIC_SELF_HOST)}${params.url}`);
          } else if (SELF_HOST) {
            return new URL(`${trimTrailingSlash(SELF_HOST)}${params.url}`);
          }
        }
        if (window.location.origin) {
          return new URL(`${trimTrailingSlash(window.location.origin)}${params.url}`);
        } 
        throw error;
      }
    }
    
    function trimTrailingSlash(str) {
      return str.replace(/\/*$/, '')
    }
    
  });

export default HttpCli;
