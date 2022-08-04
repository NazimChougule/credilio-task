import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('register', 'AuthController.register') // Register 
    Route.post('login', 'AuthController.login') // Login
    Route.post('logout', 'AuthController.logout') // Logout
}).prefix('api/')