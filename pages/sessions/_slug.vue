<template lang="pug">
  v-app(style="background-color: #3D4245")
    v-main
      v-container.fluid.fill-height
        v-row(justify="center")
          v-col.text-center
            h2.session-title {{ session ? session.name : 'Loading...' }}
        v-row.mt-4(justify="center")
          v-col.text-center(cols="8" sm="6" md="5")
            v-card.px-6.pt-5.pb-2.timer(elevation="18" style="background-color: #181A1B")
              v-card-title.justify-center.display-1.white--text {{ time }}
              v-card-text.mt-2
                v-list.custom-text-color(style="background-color: #181A1B")
                  v-btn.mb-4(elevation="10" block @click="start" color="#232526") Start
                  v-btn.mb-4(elevation="10" block @click="createLap" color="#232526") Lap
                  v-btn.mb-4(elevation="10" block @click="stop" color="#232526") Stop
                  v-btn(elevation="10" block @click="reset" color="#232526") Reset
        v-row(justify="center")
          v-col(cols="9" lg="6")
            v-data-table.mt-4.mb-2.custom-data-table.custom-hover.custom-text-color(
              :headers="headers"
              :items="filteredLaps"
              class="elevation-18"
              no-data-text="No laps have been recorded"
              :server-items-length="!isFindLapsPending ? lapsLatestQuery.response.total : 0"
              :options.sync="options"
              :item-class="getRowColor"
            )
              template(#item.time="{ item: lap }")
                span {{ formatLapTime(lap.time) }}
              //- template(#item.delta="{ item: lap }")
              //-   span
              //-     | {{ lap.delta < 0 ? '-' : '' }}
              //-     | {{ formatLapTime(lap.delta) }}
              template(#item.remove="{ item: lap }")
                v-btn(icon @click="removeLap(lap)")
                  v-icon(color="white" size="large") mdi-trash-can-outline

        v-row.mt-5
          v-col.text-center
            v-btn.my-5(icon to="/sessions" v-tooltip.bottom="'Back to Sessions Page'" class="custom-tooltip")
              v-icon.elevation-10(color="orange") mdi-arrow-left

</template>

<script>

import {} from 'vuex'
import { makeFindMixin, makeGetMixin } from 'feathers-vuex'

export default {
  mixins: [makeFindMixin({ service: 'laps', watch: true }),
    makeGetMixin({ service: 'sessions', watch: true })],

  data () {
    return {
      // An array of headers for a table or grid, used in a component's template.
      headers: [
        { text: 'Lap #', align: 'left', value: 'number' },
        { text: 'Lap Time', align: 'left', value: 'time' },
        // { text: 'Delta', align: 'left', value: 'delta' },
        {
          text: 'Remove Lap',
          align: 'right',
          value: 'remove',
          sortable: false
        }
      ],

      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['number'],
        sortDesc: [false]
      },

      // Timer-related properties:
      timerState: 'stopped', // The state of the timer (e.g., 'stopped', 'running', 'paused').
      time: '00:00.000', // The displayed time in HH:mm:ss:SSS format.
      ticker: undefined, // A variable possibly used to store a timer interval ID.
      hours: 0, // The hours component of the timer.
      minutes: 0, // The minutes component of the timer.
      seconds: 0, // The seconds component of the timer.
      milliseconds: 0, // The milliseconds component of the timer.
      latestLap: 0, // The timestamp of the latest lap recorded.
      totalElapsedTime: 0
      // latestDelta: 0
    }
  },

  computed: {
    sessionId () {
      console.log(this.$route.params)
      return this.$route.params.slug
    },

    limit () {
      return this.options.itemsPerPage !== -1 ? this.options.itemsPerPage : 999
    },

    sortBy () {
      const obj = {}
      if (this.options.sortBy && this.options.sortBy.length) {
        obj[this.options.sortBy[0]] = this.options.sortDesc[0] ? -1 : 1
      }
      return obj
    },

    lapsParams () {
      // Return an object with a single property 'query' set to an empty object.
      const query = {
        sessionId: this.sessionId,
        $limit: this.limit,
        $skip: this.options.itemsPerPage * (this.options.page - 1),
        $sort: this.sortBy
      }

      if (this.search) {
        query.number = {
          $regex: this.search,
          $options: 'gi'
        }
      }

      return { query }
    },

    filteredLaps () {
      return this.laps.filter(lap => lap.sessionId === this.sessionId)
    }
  },

  async created () {
    this.session = await this.$store.dispatch('sessions/get', this.sessionId)
    await this.findLaps(this.lapsParams)
  },

  methods: {
    // The `start` function begins or resumes the timer.
    start () {
      // Check if the timer is not already running.
      if (this.timerState !== 'running') {
        if (this.timerState === 'paused') {
          // If the timer was paused, calculate the time difference
          // between the current total elapsed time and the latest lap time.
          const timeDifference = this.totalElapsedTime - this.latestLap

          // Update the latest lap time to account for the paused time.
          this.latestLap = this.totalElapsedTime - timeDifference
        } else {
          // If the timer is not paused, set the latest lap time
          // to the current total elapsed time.
          this.latestLap = this.totalElapsedTime
        }

        // Call the `startTimer` function to begin or resume the timer.
        this.startTimer()

        // Update the timer state to indicate that it is now running.
        this.timerState = 'running'
      }
    },

    startTimer () {
      this.ticker = setInterval(this.tick, 10) // Call tick every 10 milliseconds
    },

    // Define a function called formatLapTime that takes a 'time' parameter.
    formatLapTime (time) {
      // Create a duration object using a library called 'dayjs'.
      // It parses the 'time' value, which is in milliseconds, into a duration object.
      const lapDuration = this.$dayjs.duration(time, 'milliseconds')

      // Format the duration object to a specific time format: HH:mm:ss:SSS
      // 'HH' represents hours, 'mm' represents minutes, 'ss' represents seconds, and 'SSS' represents milliseconds.
      // The result will be a formatted string representing the lap time.
      return lapDuration.format('s.SSS')
    },

    // The tick function increments the timer by 10 milliseconds and updates the time display.
    tick () {
      // Increment total elapsed time by 10 milliseconds.
      this.totalElapsedTime += 10

      // Calculate time components from total elapsed time.
      const minutes = Math.floor(this.totalElapsedTime / 60000)
      const seconds = Math.floor((this.totalElapsedTime % 60000) / 1000)
      const milliseconds = this.totalElapsedTime % 1000

      // Format the time components into a string in mm:ss.SSS format.
      const m = String(minutes).padStart(2, '0')
      const s = String(seconds).padStart(2, '0')
      const ms = String(milliseconds).padStart(3, '0')

      // Set the 'time' property with the formatted time.
      this.time = `${m}:${s}.${ms}`
    },

    async createLap () {
      // Check the value of the 'timerState' variable.
      // If the timer is not in the 'running' state, exit the function early.
      if (this.timerState !== 'running') {
        return // Exit the function
      }

      const sessionId = this.sessionId

      // Calculate the duration of the lap time by subtracting the latest lap time (if available) from the total elapsed time.
      const lapTimeDuration = this.totalElapsedTime - (this.latestLap || 0)

      // Log the duration of the current lap time (for debugging purposes).
      // console.log(lapTimeDuration)

      // // Calculate the delta by subtracting the previous lap time from the current lap time, make sure to add delta to data property line.
      // const delta = lapTimeDuration - (this.previousLap || 0)

      // Assuming 'Lap' is a model from FeathersVuex API.
      // Create a new 'Lap' object with the lap time duration as 'time'.
      const { Lap } = this.$FeathersVuex.api
      const data = { time: lapTimeDuration, sessionId }
      const lap = new Lap(data)

      // Use the 'create' method (presumably an asynchronous API call) to store the lap data.
      await lap.create()

      // Update the 'previousLap' variable with the current lap time.
      // This will be used as a reference for the next lap calculation.
      this.previousLap = lapTimeDuration

      // Update the 'latestLap' variable with the current total elapsed time.
      // This will be used as a reference for the next lap calculation.
      this.latestLap = this.totalElapsedTime

      // Fetch the updated laps after creating a new lap
      await this.findLaps(this.lapsParams)
    },

    stop () {
      // Clear the timer interval by using clearInterval() and passing the interval ID (this.ticker).
      // This effectively stops the timer from ticking or updating.
      clearInterval(this.ticker)

      // Set the timer state to 'paused' to indicate that the timer has been paused.
      this.timerState = 'paused'
    },

    reset () {
      // Clear the timer interval by using window.clearInterval() and passing the interval ID (this.ticker).
      // This stops the timer from ticking.
      window.clearInterval(this.ticker)

      // Set the timer state to 'stopped' to indicate that the timer is no longer running.
      this.timerState = 'stopped'

      // Reset the displayed time to '00:00:00:000'.
      this.time = '00:00.000'

      // Reset individual time components to their initial values.
      // this.hours = 0
      this.minutes = 0
      this.seconds = 0
      this.milliseconds = 0

      // Reset the latest lap time to 0.
      this.latestLap = 0

      // Reset the total elapsed time to 0 when resetting the timer.
      this.totalElapsedTime = 0

      // Remove any lap times stored in the local storage.
      // This may be used to clear saved lap times.
      localStorage.removeItem('laps')
    },

    async removeLap (lap) {
      // Use the 'remove' method (presumably an asynchronous API call) to remove the specified lap record.
      await lap.remove()

      // After successfully removing the lap record, refresh the list of laps by calling 'this.findLaps' with the latest query parameters.
      await this.findLaps(this.lapsLatestQuery)
      console.log(this.lapsLatestQuery)
    },

    getRowColor (item) {
      if (item.time === undefined) {
        return '' // Default class if time is undefined
      }

      const fastestLapTime = Math.min(
        ...this.laps.filter(lap => lap.sessionId === this.sessionId).map(lap => lap.time)
      )
      const slowestLapTime = Math.max(
        ...this.laps.filter(lap => lap.sessionId === this.sessionId).map(lap => lap.time)
      )

      if (item.time === fastestLapTime) {
        return 'green-row'
      } else if (item.time === slowestLapTime) {
        return 'red-row'
      } else {
        return ''
      }
    }
  }
}

</script>

<style lang="scss">

.container {
  margin: 0 auto;
  background-color: #3D4245;
}

@media (min-width: 1020px) {
  .timer {
    max-width: 310px;
    margin-left: auto;
    margin-right: auto;
  }
}

.green-row {
  background-color: #13331F
}

.red-row {
  background-color: #3C0C10
}

.custom-tooltip {
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.session-title {
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.custom-data-table {
  background-color: #181A1B !important;
}

// Added custom text color styles
.custom-text-color {
  color: #959494;
}

.custom-text-color * {
  color: #959494;
}

.custom-hover .v-data-table__wrapper tbody tr:hover {
  background-color: #2A2C2D !important; // Disable hover effect
  // background-color: #yourColor !important; // Set a new hover color
}

</style>
