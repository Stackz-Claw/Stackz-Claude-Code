const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json(require('../../mock-data/notes.json'))
})

module.exports = router
