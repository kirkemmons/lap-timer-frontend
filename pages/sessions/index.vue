<template lang="pug">
  v-app(style="background-color: #313537" class="custom-text-color")
    v-main
      v-container.fluid.fill-height.mt-10
        v-row(
          justify="center"
        )
          v-col(
            cols="9"
            lg="6"
          )
            v-card(
              outlined
              class="custom-card"
            )
              v-card-text
                v-text-field.flex-shrink-1.flex-grow-0.custom-search-field(
                  single-line
                  hide-details
                  filled
                  :loading="isFindSessionsPending"
                  rounded
                  dense
                  v-model="search"
                )
                  template(v-slot:prepend-inner)
                    v-icon(color="#959494") mdi-magnify
                  template(v-slot:label)
                    span Search
              v-data-table.clickable.custom-data-table.custom-hover.custom-row-lines(
                :loading="isFindSessionsPending"
                :headers="headers"
                :items="sessions"
                class="elevation-18"
                no-data-text="No Sessions Found"
                :server-items-length="!isFindSessionsPending ? sessionsLatestQuery.response.total : 0"
                :options.sync="options"
                :hover="false"
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
                    v-icon(color="#B0B0B0" size="large") mdi-trash-can-outline

                template(v-slot:item.name="{ item: session }")
                  nuxt-link(:to="`/sessions/${session._id}`" class="no-underline") {{ session.name }}

            v-row.mt-3
              v-col.text-center
                v-btn(icon to="/" v-tooltip.bottom="'Back to Home Page'" class="custom-tooltip")
                  v-icon.elevation-10(color="orange") mdi-arrow-left

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

  watch: {
    options: {
      handler () {
        this.findSessions(this.sessionsParams) // Fetch sessions with updated params
      },
      deep: true
    },
    search (newSearch) {
      this.options.page = 1 // Reset to first page on new search
      this.findSessions(this.sessionsParams) // Fetch sessions with updated search
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
@import '~/assets/variables.scss';

.custom-card {
  background-color: $background-color-darker !important;
}

.no-underline {
  text-decoration: none;
}

.custom-search-field .v-input__control .v-input__slot input {
  color: $text-color-white !important;
}

</style>
