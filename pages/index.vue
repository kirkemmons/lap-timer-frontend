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
            span {{ $dayjs.duration(lap.time, 'milliseconds').format('mm:ss:sss') }}
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

    //- v-row(
    //-   justify="center"
    //- )
    //-   v-col(
    //-     cols="9"
    //-     lg="6"
    //-   )
    //-     v-card.mt-4
    //-       v-sparkline(
    //-         show-labels
    //-         label-size="6"
    //-         :value="lapTimes"
    //-         :gradient="['#1feaea', '#f72047', '#ffd200']"
    //-         line-width="3"
    //-         auto-draw
    //-         stroke-linecap="square"
    //-         class="elevation-18"
    //-       )

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
      currentTimer: 0,
      time: '00:00:00',
      ticker: undefined,
      latestLap: ''
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
        this.tick()
        this.timerState = 'running'
      }
    },

    // The tick function increments the currentTimer variable by 1 every 10 milliseconds and updates the time variable with the current time in the HH:mm:ss format using the formatTime function.
    tick () {
      this.ticker = setInterval(() => {
        this.currentTimer += 10
        this.time = this.formatTime(this.currentTimer)
      }, 10)
    },

    // The formatTime function takes the number of seconds passed as an argument and uses the dayjs library to create a new dayjs object representing the current time (measuredTime), adds the number of seconds passed to it and returns the resulting time in the HH:mm:ss format.
    formatTime (milliseconds) {
      const measuredTime = this.$dayjs.duration(milliseconds, 'milliseconds')
      return measuredTime.format('mm:ss:sss')
    },

    async createLap () {
      // This lap function first checks the value of the timerState variable. If the timerState is not running, the function immediately returns without executing the rest of the code.
      if (this.timerState !== 'running') {
        return
      }

      const lapStartTime = this.latestLap !== '' ? this.latestLap : 0
      // console.log(lapStartTime)
      const lapEndTime = this.currentTimer // Store the current time as the end time of the lap

      const lapTimeDuration = (lapEndTime - lapStartTime)

      console.log(lapTimeDuration)

      const { Lap } = this.$FeathersVuex.api
      const data = { time: lapTimeDuration }

      const lap = new Lap(data)

      await lap.create()

      this.latestLap = lapEndTime
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
      window.clearInterval(this.ticker)
      this.timerState = 'paused'
    },

    // The reset function stops the timer by clearing the interval that was set with the setInterval function in the tick function, sets the timerState to 'stopped', resets the time to '00:00:00', sets the currentTimer to 0, and empties the laps array.
    reset () {
      window.clearInterval(this.ticker)
      this.timerState = 'stopped'
      this.time = '00:00:00'
      this.currentTimer = 0
      this.latestLap = 0

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
