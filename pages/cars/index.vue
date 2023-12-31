<template lang="pug">
  v-app(style="background-color: #666666")
    v-main
      v-container.fluid.fill-height
        v-row(
          justify="center"
        )
          v-col(
            cols="12"
            md="6"
          )
            v-card(
              outlined
            )
              v-card-text
                v-text-field.flex-shrink-1.flex-grow-0(
                  label="Search"
                  single-line
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  filled
                  :loading="isFindCarsPending"
                  rounded
                  dense
                  v-model="search"
                )
              v-data-table.clickable(
                :loading="isFindCarsPending"
                :headers="headers"
                :items="cars"
                class="elevation-18"
                no-data-text="No Cars Found"
                :server-items-length="!isFindCarsPending ? carsLatestQuery.response.total : 0"
                :options.sync="options"
              )
                template(#item.name="{ item: car }")

                template(#item.remove="{ item: car }")
                  v-btn(icon @click="removeCar(car)")
                    v-icon(color="#666666" size="large") mdi-trash-can-outline

                template(v-slot:item.name="{ item: car }")
                  nuxt-link(:to="`/cars/${car._id}`") {{ car.name }}

            v-row.mt-8
              v-col.text-center
                v-btn.my-5(icon to="/" v-tooltip.bottom="'Back to Home Page'")
                  v-icon.elevation-10(color="orange") mdi-arrow-left

</template>

<script>

import { } from 'vuex'
import { makeFindMixin } from 'feathers-vuex'

export default {
  mixins: [makeFindMixin({ service: 'cars', watch: true })],

  data () {
    return {
      search: '',
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['name'],
        sortDesc: [false]
      }
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Remove Car', align: 'right', value: 'remove', sortable: false }
      ]
    },

    carId () {
      console.log(this.$route.params)
      return this.$route.params.slug
    },

    sortBy () {
      const obj = {}
      if (this.options.sortBy && this.options.sortBy.length) {
        obj[this.options.sortBy[0]] = this.options.sortDesc[0] ? -1 : 1
      }
      return obj
    },

    limit () {
      return this.options.itemsPerPage !== -1 ? this.options.itemsPerPage : 999
    },

    carsParams () {
      const query = {
        carId: this.carId,
        $limit: this.limit,
        $skip: this.options.itemsPerPage * (this.options.page - 1),
        $sort: this.sortBy
      }

      if (this.search) {
        query.name = {
          $regex: this.search,
          $options: 'gi'
        }
      }

      return { query }
    }
  },

  methods: {

    async removeCar (car) {
    // Use the 'remove' method (presumably an asynchronous API call) to remove the specified car record.
      await car.remove()

      // After successfully removing the car record, refresh the list of cars by calling 'this.findSessions' with the latest query parameters.
      await this.findCars(this.carsLatestQuery)
      console.log(this.carsLatestQuery)
    }
  }
}

</script>

<style lang="scss">

.container {
  margin: 0 auto;
  background-color: gray;
}

</style>
