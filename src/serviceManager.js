const Service = require('node-windows').Service

var svc = new Service({
    name: 'goveelights',
    description: 'Govee lights UI service',
    script: 'app.js'
})

const action = process.argv[2]

if (action === 'install') {
    svc.on('install', function () {
        console.log(`Service ${svc.name} successfully installed`)
        svc.start()
    })

    svc.on('start', function () {
        console.log(`Service started!`)
    })

    svc.install()

} else if (action === 'uninstall') {
    svc.on('uninstall', function () {
        console.log(`Service ${svc.name} successfully uninstalled`)
    })

    svc.uninstall()

} else {
    console.log('Invalid action. Use argument "install" or "uninstall".')
}