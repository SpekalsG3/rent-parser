import { Client, Guild, GuildChannel, MessageEmbed } from 'discord.js'

import { IDiscordConfig } from 'configs/discord'
import { Logger } from 'libs/logger'
import { IOffer } from 'types/project'
import { INotifier } from 'adapters/notificators/types'

export class Discord implements INotifier {
  private readonly client: Client
  private readonly logger: Logger
  private readonly config: IDiscordConfig
  private readonly rooms: {
    [guildId: string]: {
      [channelName: string]: string
    }
  } = {}

  private isReady = false

  private loginResolve: () => void

  constructor (config: IDiscordConfig) {
    this.client = new Client()
    this.logger = new Logger('DISCORD-CLIENT')
    this.config = config

    this.initListeners()
  }

  public getName (): string {
    return 'Discord'
  }

  private async createChannels (guild: Guild): Promise<void> {
    let newCategory = false

    let category = guild.channels.cache.find(c => {
      return c.type === 'category' && c.name === this.config.categoryName
    })
    if (!category) {
      try {
        category = await guild.channels.create(this.config.categoryName, { type: 'category' })
      } catch (e) {
        this.logger.error(`Failed to create category ${this.config.categoryName} - ${e.message}`)
        return
      }
      newCategory = true
    }

    this.rooms[guild.id] = {}

    for (const channelName of Object.values(this.config.channelNames)) {
      let channel: GuildChannel = null
      if (!newCategory) {
        channel = guild.channels.cache.find(c => {
          return c.type === 'text' && c.parentID === category.id && c.name === channelName
        })
      }
      if (!channel) {
        try {
          channel = await guild.channels.create(this.config.channelNames.notifications, {
            type: 'text',
            parent: category.id,
          })
        } catch (e) {
          this.logger.error(`Failed to create channel ${channelName} - ${e.message}`)
          await category.delete(`Failed to create channel ${channelName}`)
          return
        }
      }

      this.rooms[guild.id][channelName] = channel.id
    }
  }

  private clearGuild (guild: Guild): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.rooms[guild.id]
  }

  private async onReady (): Promise<void> {
    for (const guild of this.client.guilds.cache.values()) {
      try {
        await this.createChannels(guild)
      } catch (e) {
        this.logger.error(`Failed to init on login for guild ${guild.id} - ${e.message}`)
        this.clearGuild(guild)
      }
    }
  }

  private initListeners (): void {
    this.client.on('ready', (): void => {
      this.logger.info(`Logged in as ${this.client.user.tag}`)

      this.loginResolve?.()
      this.isReady = true
    })

    this.client.on('error', (error: Error): void => {
      this.logger.error(`Discord.js threw error: ${error.message}`)
    })

    this.client.on('guildCreate', (guild: Guild) => {
      this.logger.info(`Added on new server '${guild.name}' (${guild.id}), owner ${guild.owner.user.tag}`)

      void this.createChannels(guild)
    })

    this.client.on('guildDelete', (guild: Guild) => {
      this.logger.info(`Deleted from server '${guild.name}' (${guild.id}), owner ${guild.owner.user.tag}`)

      this.clearGuild(guild)
    })
  }

  public async sendOffers (offers: IOffer[]): Promise<void> {
    try {
      for (const offer of offers) {
        const embedded = new MessageEmbed({
          title: offer.title,
          description: offer.description,
          url: offer.url,
          timestamp: offer.publishedAt.absolute,
          fields: [{
            name: 'Price',
            value: offer.price,
          }, {
            name: 'Location',
            value: offer.location,
          }],
          thumbnail: null,
        })
        embedded.setImage(offer.images[0])
        embedded.setAuthor('Rent Parser', null, null) // todo add icon and website url
        embedded.setFooter(offer.publishedAt.relative)

        for (const guildId of Object.keys(this.rooms)) {
          const channelId = this.rooms[guildId][this.config.channelNames.notifications]
          try {
            const channel = await this.client.channels.fetch(channelId)
            if (channel.isText()) {
              await channel.send({
                content: `${offer.id} [${offer.platform}] - ${offer.title}`,
                embed: embedded,
              })
            } else {
              throw new Error('Channel is not text')
            }
          } catch (e) {
            this.logger.error(`Failed to send offers to guild ${guildId}, ${this.config.channelNames.notifications} channel id ${channelId} - ${e.message}`)
          }
        }
      }
    } catch (e) {
      this.logger.error(`Failed to send offers - ${e.message}`)
    }
  }

  public async start (): Promise<void> {
    await this.client.login(this.config.token)

    try {
      if (!this.isReady) {
        await new Promise<void>((resolve) => {
          this.loginResolve = resolve
        })
      }

      await this.onReady()

      this.logger.info(`Discord initialized ${this.client.guilds.cache.size} guilds on start`)
    } catch (e) {
      this.logger.error(`Failed to init guilds on login - ${e.message}`)
    }
  }
}
