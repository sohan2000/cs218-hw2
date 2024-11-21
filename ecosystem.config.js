module.exports = {
  apps: [{
    name: "system-monitor-api",
    script: "./server.js",
    env: {
      NODE_ENV: "production",
    },
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    watch: true,
    ignore_watch: ["node_modules", "logs"],
    max_memory_restart: "1G",
    exec_mode: "cluster",
    instances: "max"
  }]
}