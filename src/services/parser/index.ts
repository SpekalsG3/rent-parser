import * as fs from 'fs'

import { IOffer, ISettings } from 'types/project'
import { IRentParserConfig } from 'configs/rent-parser'
import { discordConfig } from 'configs/discord'
import { avitoConfig, AvitoFilterMarkers, AvitoServices, EAvitoCities, EAvitoMetroIds } from 'configs/avito'
import { INotifier } from 'adapters/notificators/types'
import { IPlatformParser } from 'adapters/rent-platforms/types'
import { Discord } from 'adapters/notificators/discord'
import { AvitoAdapter } from 'adapters/rent-platforms/avito'
import { Logger } from 'libs/logger'
import { toIsoString } from 'utils/date-to-iso-string'
import { scrapperConfig } from 'configs/scrapper'

export class RentParser {
  private readonly logger = new Logger('RENT-PARSER')
  private readonly platformParsers: IPlatformParser[]
  private readonly notifiers: INotifier[]
  private isReady = false
  private readonly parserSettingsPath: string
  private settings: ISettings
  private readonly config: IRentParserConfig

  constructor (config: IRentParserConfig) {
    this.config = config
    this.parserSettingsPath = `${process.cwd()}/${config.settingsPath}`

    this.platformParsers = [
      new AvitoAdapter(avitoConfig, scrapperConfig),
    ]

    this.notifiers = [
      new Discord(discordConfig),
    ]
  }

  async start (): Promise<void> {
    for (const notifier of this.notifiers) {
      await notifier.start()
    }

    const settings = fs.existsSync(this.parserSettingsPath) && fs.readFileSync(this.parserSettingsPath, { encoding: 'utf8' })
    if (settings) {
      this.settings = JSON.parse(settings)
    } else {
      this.settings = {
        updatedAt: null,
        parsedOfferUrls: {},
      }

      for (const platform of this.platformParsers) {
        this.settings.parsedOfferUrls[platform.getName()] = []
      }
    }

    this.isReady = true
  }

  async updateAndNotify (): Promise<void> {
    if (!this.isReady) {
      await this.start()
    }

    if (!this.settings) {
      throw new Error('Cannot start without parser settings')
    }

    let newOffers: IOffer[] = []

    for (const platform of this.platformParsers) {
      try {
        this.logger.info(`Getting offer from ${platform.getName()}...`)

        const platformOffers = await platform.getActiveOffers({ // make dynamic
          maxDistanceInMeters: 1600,
          metro: [EAvitoMetroIds.blueBranch, EAvitoMetroIds.parnas],
          city: EAvitoCities.spb,
          service: AvitoServices.apartment,
          filter: {
            amount: {
              to: 25000,
            },
            houseType: {
              brick: true,
              block: true,
              monolith: true,
            },
            owner: AvitoFilterMarkers.owner.all,
            rooms: {
              one: true,
              two: true,
            },
          },
        })

        let newPlatformOffers: IOffer[] = []

        if (!this.config.disableSettings) {
          for (const offer of platformOffers) {
            if (!this.settings.parsedOfferUrls[platform.getName()].includes(offer.url)) {
              this.settings.parsedOfferUrls[platform.getName()].push(offer.url)

              newPlatformOffers.push(offer)
            }
          }
        } else {
          newPlatformOffers = platformOffers
        }

        newOffers = newOffers.concat(newPlatformOffers)
      } catch (e) {
        this.logger.error(`Failed to get new offers from ${platform.getName()} - ${e.message}`)
      }
    }

    this.logger.info(`Got ${newOffers.length} new rent offers`)

    if (!this.config.disableSettings) {
      this.settings.updatedAt = toIsoString(new Date())
      fs.writeFileSync(this.parserSettingsPath, JSON.stringify(this.settings))

      this.logger.info('Updated settings')
    }

    this.logger.info('Broadcasting...')
    let notifiersDone = 0
    for (const notifier of this.notifiers) {
      try {
        await notifier.sendOffers(newOffers)
        notifiersDone += 1
      } catch (e) {
        this.logger.error(`Failed to send new offers to ${notifier.getName()} - ${e.message}`)
      }
    }

    this.logger.info(`Job done. Sent ${newOffers.length} new offers by ${notifiersDone} notifiers`)
  }
}
