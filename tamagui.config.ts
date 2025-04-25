import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { createTamagui } from 'tamagui'

const interFont = createInterFont()

const appConfig = createTamagui({
  fonts: {
    heading: interFont,
    body: interFont,
  },
  tokens,
  themes,
  shorthands,
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig 