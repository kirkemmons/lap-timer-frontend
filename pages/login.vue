<template lang="pug">
  v-app
    v-main
      v-container.fluid.fill-height
        v-layout.align-center.justify-center
          v-flex.xs12.sm8.md4
            v-card.elevation-12
              v-toolbar.dark
                v-toolbar-title
                  | {{ isRegister ? stateObj.register.name : stateObj.login.name }} Form

              v-card-text
                form(ref="form" @submit.prevent="isRegister ? register() : login()")
                  v-text-field(v-model="username" name="username" label="Username" type="text" placeholder="username" required)
                  v-text-field(v-model="password" name="password" label="Password" type="password" placeholder="password" required)
                  v-text-field(v-if="isRegister" v-model="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" placeholder="confirm password" required)
                  div.red--text {{ errorMessage }}
                  v-btn.mt-4.primary(type="submit" value="log in") {{ isRegister ? stateObj.register.name : stateObj.login.name }}
                  div.grey--text.mt-4(@click="isRegister = !isRegister") {{ toggleMessage }}
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      isRegister: false,
      errorMessage: '',
      stateObj: {
        register: {
          name: 'Register',
          message: 'Already have an Account? Login.'
        },
        login: {
          name: 'Login',
          message: 'Register'
        }
      }
    }
  },
  computed: {
    toggleMessage () {
      return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message
    }
  },
  methods: {
    login () {
      const { username } = this
      console.log(username + 'logged in')
    },
    register () {
      if (this.password === this.confirmPassword) {
        this.isRegister = false
        this.errorMessage = ''
        this.$refs.form.reset()
      } else {
        this.errorMessage = 'password did not match'
      }
    }
  }
}

</script>
