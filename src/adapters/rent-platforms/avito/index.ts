import { parse } from 'node-html-parser'

import { IAvitoConfig, IAvitoFilterTypes } from 'configs/avito'
import { Logger } from 'libs/logger'
import { ICustomHTMLElement, IOffer } from 'types/project'
import { parseRuDate } from 'utils/parse-ru-date'
import { Scrapper } from 'services/scrapper'
import { IScrapperConfig } from 'configs/scrapper'
import { Request } from 'libs/request'

import { IPlatformParser } from '../types'

import { RequestErrors } from './errors'
import { ISearchRequest } from './types'
import { IInitialData, TAvitoBxSinglePageGroup } from './types/initial-data'
import { IBxSinglePage } from './types/initial-data/groups/bx-single-page'
import { ICatalogItem } from './types/initial-data/groups/catalog-item'

export class AvitoAdapter implements IPlatformParser {
  // private readonly api: Request
  private readonly scrapper: Scrapper
  private readonly config: IAvitoConfig
  private readonly logger = new Logger('AVITO-PARSER')
  private readonly api: Request

  constructor (config: IAvitoConfig, scrapperConfig?: IScrapperConfig) {
    this.config = config
    if (scrapperConfig) {
      this.scrapper = new Scrapper(scrapperConfig)
    } else {
      this.api = new Request({
        baseURL: config.baseUrl,
        headers: config.headers,
      })
    }
  }

  public getName (): string {
    return 'Avito'
  }

  private static encodeRequest (request: ISearchRequest): string {
    return 'ASgBAgICAkSSA8gQ8AeQUg'
  }

  private static encodeFilter (parameters: IAvitoFilterTypes): string {
    return 'ASgBAQECAkSSA8gQ8AeQUgJA7gc0iFKGUoJSzAgkkFmOWQFFxpoMFXsiZnJvbSI6MCwidG8iOjI1MDAwfQ'
  }

  private async fetchHtmlDocument (request: ISearchRequest): Promise<ICustomHTMLElement> {
    const { city, service, filter, metro } = request
    const path = `/${city}/${service.name}/${service.query.join('/')}`

    // @ts-expect-error // reduce cannot return string
    const query = `metro=${metro.reduce((id1, id2) => `${id1}-${id2}`)}`

    const requestKey = AvitoAdapter.encodeRequest(null) // fixme parameters
    const filterKey = AvitoAdapter.encodeFilter(filter)

    const url = `${path}-${requestKey}?${query}&f=${filterKey}`

    let html: string
    try {
      if (this.scrapper) {
        this.logger.info('Fetching using scrapper...')
        html = await this.scrapper.get<string>(`${this.config.baseUrl}${url}`)
      } else {
        this.logger.info('Fetching using axios...')
        const { data } = await this.api.get<string>(url)
        html = data
      }
    } catch (error) {
      let errorMessage = error.message

      if (typeof error.response?.data === 'string') {
        try {
          const document = parse(error.response.data)
          const title = document.getElementsByTagName('title')[0].innerHTML
          let description: string

          if (title.includes(RequestErrors.forbidden)) {
            description = document.getElementsByTagName('p')[0].innerText
          }

          const formatDescription = description ? `. ${description}` : ''
          errorMessage = `${title}${formatDescription}`
        } catch (e) {
          errorMessage = error.response.data
        }
      }

      throw new Error(errorMessage)
    }

    // @ts-expect-error // actual function returns different interface
    return parse(html)
  }

  protected getInitialData (document: ICustomHTMLElement): IInitialData {
    const initialDataNode = document.querySelectorAll('script').find(node => {
      return node.innerText.startsWith('window.__initialData__ = "')
    })

    if (!initialDataNode) {
      throw new Error('Failed to find node with initial data')
    }

    // todo small js interpreter to prevent string length bugs
    const initialDataText = decodeURIComponent(initialDataNode.innerText)
    const initialDataJson = initialDataText.slice('window.__initialData__ = "'.length, initialDataText.indexOf('window.__locations__') - 3)

    try {
      return JSON.parse(initialDataJson)
    } catch (e) {
      throw new Error(`Failed to parse initial data - ${e.message}`)
    }
  }

