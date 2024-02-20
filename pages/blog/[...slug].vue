<script setup>
const { path } = useRoute()
const { data: bolgPost } = await useAsyncData(`content-${path}`, () => {
    return queryContent().where({ _path: path }).findOne()
})
</script>

<template>
    <main>
        <TheHero>
            <template v-slot:default>
                {{ bolgPost.title }}
            </template>

            <template v-slot:subtitle>
                <BlogPostMeta :author="bolgPost.author" :date="bolgPost.dates.published" color="dark" />
            </template>
        </TheHero>
        <div class="container">
            <section class="articles">
                <div class="column is-8 is-offset-2">
                    <section class="blog-post-card card article">
                        <div class="card-content">
                            <div class="content article-body is-size-5">
                                <ContentDoc />
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    </main>
</template>