module.exports = {
  apps : [{
    name:"discord-bot",
    script: "./dist/index.js",
    node_args: "--env-file=./production.env",
    instance: 1,
    cron_restart: "0 3 * * *",
    merge_logs: true,
  }],
  deploy : {
    production : {
      "user" : "root",
      "host" : "172.252.236.248",
      "key"  : "./keys/id_rsa.pem",   
      "ref"  : "origin/main",
      "repo" : "git@github.com:Horus-Turboss-Finance/discord-bot.git",
      "path" : "~/cashsight/bot",
      "pre-deploy": `npm install && npm run production:d:bot`,
      "post-deploy": `npm run production`,
    }
  }
}