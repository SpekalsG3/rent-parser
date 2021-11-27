import assert from 'assert'

assert(process.env.RENT_PARSER_SETTINGS_PATH, 'process.env.RENT_PARSER_SETTINGS_PATH is required')

export const rentParserConfig = {
  disableSettings: process.env.RENT_PARSER_DISABLE_SETTINGS === 'true',
  settingsPath: process.env.RENT_PARSER_SETTINGS_PATH,
} as const

export type IRentParserConfig = typeof rentParserConfig
