
export interface ICatalogItem {
  id: number
  categoryId: number
  locationId: number
  isVerifiedItem: boolean
  urlPath: string
  title: string
  description: string
  category: {
    id: number
    name: string
    slug: string
    rootId: number
    compare: boolean
    pageRootId: number
  }
  location: {
    id: number
    name: string
    namePrepositional: string
    isCurrent: boolean
    isRegion: boolean
  }
  addressDetailed: {
    locationName: string
  }
  sortTimeStamp: number
  priceDetailed: {
    enabled: boolean
    fullString: string
    hasValue: boolean
    postfix: string
    string: string
    stringWithoutDiscount: unknown | null // todo
    title: {
      full: string
      short: string
    }
    titleDative: string
    value: number
    wasLowered: boolean
  }
  images: Array<{
    [_: `${number}x${number}`]: string
  }>
  imagesCount: number
  isFavorite: boolean
  geo: {
    geoReferences: Array<{
      content: string
      colors: Array<`#${number}`> // array of hex
      after: string
    }>
    formattedAddress: string
  }
  phoneImage
  cvViewed
  isXl
  hasFooter
  contacts: {
    phone
    message
    messageTitle
    action
    onModeration
    hasCVPackage
    hasEmployeeBalanceForCv
  }
  gallery: {
    showSlider
    imagesCount
    images: number[]
    imageAlt
    extraPhoto
    isLazy
    cropImagesInfo
    image_urls: {
      [_: string]: string
    }
    image_large_urls: {
      [_: string]: string
    }
    imageUrl
    imageLargeUrl
    imageVipUrl
    imageLargeVipUrl
    hasLeadgenOverlay
    has_big_image
    noPhoto
    wideSnippetUrls: {
      [_: string]: {
        [_: `${number}x${number}`]: string
      }
    }
    preview
    alt
    isFirstImageHighImportance
  }
  loginLink
  authLink
  userLogo: {
    link
    src
    developerId
  }
  isMarketplace
  iva: {
    AutoParamsStep: unknown[] // todo
    AutoPartsManufacturerStep: unknown[] // todo
    AutoTireInfoStep: unknown[] // todo
    AutoTireManufacturerStep: unknown[] // todo
    AutotekaStep: unknown[] // todo
    BadgeBarStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        badges: Array<{
          id: number
          title: string
          style: {
            backgroundColor: {
              value: `#${number}` // hex
            }
            fontColor: {
              value: `#${number}` // hex
            }
          }
        }>
        debug: {
          id: number
          isVip: boolean
        }
      }
      default: boolean
    }>
    BadgesStep: unknown[] // todo
    DateInfoStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        absolute?: string
        debug: {
          id: number
          isVip: boolean
        }
        relative?: string
        isTooltipHidden?: boolean
        vas?: unknown[] // todo
      }
      default: boolean
    }>
    DescriptionStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        debug: {
          id: number
          isVip: boolean
        }
        description: string
        urlPath: string
      }
    }>
    DevelopmentNameStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        debug: {
          id: number
          isVip: boolean
        }
        geoForItems: {
          addressLocality: string
          formattedAddress: string
          geoReferences: Array<{
            content: string
            colors: Array<`#${number}`> // hex
            after: string
          }>
          radiusInfo: unknown | null // todo
        }
      }
      default: boolean
    }>
    FavoritesStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        debug: {
          id: number
          isVip: boolean
        }
        favorite: {
          access: {
            compare: boolean
            favorite: boolean
          }
          categorySlug: string
          fromBlock: unknown | null // todo
          fromPage: string
          id: number
          isFavorite: boolean
          rootCategoryId: number
          searchHash: string
        }
      }
      default: boolean
    }>
    FirstLineStep: unknown[]
    FourthLineStep: unknown[]
    GroupingsStep: unknown[]
    ItemNotesStep: unknown[]
    OEMStep: unknown[]
    PriceStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        debug: {
          id: number
          isVip: boolean
        }
        isHighlighted: boolean
        priceDetailed: {
          postfix: string
          string: string
          stringWithoutDiscount: unknown | null // todo
          value: number
          wasLowered: boolean
        }
      }
      default: boolean
    }>
    SecondLineStep: unknown[]
    ThirdLineStep: unknown[]
    TitleStep: Array<{
      componentData: {
        component: string
      }
      payload: {
        debug: {
          id: number
          isVip: boolean
        }
        seo: {
          title: string
        }
        title: string
        urlPath: string
      }
      default: boolean
    }>
  }
  UserInfoStep: Array<{
    componentData: {
      component: string
    }
    payload: {
      design?: string
      link?: string
      target?: string
      color: string
      value: string
    }
    default: boolean
  }>
  type: string
}
