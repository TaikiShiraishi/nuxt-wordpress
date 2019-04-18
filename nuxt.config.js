import path from 'path'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import axios from 'axios'
import pkg from './package'

const apiUrl = 'http://necotiblog.wp.xdomain.jp'

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/vuetify', '~/plugins/axios'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy: {
    '/api': 'http://necotiblog.wp.xdomain.jp'
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  generate: {
    interval: 1000,
    routes() {
      return Promise.all([
        axios({
          method: 'get',
          url: `${apiUrl}/wp-json/wp/v2/posts`,
          params: {
            per_page: 100,
            page: 1,
            _embed: 1
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }),
        axios({
          method: 'get',
          url: `${apiUrl}/wp-json/wp/v2/pages`,
          params: {
            per_page: 100,
            page: 1,
            _embed: 1
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        // axios.get(`${apiUrl}/wp-json/wp/v2/posts?per_page=100&page=1&_embed=1`),
        // axios.get(`${apiUrl}/wp-json/wp/v2/pages?per_page=100&page=1&_embed=1`)
      ]).then(
        data => {
          const posts = data[0]
          const pages = data[1]
          console.log(posts)
          return posts.data
            .map(post => {
              return {
                route: '/posts/' + post.id,
                payload: post
              }
            })
            .concat(
              pages.data.map(page => {
                return {
                  route: '' + page.id,
                  payload: page
                }
              })
            )
        },
        err => console.log('nuxt.config.js fetch error:' + err)
      )
    }
  },
  env: {
    dev: process.env.NODE_ENV
  },
  resolve: {
    extensions: ['.js', '.json', '.vue', '.ts'],
    root: path.resolve(__dirname),
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname)
    }
  }
}
