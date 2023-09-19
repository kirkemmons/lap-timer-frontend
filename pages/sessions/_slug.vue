<template lang="pug">
  v-app
    v-main
      v-container.fluid.fill-height
        v-row.mt-5(justify="center")
          v-col.text-center(cols="8" sm="6" md="5")
            v-card.pt-5.pb-2.timer(elevation="18")
              v-card-title.justify-center.display-1 {{ time }}
              v-card-text.mt-2
                v-list
                  v-btn.mb-4.green--text(elevation="10" block @click="start") Start
                  v-btn.mb-4.blue--text(elevation="10" block @click="createLap") Lap
                  v-btn.mb-4.red--text(elevation="10" block @click="stop") Stop
                  v-btn.orange--text(elevation="10" block @click="reset") Reset
        v-row(justify="center")
          v-col(cols="9" lg="6")
            v-data-table.mt-4(:loading="isFindLapsPending" :headers="headers" :items="laps" class="elevation-18" no-data-text="No laps have been recorded")
              template(#item.time="{ item: lap }")
                span {{ formatLapTime(lap.time) }}
              template(#item.remove="{ item: lap }").blue--text
                v-btn(icon @click="removeLap(lap)")
                  v-icon(color="red" size="large") mdi-trash-can-outline
        v-row.mb-1
          v-col.text-center
            v-btn.my-4(icon dark color="black" to="/")
              v-icon.elevation-10(color="orange") mdi-crown-outline

</template>

<script>

import {} from 'vuex'
import { makeFindMixin } from 'feathers-vuex'

export default {
  mixins: [makeFindMixin({ service: 'laps', watch: true })],
  data () {
    return {
    // An array of headers for a table or grid, used in a component's template.
      headers: [
        { text: 'Lap #', align: 'left', value: 'number' },
        { text: 'Lap Time', align: 'left', value: 'time' },
        {
          text: 'Remove Lap',
          align: 'right',
          value: 'remove',
          sortable: false
        }
      ],

      // Timer-related properties:
      timerState: 'stopped', // The state of the timer (e.g., 'stopped', 'running', 'paused').
      time: '00:00:00:000', // The displayed time in HH:mm:ss:SSS format.
      ticker: undefined, // A variable possibly used to store a timer interval ID.
      hours: 0, // The hours component of the timer.
      minutes: 0, // The minutes component of the timer.
      seconds: 0, // The seconds component of the timer.
      milliseconds: 0, // The milliseconds component of the timer.
      latestLap: 0, // The timestamp of the latest lap recorded.
      totalElapsedTime: 0 // The total elapsed time in milliseconds.
    }
  },

  computed: {
    lapsParams () {
    // Return an object with a single property 'query' set to an empty object.
      return {
        query: {}
      }
    }
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
      return lapDuration.format('HH:mm:ss:SSS')
    },

    // The tick function increments the timer by 10 milliseconds and updates the time display.
    tick () {
      // Increment milliseconds by 10 milliseconds.
      this.milliseconds += 10

      // Update seconds by adding the number of seconds represented by the extra milliseconds.
      this.seconds += Math.floor(this.milliseconds / 1000)

      // Update minutes by adding the number of minutes represented by the extra seconds.
      this.minutes += Math.floor(this.seconds / 60)

      // Update hours by adding the number of hours represented by the extra minutes.
      this.hours += Math.floor(this.minutes / 60)

      // Ensure that each time component (milliseconds, seconds, minutes, hours) remains within its valid range.
      // For example, reset seconds to 0 when it reaches 60.
      this.milliseconds %= 1000
      this.seconds %= 60
      this.minutes %= 60
      this.hours %= 24 // Optionally, reset hours after 24 hours

      // Calculate the total elapsed time in milliseconds.
      this.totalElapsedTime =
      this.hours * 60 * 60 * 1000 +
      this.minutes * 60 * 1000 +
      this.seconds * 1000 +
      this.milliseconds

      // Format the time components (hours, minutes, seconds, milliseconds) into a string in HH:mm:ss:SSS format.
      const h = String(this.hours).padStart(2, '0')
      const m = String(this.minutes).padStart(2, '0')
      const s = String(this.seconds).padStart(2, '0')
      const ms = String(this.milliseconds).padStart(3, '0')

      // Set the 'time' property with the formatted time.
      this.time = `${h}:${m}:${s}:${ms}`
    },

    async createLap () {
      // Check the value of the 'timerState' variable.
      // If the timer is not in the 'running' state, exit the function early.
      if (this.timerState !== 'running') {
        return // Exit the function
      }

      // Calculate the duration of the lap time by subtracting the latest lap time (if available) from the total elapsed time.
      const lapTimeDuration = this.totalElapsedTime - (this.latestLap || 0)

      // Log the duration of the current lap time (for debugging purposes).
      console.log(lapTimeDuration)

      // Assuming 'Lap' is a model from FeathersVuex API.
      // Create a new 'Lap' object with the lap time duration as 'time'.
      const { Lap } = this.$FeathersVuex.api
      const data = { time: lapTimeDuration }
      const lap = new Lap(data)

      // Use the 'create' method (presumably an asynchronous API call) to store the lap data.
      await lap.create()

      // Update the 'latestLap' variable with the current total elapsed time.
      // This will be used as a reference for the next lap calculation.
      this.latestLap = this.totalElapsedTime
    },

    async removeLap (lap) {
      // Use the 'remove' method (presumably an asynchronous API call) to remove the specified lap record.
      await lap.remove()

      // After successfully removing the lap record, refresh the list of laps by calling 'this.findLaps' with the latest query parameters.
      await this.findLaps(this.lapsLatestQuery)
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
      this.time = '00:00:00:000'

      // Reset individual time components to their initial values.
      this.hours = 0
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
    }
  }
}

</script>

<style lang="scss">

.container {
  margin: 0 auto;
  background-color: #e0d5d5;
}

@media (min-width: 1020px) {
  .timer {
    max-width: 310px;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
