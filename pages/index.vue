<template lang="pug">

  v-app(style="background-color: #666666")
    v-navigation-drawer(v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app style="background-color: #8c8c8c")
      v-list
        v-list-item(v-for="(item, i) in items" :key="i" :to="item.to" router exact)
          v-list-item-action
            v-icon.white--text {{ item.icon }}
          v-list-item-content
            v-list-item-title.white--text {{ item.title }}
    v-app-bar(:clipped-left="clipped" fixed app style="background-color: #272727")
      v-app-bar-nav-icon.ml-2.white--text(@click.stop="drawer = !drawer")
      v-btn.mx-1(icon @click.stop="miniVariant = !miniVariant")
        v-icon.white--text mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}
      v-spacer
      v-btn.mx-1(icon href="https://github.com/kirkemmons" target="_blank")
        v-icon(color="orange") mdi-crown-outline

    v-main
      v-container.fluid.fill-height
        v-layout.align-center.justify-center
          h2 Start a New Session
            v-form(@submit.prevent="createSession")
              v-text-field(
                color="orange"
                v-model="sessionName"
                label="Session Name"
                required
              )
              v-btn(
                color="orange"
                type="submit"
                :disabled="!sessionName"
              ) New Session

      v-footer(style="background-color: #272727" app)
        span.white--text &copy; #{new Date().getFullYear()}

</template>

<script>

import { } from 'vuex'

export default {
  data () {
    return {
      sessionName: '',
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-clock',
          title: 'Lap Timer',
          to: '/'
        },
        {
          icon: 'mdi-timelapse',
          title: 'Sessions',
          to: '/sessions'
        }
      ],
      miniVariant: false,
      right: true

    }
  },

  computed: {

  },

  methods: {

    async createSession () {
      try {
        if (!this.sessionName) {
          alert('Please enter a session name.')
          return
        }
        // Assuming 'sessions' is the service for creating sessions
        const { Session } = this.$FeathersVuex.api
        console.log(Session)
        const data = { name: this.sessionName }
        console.log(data)
        // console.log('Creating a new session with name:', this.sessionName)
        // console.log(data)
        const session = new Session(data)
        // console.log(session)

        // Use the 'create' method (presumably an asynchronous API call) to store the session data.
        const createdSession = await session.create()
        // console.log(createdSession)

        // Navigate to the laptime slug page for the created session
        this.$router.push(`/sessions/${createdSession._id}`)

        // console.log('Session created successfully!')
      } catch (error) {
        console.error('Error creating session:', error)
      }
    }
  }
}

</script>

<style lang="scss">

.container {
  background-color: #8c8c8c;
  max-height: fit-content;
}

</style>
