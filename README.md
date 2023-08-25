# Lap Timer Frontend

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Project Description

This project involved creating a dynamic web application using Nuxt and Vue, with a focus on building a stopwatch feature that allows users to track elapsed time and store lap times. The application includes a start/stop button and a lap button that creates a new lap and stores the previous lap in an array of laps.

Additionally, the project included the implementation of a sortable datatable that displays lap numbers and times, along with a v-sparkline that graphically represents lap times. To enable persistent data storage, localStorage was integrated to store lap times, and Vuex points were used to summarize and manipulate data.

Overall, this project demonstrated proficiency in Nuxt, Vue, Vuex, and localStorage, along with an ability to create a responsive and dynamic user interface. The resulting web application is an efficient and effective tool for tracking elapsed time and storing lap times, making it a valuable addition to any web development portfolio.

## Wireframe

![lap_timer](https://i.imgur.com/KknPglN.png)

## Dependencies Used

#### Front End
  * Vue
  * Nuxt.js
  * Javascript
  * CSS
  * Vuetify
  
## Stretch Goals

  * Add a column to the datatable that compares it to the previous lap
  * Add a "multi-timer" mode which allows you to track multiple cars at once
  * Hookup feathers backend
  * Crud laptimes
  * Create sessions service
  * Create cars service
  * Create tracks service
  * Create master datatable where you can filter laps by track and by car
