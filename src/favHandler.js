const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'data', 'favorites.json')

const favHandler = {

    readFavs: function (res) {
        try {
            let fileContent = this.getFavoritesJson()
            fileContent.length === 0 ? res.status(204).end() : res.status(200).json(fileContent)
        }
        catch (error) {
            console.error(error)
            res.status(error.status).end()
        }
    },
    writeFav: function (req, res) {
        try {
            let json = this.getFavoritesJson()

            let initialLength = Object.keys(json.favorites).length
            if (initialLength == 10) {
                res.statusMessage = "Max favorites limit reached!"
                res.status(403).end()
            } else {
                json.favorites.push({ id: initialLength, color: req.body.color })

                fs.writeFile(filePath, JSON.stringify(json), function (err) {
                    if (err) throw err

                    let favorite = {}
                    favorite.id = initialLength
                    favorite.color = req.body.color

                    res.status(200).json(favorite)
                })
            }
        } catch (error) {
            console.error(error)
            res.status(error.status).end()
        }
    },
    deleteFav: function (req, res) {
        try {
            let json = this.getFavoritesJson()

            // Delete with splice
            json.favorites.splice(req.body.id, 1)

            // Regenerate IDs
            for (i = 0; i < json.favorites.length; i++) {
                json.favorites[i].id = i
            }

            // Write updated data
            fs.writeFile(filePath, JSON.stringify(json), function (err) {
                if (err) throw err
            })

            res.status(204).end()
        } catch (error) {
            console.error(error)
            res.status(error.status).end()
        }
    },
    getFavoritesJson: function () {
        let content = fs.readFileSync(filePath)
        if (content.length === 0) {
            return {
                favorites: [],
            }
        } else {
            return JSON.parse(content)
        }
    }
}

module.exports = favHandler