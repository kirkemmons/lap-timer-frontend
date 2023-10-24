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
          @submit.prevent="saveCar(clone, reset)"
          v-model="valid"
        )
          v-card
            v-card-title Add Car To A Session
            v-card-text
              v-text-field(
                filled
                color="orange"
                label="Car Name"
                v-model="clone.name"
                :rules="[rules.required, rules.max(100)]"
                counter="40"
              )

            v-divider
            v-card-actions
              v-btn.ml-auto(
                color="grey"
                text
                @click="$emit('input', false)"
              ) Cancel
              v-btn(
                color="orange"
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
      const { Car } = this.$FeathersVuex.api
      return new Car({ name: this.name })
    }
  },
  methods: {
    isValid (car) {
      return car.name && this.valid
    },

    async saveCar (clone, reset) {
      try {
        await clone.save()
        reset()
        this.$emit('input', false)
        // Optionally emit an event to notify the parent component about car creation
        this.$emit('car-created', clone)
        console.log(clone)

        // Navigate to the car slug page for the created car
        this.$router.push('/cars')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss">

</style>
