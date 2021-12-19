import { CronJob } from 'cron'

import { updateAndNotify } from 'jobs/parser'

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

const jobs = [
  new CronJob('0 */30 * * * *', callBackRunner('1', updateAndNotify)), // every 30 minutes
]

export const startJobs = (): void => {
  void updateAndNotify()
  for (const job of jobs) {
    job.start()
  }
}
