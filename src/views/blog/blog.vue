<template>
  <div class="blog">
    <transition name="slide-x-transition" mode="out-in">
      <div v-if="blogInfo.length > 0">
        <card v-for="item in blogInfo" :key="item.id" :class="{'card-item-mobile':$store.state.app.isMobile}" :article="item" class="card-item"></card>
      </div>
    </transition>
    <loading :show-loading="showLoading" style="margin-top: 20px"></loading>
    <observer @intersect="observerIntersect"></observer>
  </div>
</template>
<script>
import card from 'components/card/card.vue'
import loading from 'components/loading/loading.vue'
import Observer from 'components/Observer/Observer.vue'

export default {
  components: {
    'card': card,
    'loading': loading,
    'observer': Observer
  },
  props: {
    id: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      blogInfo: [],
      blogInfoIDs: [],
      showLoading: false,
      limt: 10, // 每页数据量
      currentPage: 0, // 当前页
      totalCount: 0, // 数据总数
      sharedState: this.$store.state
    }
  },
  methods: {
    async loadBlogInfo() {
      if (this.showLoading) return
      try {
        this.showLoading = true
        if (this.id === undefined) {
          await this.loadBlogWithPage()
        } else {
          if (this.blogInfoIDs.length === 0) {
            await this.loadBlogInfoIDs()
            if (this.blogInfoIDs.length !== 0) {
              this.totalCount = this.blogInfoIDs.length
              await this.loadBlogWithID()
            }
          } else {
            await this.loadBlogWithID()
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.showLoading = false
      }
    },
    async loadBlogWithPage() {
      try {
        const response = await this.$api.getBlogInfosByPage(this.limt, this.currentPage)
        this.totalCount = parseInt(response.headers['x-total-count'])
        if (response.data.length > 0) {
          this.currentPage++
          this.blogInfo = this.blogInfo.concat(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async loadBlogWithID() {
      const blogInfoIDs = this.blogInfoIDs.slice(this.currentPage * this.limt, (this.currentPage + 1) * this.limt)
      if (blogInfoIDs.length === 0) return
      try {
        const response = await this.$api.getBlogInfosByIDs(blogInfoIDs)
        if (response.data.length > 0) {
          this.currentPage++
          this.blogInfo = this.blogInfo.concat(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async loadBlogInfoIDs() {
      try {
        const response = await this.$api.getTag(this.id)
        document.title = response.data.tagName
        if (response.data.tagImg !== undefined) {
          if (this.$store.state.app.isMobile) {
            this.$store.commit('setHeadBgUrl', (response.data.tagImg.medium))
          } else {
            this.$store.commit('setHeadBgUrl', (response.data.tagImg.large))
          }
        }
        this.blogInfoIDs = response.data.blogInfoIDs
      } catch (error) {
        console.error(error)
      }
    },
    observerIntersect() {
      this.loadBlogInfo()
    }
  }
}
</script>
<style scoped>
.card-item {
    margin-bottom: 25px;
}

.card-item-mobile {
    margin-top: 25px;
    margin-left: 25px;
    margin-right: 25px;
}
</style>
