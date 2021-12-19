import assert from 'assert'

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
  all = '156-161-163-164-165-177-178-180-184-185-197-201-202-205-212-1015'
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

export const avitoConfig = {
  baseUrl: process.env.AVITO_BASE_URL,
} as const

export type IAvitoConfig = typeof avitoConfig
