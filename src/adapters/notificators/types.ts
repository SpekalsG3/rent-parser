import { IOffer } from 'types/project'

export interface INotifier {
  getName: () => string
  sendOffers: (offers: IOffer[]) => Promise<void>
  start: () => Promise<void>
}
