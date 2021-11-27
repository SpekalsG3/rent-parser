import { AvitoServices, EAvitoCities, EAvitoMetroIds, IAvitoFilterTypes } from 'configs/avito'

export interface ISearchRequest {
  city: EAvitoCities
  service: typeof AvitoServices[keyof typeof AvitoServices]
  metro: EAvitoMetroIds[]
  filter: IAvitoFilterTypes
}
