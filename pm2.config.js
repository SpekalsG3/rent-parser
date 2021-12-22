module.exports = {
  apps: [{
    name: 'rent-parser-core',
    cwd: __dirname,
    script: 'npm run start',
    watch: false,
    max_memory_restart: '1G',
    merge_logs: true,
    log_type: 'json',
  }],
}
