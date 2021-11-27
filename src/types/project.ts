import { HTMLElement } from 'node-html-parser'

export interface ICustomHTMLElement extends HTMLElement {
  childNodes: ICustomHTMLElement[]
}

export interface IOffer {
  title: string
  url: string
  price: string // todo parse currency and amount separately
  location: string // todo parse metro and distance separately
  description: string
  publishedAt: {
    absolute: Date
    relative: string
  }
  images: string[] // todo
}

export interface ISettings {
  updatedAt: string // date iso string
  parsedOfferUrls: {
    [platform: string]: string[]
  }
}
