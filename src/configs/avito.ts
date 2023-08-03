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
  prosvechenie = 197,
  ozerki = 183,
  udelnaya = 207,
  pionerskaya = 186,
  chernayaRechka = 156,
  petrogradskaya = 185,
  gorkovskaya = 164,
  spaskaya = 1015,
  nevskiy = 180,
  technologka = 205,
  frynzenskaya = 163,
  moskovskieVorota = 178,
  elektrosila = 161,
  parkPobedi = 184,
  moskovskaya = 177,
  zvezdnaya = 212,
  kupchino = 170,
  gostiniyDvor = 165,
  sennaya = 202,
  sadovaya = 201,
  baltiiskiy = 155,
  pushkinskaya = 199,
  zvenigorodksaya = 1016,
  vostanie = 191,
  mayakovskaya = 176,
  alexandraNevskogo = 187,
  dostoevskaya = 160,
  vladimirskaya = 210,
  grajdanka = 166,
  ligovskiy = 174,
  blueBranch = '156-161-163-164-170-177-178-180-183-184-185-186-197-202-205-207-212-213'
}

export const EAvitoMetroBranches = {
  red: [
    EAvitoMetroIds.grajdanka,
    EAvitoMetroIds.vostanie,
    EAvitoMetroIds.vladimirskaya,
    EAvitoMetroIds.pushkinskaya,
    EAvitoMetroIds.technologka,
    EAvitoMetroIds.baltiiskiy,
  ],
  blue: [
    EAvitoMetroIds.parnas,
    EAvitoMetroIds.prosvechenie,
    EAvitoMetroIds.ozerki,
    EAvitoMetroIds.udelnaya,
    EAvitoMetroIds.pionerskaya,
    EAvitoMetroIds.chernayaRechka,
    EAvitoMetroIds.petrogradskaya,
    EAvitoMetroIds.gorkovskaya,
    EAvitoMetroIds.nevskiy,
    EAvitoMetroIds.sennaya,
    EAvitoMetroIds.technologka,
    EAvitoMetroIds.frynzenskaya,
    EAvitoMetroIds.moskovskieVorota,
    EAvitoMetroIds.elektrosila,
    EAvitoMetroIds.parkPobedi,
    EAvitoMetroIds.moskovskaya,
    EAvitoMetroIds.zvezdnaya,
    EAvitoMetroIds.kupchino,
  ],
  green: [
    EAvitoMetroIds.gostiniyDvor,
    EAvitoMetroIds.mayakovskaya,
  ],
  yellow: [
    EAvitoMetroIds.spaskaya,
  ],
  purple: [
    EAvitoMetroIds.sadovaya,
    EAvitoMetroIds.zvenigorodksaya,
  ],
  orange: [
    EAvitoMetroIds.dostoevskaya,
    EAvitoMetroIds.ligovskiy,
  ],
}

export enum EAvitoSortIds {
  cheaper = '1',
  moreExpensive = '2',
  latest = '104',
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
