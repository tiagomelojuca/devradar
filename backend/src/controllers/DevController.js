const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(req, res) {
        const devs = await Dev.find();
        return res.json(devs);
    },

    async store(req, res) {

        const { github, techs, longitude, latitude } = req.body;

        const checkDev = await Dev.findOne( { github: github } );
        if( checkDev ) return res.status(400).json({error: 'User already stored.'});

        const apiResponse = await axios.get(`https://api.github.com/users/${github}`);
        let { name, avatar_url, bio } = apiResponse.data;
        if (!name) { name = apiResponse.data.login }

        const techsArray = parseStringAsArray( techs );
        const location = { type: 'Point', coordinates: [longitude, latitude] };

        const dev = await Dev.create({
            name,
            github,
            bio,
            avatar_url,
            techs: techsArray,
            location
        });

        const coordinates = { latitude, longitude };
        const recipients = findConnections(coordinates, techsArray);
        sendMessage(recipients, 'newdev', dev);

        return res.json(dev);

    }

}