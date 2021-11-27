import { IScrapperConfig } from 'configs/scrapper'
import axios, { AxiosInstance } from 'axios'

export class Scrapper {
  private readonly config: IScrapperConfig
  private readonly api: AxiosInstance

  constructor (config: IScrapperConfig) {
    this.config = config
    this.api = axios.create({
      baseURL: config.baseURL,
    })
  }

  public async get<TResponse = unknown> (url: string): Promise<TResponse> {
    const { data } = await this.api.get<TResponse>(`?api_key=${this.config.apiKey}&url=${url}`)
    return data
  }
}
