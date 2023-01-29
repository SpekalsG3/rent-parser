import assert from 'assert'

assert(process.env.JOB_CRONTAB_UPDATE_AND_NOTIFY, 'process.env.JOB_CRONTAB_UPDATE_AND_NOTIFY is required')
assert(process.env.JOB_IS_SINGLE_RUN, 'process.env.JOB_IS_SINGLE_RUN is required')
assert(process.env.JOB_START_IMMEDIATELY, 'process.env.JOB_START_IMMEDIATELY is required')

export const jobsConfig = <const>{
  toRunImmediately: process.env.JOB_START_IMMEDIATELY === 'true',
  isSingleRun: process.env.JOB_IS_SINGLE_RUN === 'true',
  cronTabs: {
    updateAndNotify: process.env.JOB_CRONTAB_UPDATE_AND_NOTIFY,
  },
}
