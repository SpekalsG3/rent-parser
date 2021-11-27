import { IMap } from '../../types/general'

export enum EProtocols {
  http = 'http',
  https = 'https',
}

export enum EMethods {
  post = 'post',
  get = 'get',
}

export interface IOptions {
  headers?: {
    [key: string]: string
  }
  timeout?: number
}

export interface IConfig extends IOptions {
  baseURL?: string
}

export type TGetParams = IMap<string | number>

export interface TMethodToParams {
  [EMethods.post]: object
  [EMethods.get]: TGetParams
}

export type TParams<M extends EMethods> = IOptions & { params?: TMethodToParams[M] }

// easier to handle one type than `string | string[]` union because `cookies` are `string[]`
export type THeaders = IMap<string | string[]>

export interface IRequestResponse<TResponseData> {
  data: TResponseData
  headers: THeaders
  status: number
}
