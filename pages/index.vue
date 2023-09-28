<template lang="pug">
  v-app
    v-main
      v-container.fluid.fill-height
        v-layout.align-center.justify-center
          h2 Start a New Session
            v-form(@submit.prevent="createSession")
              v-text-field(
                v-model="sessionName"
                label="Session Name"
                required
              )
              v-btn(
                color="blue"
                type="submit"
                :disabled="!sessionName"
              ) New Session

</template>

<script>

import { } from 'vuex'

export default {
  data () {
    return {
      sessionName: ''
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
  margin: 0 auto;
  background-color: #e0d5d5;
}

</style>
