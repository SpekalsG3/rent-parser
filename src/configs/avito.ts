import assert from 'assert'

import { IMap } from '../types/general'

export enum EAvitoCities {
  spb = 'sankt-peterburg',
}

export enum EAvitoApartmentType {
  rent = 'sdam',
  buy = 'prodam',
}

export enum EAvitoApartmentTimeTerm {
  long = 'na_dlitelnyy_srok',
}

export interface IAvitoService {
  name: string
  query: string[]
}

export enum EAvitoMetroIds {
  parnas = 213,
}

export interface IAvitoConfig {
  baseUrl: string
  headers: IMap<string>
}

export const AvitoFilterMarkers = { // todo reverseEngineer onClick on button `search-filters/submit-button`
  rooms: {
    studio: 'params[550](5702-root)',
    one: 'params[550](5703-root)',
    two: 'params[550](5704-root)',
    three: 'params[550](5705-root)',
    four: 'params[550](5706-root)',
    fiveplus: 'params[550](5707-root)',
  },
  amount: {
    from: '', // todo
    to: '', // todo
  },
  houseType: {
    brick: '', // todo
    panel: '', // todo
    block: '', // todo
    monolith: '', // todo
    wooden: '', // todo
  },
  owner: {
    all: '', // todo
    private: '', // todo
    agent: '', // todo
  },
} as const

export interface IAvitoFilterTypes {
  rooms: {
    [key in keyof typeof AvitoFilterMarkers.rooms]?: boolean
  }
  amount: {
    [key in keyof typeof AvitoFilterMarkers.amount]?: number
  }
  houseType: {
    [key in keyof typeof AvitoFilterMarkers.houseType]?: boolean
  }
  owner: typeof AvitoFilterMarkers.owner[keyof typeof AvitoFilterMarkers.owner]
}

export const AvitoServices = {
  apartment: {
    name: 'kvartiry',
    query: [EAvitoApartmentType.rent, EAvitoApartmentTimeTerm.long],
  },
} as const

assert(process.env.AVITO_BASE_URL, 'process.env.AVITO_BASE_URL is required')

export const avitoConfig: IAvitoConfig = {
  baseUrl: process.env.AVITO_BASE_URL,
  headers: {
    'sec-fetch-user': '?1',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'upgrade-insecure-requests': '1',
    referer: 'https://www.youtube.com/',
    'accept-language': 'en',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
  },
} as const
