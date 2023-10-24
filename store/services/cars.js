import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '~/plugins/feathers'

const { discard } = require('feathers-hooks-common')

class Car extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Car'

  static setupInstance (data, { models }) {
    return data
  }
}

const servicePath = 'cars'
const servicePlugin = makeServicePlugin({
  Model: Car,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [discard(['initials', 'fullName'])],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
