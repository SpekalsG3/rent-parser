import { ICatalogItem } from './catalog-item'
import { ICategoryTreeItem } from './category-tree-item'

export interface IBxSinglePage {
  data: {
    url: string
    searchHash: string
    subscription: {
      id: unknown | null // todo
      subscriber_id: unknown | null // todo
      visible: boolean
      isShowSavedTooltip: boolean
      isErrorSaved: boolean
      isAuthenticated: boolean
    }
    count: number
    totalCount: number
    totalElements: number
    mainCount: number
    extraCount: number
    witchersCount: number
    itemsOnPage: number
    itemsOnPageMainSection: number
    catalog: {
      views: {
        gallery: {
          title: string
        }
        default: {
          title: string
          alias: string
        }
      }
      sortDefault: number
      sorts: Array<{
        value: number
        title: {
          default: string
          job?: string
        }
      }>
      loading: boolean
      items: Array<ICatalogItem | {
        code: string
        type: string
      }>
    }
    filters: {
      main: Array<{
        id: string
        attrId: number
        type: string
        currentValue: string
        displaying: {
          limit: number
          reduced: boolean
        }
        updatesForm: boolean
        values: Array<{
          name: string
          value: string
        }>
      }>
      urls: string[]
    }
    filtersGroup: string
    seo: {
      title: string
      description: string
      keywords: string
      h1: string
      canonicalUrl: string
      alternateUrl: string
      appIndexingUrls: string[]
    }
    rubricators: {
      categoryTreeTop: ICategoryTreeItem[]
      categorySelect: ICategoryTreeItem[]
      categoryWithCounters: Array<{
        data: Array<{
          cnt: number
          id: number
          lid: number
          name: string
          seo_title: string
          url: string
        }>
        len: number
      }>
      rubricatorCategories: ICategoryTreeItem[]
      hideRubricator: boolean
      locationNamePrepositional: string
      loading: boolean
      title: string
      pageTitle: string
      pageTitleDesc: string
      pageTitleNote: string
      pageTitleNoteHref: string
      allItems: unknown[] // todo
      popularItems: unknown[] // todo
      popularItemsTwoColumns: boolean
    }
    advert: {
      banners: {
        [key: string]: {
          code: string
        }
      }
    }
    seoNavigation: {
      geo: {
        tabs: Array<{
          title: string
          label: string
          links: Array<{
            name: string
            url: string
          }>
        }>
        breadcrumbs: Array<{
          name: string
          url: string
        }>
      }
      breadcrumbs: {
        links: Array<{
          name: string
          title: string
          url: string
        }>
      }
    }
    faq: {
      title: string
      questions: Array<{
        title: string
        answer: string
      }>
    }
    features: {
      imageAspectRatio: `${number}:${number}` // eg 4:3
      noPlaceholders: boolean
      justSpa: boolean
      responsive: boolean
      useReload: boolean
      stickyCatalogFilters: boolean
      adsInMapTest: {
        [key: string]: boolean
      }
      mapButtonSlimTest: boolean
      listVip: boolean
      searchHistory: boolean
      newDoublesUxTest: boolean
      newDoublesUxRealtyTest: boolean
      newDoublesMapRealtyTest: boolean
      simpleCounters: boolean
      isRatingExperiment: boolean
      isContactsButtonRedesigned: boolean
    }
    meta: {
      forceLocation: boolean
      mapScreenUrl: string
      applyButton: {
        enabled: boolean
        title: string
        presentationType: string
      }
      selectedFiltersCount: number
      proProfileDomain: unknown | null // todo
      sellerId: unknown | null // todo
      userHash: unknown | null // todo
      proprofile: number
      split: number
      hasStrWitcher: boolean
      strDateRange: unknown | null // todo
      mapButton: {
        enabled: boolean
      }
    }
    searchCore // todo
    singlePage // todo
    changeLocations // todo
    geoMap // todo
    pageTypes // todo
    sideBlock // todo
    mcId: number
    hideSaveSearch: boolean
    release: string
    searchFooter // todo
    isEnabledNeoNPS: boolean
    isAuthenticated: boolean
    rmpData // todo
  }
  cookies: {
    [key: string]: string
  }
}
