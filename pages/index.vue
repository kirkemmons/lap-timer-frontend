<template lang="pug">

  v-container
    v-row.mt-5(
      justify="center"
    )
      v-col.text-center(
        cols="8"
        sm="6"
        md="5"
      )
        v-card.pt-5.pb-2.timer(
          elevation="18"
        )
          v-card-title.justify-center.display-1(
          ) {{ time }}

            v-card-text.mt-2
              v-list
                v-btn.mb-4(
                  color="green"
                  elevation="10"
                  text
                  block
                  @click="start"
                ) Start
                v-btn.mb-4(
                  color="blue"
                  elevation="10"
                  text
                  block
                  @click="createLap"
                ) Lap
                v-btn.black--text.mb-4(
                  color="red"
                  elevation="10"
                  text
                  block
                  @click="stop"
                ) Stop
                v-btn.black--text(
                  color="orange"
                  elevation="10"
                  text
                  block
                  @click="reset"
                ) Reset

    v-row(
      justify="center"
    )
      v-col(
        cols="9"
        lg="6"
      )
        v-data-table.mt-4(
          :loading="isFindLapsPending"
          :headers="headers"
          :items="laps"
          class="elevation-18"
          no-data-text="No laps have been recorded"
        )
          template(#item.time="{ item: lap }")
            span {{ formatLapTime(lap.time) }}
          template(#item.remove="{ item: lap }")
            v-btn(
              icon
              elevation="12"
              @click="removeLap(lap)"
            )
              v-icon(
                color="red"
                size="large"
              ) mdi-trash-can-outline

    v-row.mb-1(
    )
      v-col.text-center(
      )
        v-btn.my-4(
          icon
          dark
          color="black"
          href="https://github.com/kirkemmons" target="_blank"
        )
          v-icon(
            color="orange"
          ) mdi-crown-outline

</template>

<script>

import {} from 'vuex'
import { makeFindMixin } from 'feathers-vuex'

export default {
  mixins: [makeFindMixin({ service: 'laps', watch: true })],
  data () {
    return {
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
      timerState: 'stopped',
      time: '00:00:00:000',
      ticker: undefined,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      latestLap: 0,
      totalElapsedTime: 0

    }
  },

  computed: {
    lapsParams () {
      return {
        query: {}
      }
    }
  },

  methods: {
    // The start function starts the timer by calling the tick function if it is not already running.

    start () {
      if (this.timerState !== 'running') {
        if (this.timerState === 'paused') {
          // Calculate the time difference between the current total elapsed time and the latest lap time
          const timeDifference = this.totalElapsedTime - this.latestLap

          // Update the latest lap time to the current total elapsed time minus the time difference
          this.latestLap = this.totalElapsedTime - timeDifference
        } else {
          // If the timer is not paused, set the latest lap time to the current total elapsed time
          this.latestLap = this.totalElapsedTime
        }
        this.startTimer() // Call startTimer to initiate the timer
        this.timerState = 'running'
      }
    },

    startTimer () {
      this.ticker = setInterval(this.tick, 10) // Call tick every 10 milliseconds
    },

    formatLapTime (time) {
      const lapDuration = this.$dayjs.duration(time, 'milliseconds')
      return lapDuration.format('HH:mm:ss:SSS')
    },

    // The tick function increments the currentTimer variable by 1 every 10 milliseconds and updates the time variable with the current time in the HH:mm:ss format using the formatTime function.
    tick () {
      this.milliseconds += 10
      this.seconds += Math.floor(this.milliseconds / 1000)
      this.minutes += Math.floor(this.seconds / 60)
      this.hours += Math.floor(this.minutes / 60)

      this.milliseconds %= 1000
      this.seconds %= 60
      this.minutes %= 60
      this.hours %= 24 // Optionally, reset hours after 24 hours

      this.totalElapsedTime = this.hours * 60 * 60 * 1000 + this.minutes * 60 * 1000 + this.seconds * 1000 + this.milliseconds

      const h = String(this.hours).padStart(2, '0')
      const m = String(this.minutes).padStart(2, '0')
      const s = String(this.seconds).padStart(2, '0')
      const ms = String(this.milliseconds).padStart(3, '0')

      this.time = `${h}:${m}:${s}:${ms}`
    },

    async createLap () {
      // This lap function first checks the value of the timerState variable. If the timerState is not running, the function immediately returns without executing the rest of the code.
      if (this.timerState !== 'running') {
        return
      }

      const lapTimeDuration = this.totalElapsedTime - (this.latestLap || 0)

      console.log(lapTimeDuration)

      const { Lap } = this.$FeathersVuex.api
      const data = { time: lapTimeDuration }

      const lap = new Lap(data)

      await lap.create()

      this.latestLap = this.totalElapsedTime
    },

    async fetchLaps () {
      try {
        const { Lap } = this.$FeathersVuex.api

        // Fetch the updated list of laps using the Feathers API
        const laps = await Lap.find()
        console.log(laps)
      } catch (error) {
        console.error('Error fetching laps:', error)
      }
    },

    async removeLap (lap) {
      // console.log(lap)
      await lap.remove()

      await this.fetchLaps()
    },

    // The stop function stops the timer by clearing the interval that was set with the setInterval function in the tick function and sets the timerState to 'paused'.
    stop () {
      clearInterval(this.ticker) // Clear the timer interval
      this.timerState = 'paused' // Set the timer state to 'paused'
    },

    // The reset function stops the timer by clearing the interval that was set with the setInterval function in the tick function, sets the timerState to 'stopped', resets the time to '00:00:00', sets the currentTimer to 0, and empties the laps array.
    reset () {
      window.clearInterval(this.ticker)
      this.timerState = 'stopped'
      this.time = '00:00:00:000'
      this.hours = 0 // Reset hours to 0
      this.minutes = 0 // Reset minutes to 0
      this.seconds = 0 // Reset seconds to 0
      this.milliseconds = 0
      this.latestLap = 0

      // Reset the totalElapsedTime to 0 when resetting the timer
      this.totalElapsedTime = 0

      // Remove lap times from localStorage
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

.v-list .v-btn {
  border: thin solid black;
}

.v-btn {
  border: thin solid black;
}

</style>
