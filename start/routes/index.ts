import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    require('./auth')
    require('./user')
}).prefix('api/')