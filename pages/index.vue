<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-list two-line>
          <template v-for="(post, index) in posts">
            <v-list-tile
              :key="'news' + index"
              ripple
              :href="'/posts/' + post.id"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ post.title.rendered }}</v-list-tile-title>
                <v-list-tile-sub-title
                  v-html="post.content.rendered"
                ></v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-list-tile-action-text>{{
                  post.date
                }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < posts.length" :key="index"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      posts: {}
    }
  },
  asyncData({ $axios }) {
    const apiUrl = 'http://necotiblog.wp.xdomain.jp'
    return Promise.all([
      $axios({
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
      })
    ]).then(
      data => {
        const posts = data[0]
          .filter(post => post.categories.indexOf(2) >= 0)
          .map(post => {
            const date = new Date(post.date)
            post.date = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`
            return post
          })
        return { posts }
      },
      err => console.log('index promise error' + err)
    )
  }
}
</script>
