import { IBxSinglePage } from './groups/bx-single-page'

export type TVersion = `${number}.${number}.${number}`
export const TAvitoTag = '@avito'
export const TAvitoBxSinglePageGroup = 'bx-single-page'

/*
* todo:
*  - tag-core/user
*  - tag-core/ab-central
*  - tag-core/layout
*  - tag/bx-item-added-popup
* */
export interface IInitialData {
  [_: `${typeof TAvitoTag}-core/token:${TVersion}`]: {
    name: string
    value: string
  }
  [_: `${typeof TAvitoTag}-core/toggles:${TVersion}`]: {
    authorized_reviews: boolean
    autoload_global_problems_notification: boolean
    basic_profile_enabled: boolean
    fingerprint: boolean
    gtm: boolean
    is_new_restore_api: boolean
    is_new_social_auth: boolean
    is_remote_auth_enabled: boolean
    mp_feed_validator_enabled: boolean
    neonps: boolean
    order_page_enabled: boolean
    real_cpa_agency_reassignment: boolean
    recaptcha_enabled: boolean
    securedtouch: boolean
    securedtouch_test: boolean
    show_extended_profile: boolean
    show_message_button_in_profile: boolean
    spa_enabled: boolean
    tns: boolean
    weborama: boolean
    yandex: boolean
    ya_webvisor: boolean
  }
  [_: `${typeof TAvitoTag}-core/browser-info:${TVersion}`]: {
    os: string
    name: string
    version: number
    isMobile: boolean
  }
  [_: `${typeof TAvitoTag}/${typeof TAvitoBxSinglePageGroup}:${TVersion}`]: IBxSinglePage
}
