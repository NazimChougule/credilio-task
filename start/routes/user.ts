import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('', 'ProfilesController.get') // Get User 
    Route.post('', 'ProfilesController.create') // Create User
    Route.put('', 'ProfilesController.update') // Update User
    Route.delete('', 'ProfilesController.delete') // Delete User
})
    .middleware('auth')
    .prefix('api/user/profile/')