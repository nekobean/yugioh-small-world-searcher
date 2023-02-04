const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: [
        'vuetify'
    ],
    publicPath: "/apps/yugioh-small-world-searcher/",
    outputDir: "dist/apps/yugioh-small-world-searcher/"
})