  protected parseInitialData (initialData: IInitialData): IOffer[] {
    const bxSinglePageKey = Object.keys(initialData).find(key => key.includes(TAvitoBxSinglePageGroup))

    const bxSinglePage: IBxSinglePage = initialData[bxSinglePageKey]

    const offers: IOffer[] = []
    bxSinglePage.data.catalog.items.forEach((item: ICatalogItem): void => {
      // there's an element which is not a catalog item
      if (!item.id) return null

      try {
        const { PriceStep, DevelopmentNameStep, DateInfoStep } = item.iva

        const { priceDetailed } = PriceStep[0].payload
        const [geoReference] = DevelopmentNameStep[0].payload.geoForItems.geoReferences

        offers.push({
          title: item.title,
          url: `${this.config.baseUrl}${item.urlPath}`,
          description: item.description,
          price: `${priceDetailed.value} ${priceDetailed.postfix}`,
          location: geoReference
            ? `${geoReference.content}${geoReference.after ? ` ${geoReference.after}` : ''}`
            : 'unknown',
          publishedAt: {
            absolute: parseRuDate(DateInfoStep[0].payload.absolute, DateInfoStep[0].payload.relative),
            relative: DateInfoStep[0].payload.relative,
          },
          images: item.gallery.noPhoto
            ? []
            : item.images.map((imageRes): string => {
              const sortedRes = Object.keys(imageRes).sort((resA, resB) => {
                const [widthA] = resA.split('x')
                const [widthB] = resB.split('x')
                return Number(widthB) - Number(widthA)
              })

              return imageRes[sortedRes[0]]
            }),
        })
      } catch (e) {
        this.logger.error(`Failed to parse offer with id ${item.id} - ${e.message}`)

        throw e
      }
    })

    return offers
  }

  protected getHtmlOffers (document: ICustomHTMLElement): ICustomHTMLElement[] {
    // @ts-expect-error // actual function returns different interface
    return document.querySelectorAll('[data-marker="catalog-serp"] [data-marker="item"]')
  }

  protected parseHtmlOffers (offers: ICustomHTMLElement[]): IOffer[] {
    return offers.map((html): IOffer => {
      const data = html.childNodes[1].childNodes[1]
      try {
        let locationNodeIndex = 3
        if (data.childNodes[locationNodeIndex + 1].attrs.class.includes('developmentNameStep')) {
          locationNodeIndex += 1
        }

        let publishAtNodeIndex = locationNodeIndex + 2
        if (data.childNodes[publishAtNodeIndex + 1]?.attrs.class.includes('dateInfoStep')) {
          publishAtNodeIndex += 1
        }

        const title = data.childNodes[1].childNodes[0].childNodes[0].innerText
        const price = data.childNodes[2].childNodes[0].childNodes[0].childNodes[3].innerText
        const location = data.childNodes[locationNodeIndex].childNodes[0].childNodes[1]?.innerText || 'unknown'
        const description = data.childNodes[locationNodeIndex + 1].childNodes[0].innerText
        const publishedAt = data.childNodes[publishAtNodeIndex].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText

        return {
          title: title,
          price: price,
          location: location,
          description: description,
          publishedAt: {
            absolute: parseRuDate(publishedAt, null),
            relative: null,
          },
          url: '',
          images: [],
        }
      } catch (e) {
        this.logger.error(`Failed to parse offer with id ${html.attrs.id} - ${e.message}`)
        console.trace(e)

        throw e
      }
    })
  }

  async getActiveOffers (request: ISearchRequest): Promise<IOffer[]> {
    const document = await this.fetchHtmlDocument(request)
    const initialData = this.getInitialData(document)
    return this.parseInitialData(initialData)
  }
}
