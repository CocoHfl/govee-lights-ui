const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const govee = require('govee-api')
const cfg = require('./config/config.json')
const favHandler = require('./favHandler')
const lightActions = require('./lightActions')

app.use(express.static(path.join(__dirname, '../public')))

app.listen(3000, () => console.log('Server ready! \n=> http://localhost:3000'))
govee.initDevice(cfg.key, cfg.macAddress, cfg.deviceModel)

app.route('/command')
  // Handle POST requests to the '/command' endpoint
  .post(function (req, res) {
    // Determine the action to perform based on the 'action' query parameter
    switch (req.query.action) {
      case 'start':
      case 'stop':
        return lightActions.setLightState(govee, req, res, req.query.action == 'start' ? true : false)

      case 'setColor':
        return lightActions.setLightColor(govee, req, res)

      case 'setBrightness':
        return lightActions.setLightBrightness(govee, req, res)

      case 'writeFav':
        return favHandler.writeFav(req, res)

      case 'deleteFav':
        return favHandler.deleteFav(req, res)

      default:
        return res.status(404).send(`Unknown command '${req.query.action}'`)
    }
  })

  // Handle GET requests to the '/command' endpoint
  .get(function (req, res) {
    // Determine the action to perform based on the 'action' query parameter
    switch (req.query.action) {
      case 'readFavs':
        return favHandler.readFavs(res)

      case 'status':
        return lightActions.getDeviceStatus(govee, res)

      default:
        return res.status(404).send(`Unknown command '${req.query.action}'`)
    }
  })