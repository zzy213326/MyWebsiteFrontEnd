<template>
  <div v-if="article">
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" :to="'/blog/'+article.blogID">
        <v-img :src="article.bgImg.large?article.bgImg.large:''" class="white--text" height="250px">
          <v-container fill-height fluid ma-0 pa-0>
            <v-layout ma-0 pa-0>
              <v-flex xs12 flexbox class="white--text" pa-3 style="background: rgba(0,0,0,.2);margin-top: auto;">
                <div class="headline">
                  {{ article.title }}
                </div>
                <v-divider class="my-2" color="#fff"></v-divider>
                <div class="subheading">
                  {{ article.summary }}
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-text class="grey--text">
          <span class="body-1"><v-icon size="18px">{{ $vuetify.icons['calendar'] }}</v-icon>{{ articleTime }}</span>&nbsp;&nbsp;
          <span class="body-1"><v-icon size="18px">{{ $vuetify.icons['file-word'] }}</v-icon><span>{{ article.words }}</span></span>&nbsp;&nbsp;
          <span class="body-1"><v-icon size="18px">{{ $vuetify.icons['eye'] }}</v-icon><span>{{ article.views }}</span></span>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
</template>
<script>

export default {
  props: {
    article: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    articleTime: function() {
      if (!isNaN(Date.parse(this.article.time))) {
        return this.$utils.FormatTime(new Date(this.article.time), 'yyyy-MM-dd')
      }
      return this.article.time
    }
  }
}
</script>
<style scoped>
</style>
