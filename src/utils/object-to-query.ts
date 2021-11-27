import { IMap } from '../types/general'

export function objectToQuery (object: IMap<string>): string {
  return Object.keys(object).reduce((acc, key) => {
    return `${acc}&${key}=${object[key]}`
  }, '').slice(1)
}
