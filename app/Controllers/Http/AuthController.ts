import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {

    // Register User
    public async register({ request, response }: HttpContextContract) {

        // Schema for request body validation
        const registerUserSchema = await schema.create({
            email: schema.string({}, [
                rules.email(),
                rules.trim(),
                rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string({ trim: true }),
        })

        // Validate request using the schema
        const data = await request.validate({ schema: registerUserSchema })

        // Create user once the request body is validated
        const user = await User.create(data)

        // Send Response to client
        response.status(201)
        return user

    }

    // Login User
    public async login({ request, auth }: HttpContextContract) {

        // Schema for request body validation
        const loginUserSchema = await schema.create({
            email: schema.string({}, [
                rules.email(),
                rules.trim(),
            ]),
            password: schema.string({ trim: true }),
        })

        // Validate request using the schema
        const data = await request.validate({ schema: loginUserSchema })

        // Fetch user credentials from request 
        const password = data.password
        const email = data.email

        try {
            // Create Token based on the user credentials
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '24hours',
            });

            // Return token that is generated
            return { message: 'Logged in successfullly', token: token.toJSON() }

        } catch {

            // Send error if the user credentials are invalid
            return { error: { message: 'User with provided credentials could not be found' } };
        }
    }

    // Logout User
    public async logout({ auth }: HttpContextContract) {

        // Logout user
        await auth.logout()

        // Send response to user
        return { message: 'Logged out successfully' };

    }

}
