import assert from 'assert'

assert(process.env.SCRAPPER_BASE_URL, 'process.env.SCRAPPER_BASE_URL is required')
assert(process.env.SCRAPPER_API_KEY, 'process.env.SCRAPPER_API_KEY is required')

export const scrapperConfig = {
  baseURL: process.env.SCRAPPER_BASE_URL,
  apiKey: process.env.SCRAPPER_API_KEY,
} as const

export type IScrapperConfig = typeof scrapperConfig
