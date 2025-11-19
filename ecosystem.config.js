module.exports = {
  apps: [
    {
      name: "DashboardRR",
      script: "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js",
      args: "start",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3002
      }
    }
  ]
};