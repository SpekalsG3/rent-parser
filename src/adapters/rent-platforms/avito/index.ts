import { parse } from 'node-html-parser'

import { EAvitoSortIds, IAvitoConfig, IAvitoFilterTypes } from 'configs/avito'
import { Logger } from 'libs/logger'
import { ICustomHTMLElement, IOffer } from 'types/project'
import { parseRuDate } from 'utils/parse-ru-date'
import { Scrapper } from 'services/scrapper'
import { IScrapperConfig } from 'configs/scrapper'
import { Request } from 'libs/request'

import { IPlatformParser } from '../types'

import { RequestErrors } from './errors'
import { IParseResult, ISearchRequest } from './types'
import { IInitialData, TAvitoBxSinglePageGroup } from './types/initial-data'
import { IBxSinglePage } from './types/initial-data/groups/bx-single-page'
import { ICatalogItem } from './types/initial-data/groups/catalog-item'

export class AvitoAdapter implements IPlatformParser {
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
    // return 'ASgBAQECAkSSA8gQ8AeQUgJA7gc0iFKGUoJSzAgkkFmOWQFFxpoMGXsiZnJvbSI6MjAwMDAsInRvIjozMDAwMH0'

    // no wifi 20k-30k
    // return 'ASgBAQECAkSSA8gQ8AeQUgVA7gdEmOuZAohShlKCUswIJJBZjlnswQ00hs85hM85gs85iL0ONOKk0QHepNEB4KTRAdL7DkSG6~MChOvjAoLr4wKA6~MCAUXGmgwZeyJmcm9tIjoyMDAwMCwidG8iOjMwMDAwfQ' + '&footWalkingMetro=20'

    // no wifi 22k-30k
    // return 'ASgBAQECAkSSA8gQ8AeQUgVA7gdEmOuZAohShlKCUswIJJBZjlnswQ00hs85hM85gs85iL0ONOKk0QHepNEB4KTRAdL7DkSG6~MChOvjAoLr4wKA6~MCAUXGmgwZeyJmcm9tIjoyMjAwMCwidG8iOjMwMDAwfQ'

    // no wifi 22k-32k
    return 'ASgBAQECAkSSA8gQ8AeQUgVA7gdEmOuZAohShlKCUswIJJBZjlnswQ00hs85hM85gs85iL0ONOKk0QHepNEB4KTRAdL7DkSG6~MChOvjAoLr4wKA6~MCAUXGmgwZeyJmcm9tIjoyMjAwMCwidG8iOjMyMDAwfQ'
  }

  private async fetchHtmlDocument (request: ISearchRequest): Promise<ICustomHTMLElement> {
    const path = `/${request.city}/${request.service.name}/${request.service.query.join('/')}`

    const requestKey = AvitoAdapter.encodeRequest(null) // fixme parameters
    const filterKey = AvitoAdapter.encodeFilter(request.filter)

    const url = `${path}-${requestKey}?metro=${
      // @ts-expect-error // reduce cannot return string
      request.metro.reduce((id1, id2) => `${id1}-${id2}`)
    }&f=${filterKey}&s=${request.sort || EAvitoSortIds.latest}&p=${request.page || 1}` + (
        request.maxDistanceInMeters
          ? `&footWalkingMetro=${20}`
          : ''
      )

    let html: string
    try {
      if (this.scrapper) {
        html = await this.scrapper.get<string>(`${this.config.baseUrl}${url}`)
      } else {
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

  protected parseInitialData (request: ISearchRequest, initialData: IInitialData): IParseResult {
    const bxSinglePageKey = Object.keys(initialData).find(key => key.includes(TAvitoBxSinglePageGroup))

    const bxSinglePage: IBxSinglePage = initialData[bxSinglePageKey]

    const offers: IOffer[] = []
    bxSinglePage.data.catalog.items.forEach((item: ICatalogItem): void => {
      // there's an element which is not a catalog item
      if (!item.id) return

      try {
        const { PriceStep, DevelopmentNameStep, DateInfoStep } = item.iva

        const { priceDetailed } = PriceStep[0].payload
        const [geoReference] = DevelopmentNameStep[0].payload.geoForItems.geoReferences

        if (geoReference?.after && request.maxDistanceInMeters) {
          const [amountStr, unit] = geoReference.after.split(' ')
          if (unit === 'км' || unit === 'м') {
            let amount = Number(amountStr.replace(',', '.'))
            if (unit === 'км') {
              amount *= 1000
            }

            if (amount > request.maxDistanceInMeters) {
              return
            }
          }
        }

        offers.push({
          id: String(item.id),
          platform: this.getName(),
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
        console.trace(e)

        throw e
      }
    })

    return {
      itemsOnPage: bxSinglePage.data.itemsOnPage,
      itemsTotal: bxSinglePage.data.totalCount, // or count, or totalElements
      offers: offers,
    }
  }

  protected getHtmlOffers (document: ICustomHTMLElement): ICustomHTMLElement[] {
    // @ts-expect-error // actual function returns different interface
    return document.querySelectorAll('[data-marker="catalog-serp"] [data-marker="item"]')
  }

  protected parseHtmlOffers (request: ISearchRequest, offers: ICustomHTMLElement[]): IOffer[] {
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

        const distance = location.match(/([0-9]*(?:,[0-9]*)?) (к?м)/)
        if (distance) {
          let amount = Number(distance[1].replace(',', '.'))
          if (distance[2] === 'км') {
            amount *= 1000
          }

          // todo hardcoded
          if (amount > request.maxDistanceInMeters) {
            return null
          }
        }

        return {
          id: null, // todo
          platform: this.getName(),
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
    let allOffers: IOffer[] = []

    let newRequestPage = request.page || 1
    let processedItems: number = 0

    const maxRetries = 3
    let retries = 0

    while (true) {
      try {
        this.logger.info(`Fetching with ${this.scrapper ? 'scrapper' : 'axios'} page ${newRequestPage}...`)

        const document = await this.fetchHtmlDocument({
          ...request,
          page: newRequestPage,
        })
        const initialData = this.getInitialData(document)

        const {
          offers,
          itemsOnPage,
          itemsTotal,
        } = this.parseInitialData(request, initialData)

        allOffers = allOffers.concat(offers)
        processedItems += itemsOnPage

        this.logger.debug(`Items count: itemsOnPage ${itemsOnPage} (processed ${processedItems}), itemsTotal ${itemsTotal}`)
        if (itemsOnPage === 0 || processedItems >= itemsTotal) {
          break
        }

        newRequestPage += 1
      } catch (e) {
        if (retries >= maxRetries) {
          throw e
        }

        this.logger.error(`Request failed, trying again (${retries}/${maxRetries}), reason - ${e.message}`)
        retries++
      }
    }

    return allOffers
  }
}
