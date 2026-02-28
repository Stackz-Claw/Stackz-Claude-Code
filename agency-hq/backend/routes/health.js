const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json(require('../../mock-data/health.json'))
})

module.exports = router
