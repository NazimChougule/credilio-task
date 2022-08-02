import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {

    // Register User
    public async register({ request, response }: HttpContextContract) {

        // Validate email 
        const validations = await schema.create({
            email: schema.string({}, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string({}),
        })

        // Validate request using the schema
        const data = await request.validate({ schema: validations })

        // Create user once the request body is validated
        const user = await User.create(data)

        // Set Response Header
        response.status(201)

        // Send Response to client
        return response.created(user)

    }

    // Login User
    public async login({ request, response, auth }: HttpContextContract) {

        // Fetch user credentials from request 
        const password = await request.input('password')
        const email = await request.input('email')

        try {
            // Create Token based on the user credentials
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '24hours',
            });

            // Return token that is generated
            return response
                .status(400)
                .send({ message: 'Logged in successfullly', token: token.toJSON() })

        } catch {

            // Send error if the user credentials are invalid
            return response
                .status(400)
                .send({ error: { message: 'User with provided credentials could not be found' } })
        }
    }

    // Logout User
    public async logout({ auth, response }: HttpContextContract) {

        // Logout user
        await auth.logout()

        // Send response to user
        return response
            .status(200)
            .send({ message: 'Logged out successfully' })

    }

}
