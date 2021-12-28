import { CronJob } from 'cron'

import { updateAndNotify } from 'jobs/parser'

const callbacksDictionary: Record<string, boolean> = {}

function callBackRunner (id: string, f: Function): (() => void) {
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

const jobs: Array<[string, Function]> = [
  ['0 */30 * * * *', updateAndNotify], // every 30 minutes
]

export const startJobs = (params?: {
  immediately?: boolean
  singleRun?: boolean
}): void => {
  let id = 1
  for (const [interval, func] of jobs) {
    if (params.immediately) {
      func()

      if (params.singleRun) {
        continue
      }
    }

    const job = new CronJob(interval, callBackRunner(String(id++), func))
    job.start()
  }
}
