<template>
  <v-app dark>
    <v-toolbar app>
      <NuxtLink class="toolbar-link" to="/budgets">
        <logo />
      </NuxtLink>
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Logo from '../components/logo'

export default {
  components: {
    Logo
  }
}
</script>

<style lang="stylus">
.toolbar-link
  text-decoration none
  color white
  transition all 300ms linear

  &:hover
    color #03a9f4
</style>
