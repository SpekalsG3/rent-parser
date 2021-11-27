import https, { RequestOptions } from 'https'
import http from 'http'

import { EMethods, EProtocols, IConfig, IRequestResponse, TGetParams, TParams } from './types'

// todo http and ports
const hostnameRegexpStr = '^(https?):\\/\\/((?:www\\.|(?!www))(?:[a-zA-Z0-9]+\\.?)+[a-z]{2,})'
const pathRegexpStr = '((?:\\/[a-zA-Z0-9_-]+)+)?(?:\\?([a-zA-Z0-9_]+=[^\\s]+(?:&[a-zA-Z0-9_]+=[^\\s]+)*))?$'
const urlRegexpStr = `${hostnameRegexpStr}${pathRegexpStr}`

export const hostnameRegexp = new RegExp(hostnameRegexpStr)
export const pathRegexp = new RegExp(pathRegexpStr)
export const urlRegexp = new RegExp(urlRegexpStr)

export class RequestError<TResponseData = unknown> extends Error {
  public status: number
  public response: IRequestResponse<TResponseData>

  constructor (message: string, status: number, response: IRequestResponse<TResponseData>) {
    super(message)
    this.status = status
    this.response = response
  }
}

export class Request<TGlobalResponse = unknown> {
  private readonly config: IConfig = {}
  private readonly baseSchema: [EProtocols, string, string?] // protocol, host and path // todo make Schema type

  static makeQueryString (data: TGetParams): string {
    return data
      ? `?${Object.keys(data)
        .map((k) => `${k}=${data[k]}`)
        .join('&')}`
      : ''
  }

  static parseUrl (url: string): string[] {
    let protocol, host, path, query

    const parsedHost = url.match(hostnameRegexp)
    if (parsedHost) {
      ([, protocol, host, path] = parsedHost)
    }

    const parsedPath = url.match(pathRegexp)
    if (parsedPath) {
      ([, path, query] = parsedPath)
    }

    return [protocol, host, path, query]
  }

  async request<TRequestResponse extends TGlobalResponse, M extends EMethods> (
    method: M,
    url: string,
    { headers, params, timeout }: TParams<M> = {},
  ): Promise<IRequestResponse<TRequestResponse>> {
    const [protocol, host, path, query] = Request.parseUrl(url)

    const options: RequestOptions = {}

    let finalProtocol = protocol
    if (this.baseSchema) {
      finalProtocol = this.baseSchema[0]
      options.host = this.baseSchema[1]

      if (path) {
        const formattedPath = path[0] === '/' ? path : `/${path}`
        options.path = `${this.baseSchema[2] || ''}${formattedPath}`
      }
    } else {
      options.host = host
      options.path = path
    }

    if (query) {
      options.path = `${options.path || ''}/?${query}`
    }

    if (timeout) {
      options.timeout = timeout
    }

    options.headers = {
      ...this.config.headers,
      ...(headers),
    }

    if (!finalProtocol || !options.host) {
      throw new Error('Invalid url - no protocol or host')
    }

    return await new Promise<IRequestResponse<TRequestResponse>>((resolve, reject) => {
      const req = (finalProtocol === EProtocols.https ? https : http).request(options, (res) => {
        try {
          let response = ''

          res.setEncoding('utf8')

          res.on('data', function (chunk: string) {
            response += `${response}${chunk}`
          })

          res.on('end', function () {
            let responseData: any

            const contentType = res.headers['content-type'].split('; ')[0]
            switch (contentType) {
              case 'text/plain':
              case 'text/html':
                responseData = response
                break
              case 'application/json': {
                try {
                  responseData = JSON.parse(response)
                } catch (e) {
                  throw new Error(`Invalid response json - ${e.message}`)
                }
                break
              }
              default: {
                throw new Error(`Unknown content-type - ${res.headers['content-type']}`)
              }
            }

            const result = {
              data: responseData,
              headers: res.headers,
              status: res.statusCode,
            }
            if (res.statusCode === 200) {
              resolve(result)
            } else {
              reject(new RequestError<TRequestResponse>(`Request failed with status code ${res.statusCode}`, res.statusCode, result))
            }
          })
        } catch (e) {
          reject(e)
        }
      })

      req.on('error', function (e) {
        reject(e)
      })

      if (method === EMethods.post) {
        req.write(params)
      }

      req.end()
    })
  }

  async get<TLocalResponse extends TGlobalResponse> (url: string, params?: TParams<EMethods.get>): Promise<IRequestResponse<TLocalResponse>> {
    return await this.request<TLocalResponse, EMethods.get>(EMethods.get, url, params)
  }

  async post<TLocalResponse extends TGlobalResponse> (url: string, params?: TParams<EMethods.post>): Promise<IRequestResponse<TLocalResponse>> {
    return await this.request<TLocalResponse, EMethods.post>(EMethods.post, url, params)
  }

  constructor (config?: IConfig) {
    if (config) {
      if (config.baseURL) {
        const [protocol, host, path] = Request.parseUrl(config.baseURL)

        if (!protocol || !host) {
          throw new Error('Invalid baseUrl - no protocol or host')
        }

        this.baseSchema = [<EProtocols>protocol, host, path]
      }
      this.config = config
    }
  }
}
