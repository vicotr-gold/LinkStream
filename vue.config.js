'use strict'

const path = require('path')

module.exports = {
    lintOnSave: true,
    filenameHashing: true,
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                '~': path.resolve('src'),
                '@': path.resolve('src'),
                jquery: 'jquery/dist/jquery.slim.js',
            },
        },
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.transformAssetUrls = {
                    video: ['src', 'poster'],
                    source: 'src',
                    img: 'src',
                    image: 'xlink:href',
                    'b-avatar': 'src',
                    'b-img': 'src',
                    'b-img-lazy': ['src', 'blank-src'],
                    'b-card': 'img-src',
                    'b-card-img': 'src',
                    'b-card-img-lazy': ['src', 'blank-src'],
                    'b-carousel-slide': 'img-src',
                    'b-embed': 'src',
                }
                return options
            })

        // config.resolve.extensions
        //     .add('.js')
        //     .add('.vue')
        //     .add('.json')

        // config.resolve.alias
        //     .set('vue$', 'vue/dist/vue.esm.js')
        //     .set('@', resolve('src'))
        //     .set('~', resolve('src'))
        //     .set('jquery', 'jquery/dist/jquery.slim.js')
    },
    css: {
        loaderOptions: {
            sass: {
                // prependData: `
                //     @import "~@/assets/scss/variables";
                //     @import "~@/assets/scss/mixins";
                // `,
            },
        },
    },
}
