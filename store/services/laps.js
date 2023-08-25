import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '~/plugins/feathers'

const { discard } = require('feathers-hooks-common')

class Lap extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Lap';

  static setupInstance (data, { models }) {
    return data
  }
}

const servicePath = 'laps'
const servicePlugin = makeServicePlugin({
  Model: Lap,
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
