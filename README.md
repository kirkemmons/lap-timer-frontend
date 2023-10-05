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

For a detailed explanation of how things work, check out the [documentation](https://nuxtjs.org).

## Project Description

This project involves creating a dynamic web application using Nuxt and Vue, with a key focus on building a stopwatch feature. The stopwatch allows users to track elapsed time and store lap times. The lap timer is meticulously formatted in a millisecond, second, and minute format, enhancing precision and readability.

The application includes a start/stop button and a lap button that creates a new lap and stores the previous lap in an array of laps.

The user interface has been completely redesigned to enhance usability and aesthetics. The frontend has been integrated with a Feathers.js backend using feathersVuex, facilitating seamless communication between the frontend and backend.

Furthermore, all lap times are now managed through a Feather.js backend, with CRUD (Create, Read, Update, Delete) operations supported. Lap times are sent and stored in a MongoDB database, ensuring efficient and structured data management. Each session is associated with its set of laps, and these sessions are stored individually, allowing users to keep track of their sessions on a dedicated sessions page.

In addition to lap tracking, the lap timer accurately displays the fastest and slowest lap times, and the application applies a green color to indicate the fastest lap time and a red color to highlight the slowest lap time, providing a quick and intuitive visual cue to the user.

To enable persistent data storage and improve user experience, lap times and session data are stored both in the MongoDB database and individual sessions, providing a comprehensive solution for lap time tracking and management.

Overall, this project demonstrated proficiency in Nuxt, Vue, FeathersVuex, localStorage, integration with a Feathers.js backend, MongoDB usage for lap time storage, and a redesigned and intuitive user interface. The resulting web application is an efficient and effective tool for tracking elapsed time, storing lap times, identifying fastest and slowest lap times, and managing sessions, all presented in a clear millisecond, second, and minute format, making it a valuable addition to any web development portfolio.

## Wireframes

![homepage](https://i.imgur.com/lEzvMpk.png)

![lap_timer](https://i.imgur.com/pemZGCu.png)

![sessions page](https://i.imgur.com/urQUkQ6.png)

## Dependencies Used

#### Front End
  * Vue
  * Nuxt.js
  * FeatherVuex
  * Javascript
  * CSS
  * Vuetify
  * Feathers.js (backend)
  
## Stretch Goals
  * Create a cars service
  * Create a tracks service
  * Create a master data table where you can filter laps by track and by car
