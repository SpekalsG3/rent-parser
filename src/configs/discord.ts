import assert from 'assert'

assert(process.env.DISCORD_TOKEN, 'process.env.DISCORD_TOKEN is required')
assert(process.env.DISCORD_APPLICATION_ID, 'process.env.DISCORD_APPLICATION_ID is required')
assert(process.env.DISCORD_CATEGORY_NAME, 'process.env.DISCORD_CATEGORY_NAME is required')
assert(process.env.DISCORD_CHANNEL_NAMES_NOTIFICATIONS, 'process.env.DISCORD_CHANNEL_NAMES_NOTIFICATIONS is required')

export const discordConfig = {
  token: process.env.DISCORD_TOKEN,
  applicationId: process.env.DISCORD_APPLICATION_ID,
  categoryName: process.env.DISCORD_CATEGORY_NAME,
  channelNames: {
    notifications: process.env.DISCORD_CHANNEL_NAMES_NOTIFICATIONS,
  },
} as const

export type IDiscordConfig = typeof discordConfig
