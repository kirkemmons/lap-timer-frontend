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
          //- v-row.justify-center
          //-   v-col(
          //-     cols="12"
          //-     md="6"
          //-   )
          //-     h2 Start a New Session
          //-       v-form(@submit.prevent="createSession")
          //-         v-text-field(
          //-           color="orange"
          //-           v-model="sessionName"
          //-           label="Session Name"
          //-           required
          //-         )
          //-         v-btn(
          //-           color="orange"
          //-           type="submit"
          //-           :disabled="!sessionName"
          //-         ) New Session

          v-row.justify-center
            v-col(
              cols="12"
              md="6"
            )
              h2 Create a new Car
                v-form(@submit.prevent="createCar")
                  v-text-field(
                    color="blue"
                    v-model="carName"
                    label="Car Name"
                    required
                  )
                  v-btn(
                    color="blue"
                    type="submit"
                    :disabled="!carName"
                  ) New Car

          .text-center.pa-5
            .text-h6.mb-4 Start a New Session
            v-btn.mb-6(
              depressed
              color="primary"
              @click="isAddSessionOpen = true"
              width="220"
            )
              v-icon(left) mdi-plus
              | Add Session

        AddSession(
          v-if="isAddSessionOpen"
          @input="isAddSessionOpen = false"
          @session-created="handleSessionCreated"
          :value="isAddSessionOpen"
        )

      v-footer(style="background-color: #272727" app)
        span(class).white--text &copy; #{new Date().getFullYear()}

</template>

<script>

import { } from 'vuex'
import AddSession from '../components/AddSession.vue'

export default {
  components: {
    AddSession
  },
  data () {
    return {
      sessionName: '',
      carName: '',
      isAddSessionOpen: false,
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

    handleSessionCreated (session) {
    // Handle the created session, if needed
      console.log('New session created:', session)
    },

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
        console.log('Creating a new session with name:', this.sessionName)
        console.log(data)
        const session = new Session(data)
        console.log(session)

        // Use the 'create' method (presumably an asynchronous API call) to store the session data.
        const createdSession = await session.create()
        console.log(createdSession)

        // Navigate to the laptime slug page for the created session
        this.$router.push(`/sessions/${createdSession._id}`)

        // console.log('Session created successfully!')
      } catch (error) {
        console.error('Error creating session:', error)
      }
    },

    async createCar () {
      try {
        if (!this.carName) {
          alert('Please enter a car name.')
          return
        }
        // Assuming 'cars' is the service for creating cars
        const { Car } = this.$FeathersVuex.api
        console.log(Car)
        const data = { name: this.carName }
        console.log(data)
        console.log('Creating a new car with name:', this.carName)
        console.log(data)
        const car = new Car(data)
        console.log(car)

        // Use the 'create' method (presumably an asynchronous API call) to store the car data.
        const createdCar = await car.create()
        console.log(createdCar)

        // Navigate to the laptime slug page for the created car
        this.$router.push(`/cars/${createdCar._id}`)

        // console.log('Session created successfully!')
      } catch (error) {
        console.error('Error creating car:', error)
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
