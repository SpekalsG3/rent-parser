import { AvitoServices, EAvitoCities, EAvitoMetroIds, EAvitoSortIds, IAvitoFilterTypes } from 'configs/avito'

import { IOffer } from 'types/project'

export interface ISearchRequest {
  city: EAvitoCities
  service: typeof AvitoServices[keyof typeof AvitoServices]
  metro: EAvitoMetroIds[]
  filter: IAvitoFilterTypes
  sort?: EAvitoSortIds
  page?: number
}

export interface IParseResult {
  itemsOnPage: number
  itemsTotal: number
  offers: IOffer[]
}
