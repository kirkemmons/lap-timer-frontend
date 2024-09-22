<template lang="pug">
  v-dialog(
    :value="value"
    :max-width="500"
    persistent
  )
    FeathersVuexFormWrapper(
      :item="item"
    )
      template(v-slot="{ clone, save, reset, remove }")
        v-form(
          ref="form"
          @submit.prevent="saveSession(clone, reset)"
          v-model="valid"
        )
          v-card
            v-card-title Add Racetrack To Track Lap Times
            v-card-text
              v-text-field(
                filled
                label="Track Name"
                v-model="clone.name"
                :rules="[rules.required, rules.max(100)]"
                counter="100"
              )

            v-divider
            v-card-actions
              v-btn.ml-auto(
                color="grey"
                text
                @click="$emit('input', false)"
              ) Cancel
              v-btn(
                color="primary"
                text
                type="submit"
                :disabled="!isValid(clone)"
              ) Add

</template>

<script>
import { FeathersVuexFormWrapper } from 'feathers-vuex'
import validations from '~/mixins/validationRulesMixin.js'

export default {
  components: {
    FeathersVuexFormWrapper
  },
  mixins: [
    validations
  ],
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      name: ''
    }
  },
  computed: {

    item () {
      const { Session } = this.$FeathersVuex.api
      return new Session({ name: this.name })
    }
  },
  methods: {
    isValid (session) {
      return session.name && this.valid
    },

    async saveSession (clone, reset) {
      try {
        await clone.save()
        reset()
        this.$emit('input', false)
        // Optionally emit an event to notify the parent component about session creation
        this.$emit('session-created', clone)
        console.log(clone)

        // Navigate to the sessions index page after creating the session
        this.$router.push('/sessions')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss">

</style>
