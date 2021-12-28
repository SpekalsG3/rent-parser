import 'dotenv/config'
import { startJobs } from 'jobs/index'

startJobs({
  immediately: true,
  singleRun: true,
})

console.log('Jobs started')
