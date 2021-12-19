import 'dotenv/config'
import { CronJob } from 'cron'

import { RentParser } from 'services/parser'
import { rentParserConfig } from 'configs/rent-parser'

const callbacksDictionary: Record<string, boolean> = {}

function callBackRunner (id: string, f: Function): Function {
  if (Object.keys(callbacksDictionary).includes(id)) {
    throw new Error(`Id ${id} already exists in callbacksDictionary`)
  }
  callbacksDictionary[id] = false

  return async () => {
    if (callbacksDictionary[id]) {
      return
    }
    callbacksDictionary[id] = true

    await f()

    callbacksDictionary[id] = false
  }
}

const rentParser = new RentParser(rentParserConfig)

const updateAndNotifyJob = new CronJob('0 */30 * * * *', callBackRunner('1', async () => rentParser.updateAndNotify())) // every 30 minutes
updateAndNotifyJob.start()

console.log('Jobs started')
