<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ post.title.rendered }}
      </h1>
      <span v-html="post.content.rendered"></span>
    </div>
  </section>
</template>

<script>
export default {
  name: '_id.vue',
  data() {
    return {
      post: {},
      error: []
    }
  },
  asyncData({ payload }) {
    return { post: payload }
  }
}
</script>

<style scoped></style>
