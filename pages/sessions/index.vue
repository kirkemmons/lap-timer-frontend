<template lang="pug">
  v-app(style="background-color: #666666")
    v-main
      v-container.fluid.fill-height
        v-row(
          justify="center"
        )
          v-col(
            cols="9"
            lg="6"
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
                  :loading="isFindSessionsPending"
                  rounded
                  dense
                  v-model="search"
                )
              v-data-table.clickable(
                :loading="isFindSessionsPending"
                :headers="headers"
                :items="sessions"
                class="elevation-18"
                no-data-text="No Sessions Found"
                :server-items-length="!isFindSessionsPending ? sessionsLatestQuery.response.total : 0"
                :options.sync="options"
              )
                template(#item.name="{ item: session }")
                template(#item.laps="{ item: session }")
                  FeathersVuexCount(
                    v-slot="{ total }"
                    :service="'laps'"
                    :params="{ query: { sessionId: session._id } }"
                  )
                    span
                      | {{ total }}
                template(#item.remove="{ item: session }")
                  v-btn(icon @click="removeSession(session)")
                    v-icon(color="#666666" size="large") mdi-trash-can-outline

                template(v-slot:item.name="{ item: session }")
                  nuxt-link(:to="`/sessions/${session._id}`") {{ session.name }}

            v-row.mt-8
              v-col.text-center
                v-btn.my-5(icon to="/" v-tooltip.bottom="'Back to Home Page'" class="custom-tooltip")
                  v-icon.elevation-10(color="white") mdi-arrow-left

</template>

<script>

import { } from 'vuex'
import { makeFindMixin } from 'feathers-vuex'

export default {
  mixins: [makeFindMixin({ service: 'sessions', watch: true })],

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
        { text: '# of Laps', align: 'left', value: 'laps' },
        { text: 'Remove Session', align: 'right', value: 'remove', sortable: false }
      ]
    },

    sessionId () {
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

    sessionsParams () {
      const query = {
        sessionId: this.sessionId,
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

    async removeSession (session) {
    // Use the 'remove' method (presumably an asynchronous API call) to remove the specified session record.
      await session.remove()

      // After successfully removing the session record, refresh the list of sessions by calling 'this.findSessions' with the latest query parameters.
      await this.findSessions(this.sessionsLatestQuery)
      console.log(this.sessionsLatestQuery)
    }
  }
}

</script>

<style lang="scss">

.container {
  margin: 0 auto;
  background-color: gray;
}

.custom-tooltip {
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

</style>
