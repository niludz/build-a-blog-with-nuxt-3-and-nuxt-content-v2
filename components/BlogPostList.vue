<script setup>
const { data: blogPostList } = useAsyncData('bolgPostList', () => {
  // const temp = 
  return queryContent('/blog').sort({ 'dates.published': -1 }).find()
  // return temp.sort((a, b) => a.dates.published - b.dates.published)
})
// const blogPostList =computed(() => {
//   return data.sort((a, b) => DataTransfer.parse(a.dates.published) - b.dates.published)
// })

</script>

<template>
  <div class="container">
    <section class="articles">
      <div class="column is-10 is-offset-1">
        <div v-for="blogPost in blogPostList" :key="blogPost._path" class="card article  ">
          <NuxtLink :to="blogPost._path">
            <!-- <section class="blog-post-card card article has-background image-resize "
              style="background: url('${blogPost.picture}') no-repeat right top; background-size: auto 100%;"> -->
            <section class="blog-post-card card article has-background image-resize"
              :style="`background: url('${blogPost.picture}') no-repeat right top; background-size: auto 100%;`">
              <!-- <pre> {{ blogPost }}</pre> -->
              <div class="media ">
                <div class="media-content has-text-centered">
                  <h3 class="title article-title has-text-weight-bold">
                    {{ blogPost.title }}
                  </h3>
                  <BlogPostMeta :author="blogPost.author" :date="blogPost.dates.published" />
                </div>
              </div>
              <div class="card-content">
                <div class="content article-body is-size-5">
                  {{ blogPost.description }}
                </div>
              </div>

            </section>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.blog-post-card {
  padding-top: 2.5rem;
  padding-bottom: 3rem;
}

.blog-post-card .card-content {
  padding: 1rem;
}

.blog-post-card .title {
  margin-bottom: 1rem;
}


.image-resize {
  transition: transform 0.3s ease;
}

.image-resize:hover {
  transform: scale(1.1);
}
</style>
