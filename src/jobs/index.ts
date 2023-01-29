import { CronJob } from 'cron'
import { updateAndNotify } from 'jobs/parser'
import { jobsConfig } from 'configs/jobs'

import { Logger } from '../libs/logger'

const callbacksDictionary: Record<string, boolean> = {}
const logger = new Logger('Jobs')

function callBackRunner (id: string, f: Function): (() => void) {
  if (Object.keys(callbacksDictionary).includes(id)) {
    throw new Error(`Id ${id} already exists in callbacksDictionary`)
  }
  callbacksDictionary[id] = false

  return async () => {
    if (callbacksDictionary[id]) {
      logger.info(`Job ${id} is already running, aborting...`)
      return
    }
    callbacksDictionary[id] = true

    await f()

    callbacksDictionary[id] = false
  }
}

export const startJobs = (): void => {
  const jobs: Array<[string, Function]> = [
    [jobsConfig.cronTabs.updateAndNotify, updateAndNotify], // every 30 minutes
  ]

  let id = 1
  for (const [interval, func] of jobs) {
    if (jobsConfig.toRunImmediately) {
      func()

      if (jobsConfig.isSingleRun) {
        continue
      }
    }

    const job = new CronJob(interval, callBackRunner(String(id++), func))
    job.start()
  }
}
