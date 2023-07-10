const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: { crypto: false },
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          icon: './icons/icon.ico'
        },
        nsis: {
            oneClick: false,
            perMachine: false,
            allowToChangeInstallationDirectory: true
        },
        mac: {
          target: "dmg",
          category: "com.webtv.application",
          icon: "./icons/icon.icns",
          artifactName: process.env.VUE_APP_CLIENTE+".${ext}"
        },
        dmg: {
          background : "./public/background.png",
          window: {
            width : 540,
            height: 380
          }
        }
      }
    }
  }
})
