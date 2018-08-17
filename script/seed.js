'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')
const yelpCreate = require('./yelpTestScript')
const zomatoCreate = require('./zomatoTestScript')
const googleCreate = require('./googleTestScript')
const foursquareCreate = require('./foursquareTestScript')
const openTableCreate = require('./openTableTestScript')
const createDbRestaurantObj = require('./helperFunctions')

async function seed() {
  await db.sync({force: true})
  console.log('Database synced!')

  const users = await Promise.all([
    User.create({email: 'kevin@email.com', password: '123'}),
    User.create({email: 'lucas@email.com', password: '123'}),
    User.create({email: 'jordan@email.com', password: '123'}),
    User.create({email: 'victor@email.com', password: '123'})
  ])
  console.log(`seeded ${users.length} users`)
  await yelpCreate()
  await zomatoCreate(createDbRestaurantObj)
  await googleCreate(createDbRestaurantObj)
  await foursquareCreate(createDbRestaurantObj)
  await openTableCreate(createDbRestaurantObj)
  console.log(`Seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
