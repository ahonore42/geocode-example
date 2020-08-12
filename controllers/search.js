let router = require('express').Router()
let db = require('../models')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN})


router.get('/', (req, res) => {
    geocodingClient.forwardGeocode({
        query: `${req.query.city}, ${req.query.state}`
    })
    .send()
    .then(response => {
        let match = response.body.features[0]
        // console.log(match.features[0].center)
        res.render('show', { match, mapkey: process.env.MAPBOX_TOKEN })
    })
    .catch(err => {
        console.log(err)
        res.send('Baaad idea, this is an error')
    })
})

router.post('/fave', (req, res) => {
    db.place.create(req.body)
    .then(response => {
        res.redirect('fave')
    })
    .catch(err => {
        console.log(err)
        res.send('Baaad idea, this is an error')
    })
})

router.get('/fave', (req, res) => {
    db.place.findAll()
    .then((places) => {
        res.render('fave', {places})
    })
    .catch(err => {
        console.log(err)
        res.send('Baaad idea, this is an error')
    })
})

router.delete('/remove', (req, res) => {
    db.place.destroy({
        where: {id: req.params.id}
    })
    res.send('This is the add page')
})



module.exports = router