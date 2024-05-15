const lightActions = {

    // Function to turn the light on/off
    setLightState: function (govee, req, res, state) {
        govee.control.setOn(state)
            .then(() => this.successCallback(req, res), err => this.failureCallback(err, res))
    },

    // Function to set the color of the light
    setLightColor: function (govee, req, res) {
        govee.control.setColor(
            parseInt(req.body.r),
            parseInt(req.body.g),
            parseInt(req.body.b)
        )
            .then(() => this.successCallback(req, res), err => { this.failureCallback(err, res) })
    },

    // Function to set the brightness of the light
    setLightBrightness: function (govee, req, res) {
        govee.control.setBrightness(parseInt(req.body.brightness))
            .then(() => this.successCallback(req, res), err => { this.failureCallback(err, res) })
    },

    // Function to get the status information of the light
    getDeviceStatus: function (govee, res) {
        govee.status.getDeviceStatus()
            .then((statusInfo) => {
                res.status(200).json(statusInfo)
            })
            .catch((err => {
                console.error(err)
                res.status(err.status).end()
            }))
    },

    // Callback for resolved promises
    successCallback: function (req, res) {
        res.status(200).send(`Command "${req.query.action}" successfully sent`)
    },

    // Callback for rejected promises
    failureCallback: function (err, res) {
        console.error('Server error: ', err.message)
        res.status(err.status).end()
    },
}

module.exports = lightActions