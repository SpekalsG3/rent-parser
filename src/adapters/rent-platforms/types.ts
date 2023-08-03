import { IOffer } from 'types/project'
import { IMap } from 'types/general'

// todo unify
import { ISearchRequest } from './avito/types'

export interface IConfig {
  baseUrl: string
  headers?: IMap<string>
}

export interface IPlatformParser {
  getName: () => string
  getActiveOffers: (searchRequest: ISearchRequest) => Promise<IOffer[]>
}
