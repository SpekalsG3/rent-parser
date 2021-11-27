export interface ICategoryTreeItem {
  id: number
  mcId: number
  name: string
  url: string
  current: boolean
  currentParent: boolean
  opened: boolean
  level: number
  categoryId: number
  params: object // todo unknown
  count: number
  shortListMaxLength: unknown | null // todo
  shortListCollapsedLength: unknown | null // todo
  longListMaxLength: unknown | null // todo
  longListCollapsedLength: unknown | null // todo
  iconUrl: string
  customUrl: unknown | null // todo
  developerId: unknown | null // todo
  shield: unknown | null // todo
  nofollow: boolean
  subs: ICategoryTreeItem[]
}
