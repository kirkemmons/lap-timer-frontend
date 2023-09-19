<template lang="pug">
  v-app
    v-main
      v-container.fluid.fill-height
        v-layout.align-center.justify-center
          h2 Start a New Session
            v-form
              v-text-field(
                v-model="sessionName"
                label="Session Name"
                required
              )
              v-btn(
                color="blue"
                @click="createSession"
              ) New Session

</template>

<script>

export default {
  data () {
    return {
      sessionName: '' // Initialize sessionName as a data property
    }
  },

  methods: {

    async createSession () {
      try {
      // Assuming 'sessions' is the service for creating sessions
        const { Session } = this.$FeathersVuex.api
        const data = { name: this.sessionName }
        console.log(data)
        const session = new Session(data)
        console.log(session)

        const sessionId = session._id
        // Navigate to the laptime slug page for the created session
        this.$router.push(`/sessions/${sessionId}`)

        // Use the 'create' method (presumably an asynchronous API call) to store the session data.
        await session.create()

        console.log('Session created successfully!')
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
