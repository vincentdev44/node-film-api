const { Sequelize, DataTypes } = require('sequelize')
const FilmModel = require('../models/film')
const UserModel = require('../models/user')
const films = require('./mock-film')
const bcrypt = require('bcrypt')

let sequelize

if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize('tzi4z67jwly6j1vk', 'x2dwurheo7rwibm1', 's0sp6zenun7xbxhy', {
        host: 'j5zntocs2dn6c3fj.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: true
    })
} else {
    sequelize = new Sequelize('myflix', 'root', '', {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: true
    })
}

const Film = FilmModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)


const initDb = () => {
    return sequelize.sync().then(_ => {
        console.log('INIT DB')
        films.map(film => {
            Film.create({
                name: film.name,
                description: film.description,
                picture: film.picture,
                video: film.video,
                created: film.created,
                types: film.types
            }).then(film => console.log(film.toJSON()))
        })

        bcrypt.hash('myflix', 10)
            .then(hash => User.create({ username: 'myflix', password: hash }))
            .then(user => console.log(user.toJSON()))

        console.log('La base de donnée a bien été initialisée !')
    })
}

module.exports = {
    initDb, Film, User
}