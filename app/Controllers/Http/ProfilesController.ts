import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile';
import User from 'App/Models/User';

export default class ProfilesController {

    // ----------- Get User Profile --------------- //
    public async get({ auth }: HttpContextContract) {

        // Extract User ID from Auth
        const userId = auth.user?.$attributes.id;

        // Fetch user profile
        const userProfile = await User
            .query()
            .where('id', userId)
            .select('id', 'email')
            .preload('profile', (profileQuery) => {
                profileQuery.select('name', 'mobile', 'gender', 'dob')
            })
            .first()


        // Send Response to Client
        return { message: 'User Profile', token: userProfile }
    }


    // ------------ Create User Profile --------------- //
    public async create({ request, auth }: HttpContextContract) {

        // Extract User ID from Auth
        const userId = auth.user?.$attributes.id;

        const existingProfile = await Profile.findBy('userId', userId);

        // Check if user profile already exists
        if (existingProfile) {
            return { message: 'Profile already exists, please try updating it' }
        }

        // Schema for request body validation
        const createUserProfileSchema = await schema.create({
            name: schema.string({}, [
                rules.required(),
                rules.alpha({
                    allow: ['space']
                }),
                rules.trim()
            ]),
            mobile: schema.string([
                rules.regex(/^\d{10}$/),
                rules.trim()
            ]),
            gender: schema.enum(['MALE', 'FEMALE']),
            dob: schema.date({ format: 'yyyy-MM-dd' }, [
                rules.before('today')
            ])
        })

        // Validate request body
        const data = await request.validate({ schema: createUserProfileSchema })

        Object.assign(data, { userId })

        // Create user once the request body is validated
        const profile = await Profile.create(data)

        /**
         * Refreshing the `profile` model before returning it as the payload of the response is important.
         * If not refreshed, only the actual/few properties which were inserted will be returned
         */
        await profile.refresh()

        // Send newly created profile to client
        return {
            message: 'Profile created successfully',
            data: profile
        }
    }


    // --------- Update User Profile --------------- //
    public async update({ request, auth }: HttpContextContract) {

        // Extract User ID from Auth
        const userId = auth.user?.$attributes.id;

        let userProfile = await Profile.findBy('userId', userId);

        // Check if user profile already exists
        if (!userProfile) {
            return {
                message: 'Profile does not exists, please create your profile before updating it'
            }
        }

        // Schema for request body validation
        const updateUserProfileSchema = await schema.create({
            name: schema.string({}, [
                rules.required(),
                rules.alpha({
                    allow: ['space']
                }),
                rules.trim()
            ]),
            mobile: schema.string([
                rules.regex(/^\d{10}$/),
                rules.trim()
            ]),
            gender: schema.enum(['MALE', 'FEMALE']),
            dob: schema.date({ format: 'yyyy-MM-dd' }, [
                rules.before('today')
            ])
        })

        // Validate request body
        const data = await request.validate({ schema: updateUserProfileSchema });

        // Update the new profile details into Profile Model
        userProfile.merge({
            name: data.name,
            mobile: data.mobile,
            gender: data.gender,
            dob: data.dob
        })

        // Save Profile Model
        userProfile.save();

        // Send newly updated profile to client
        return {
            message: 'Profile updated successfully',
            data: userProfile
        }

    }

    // ------------- Delete User Profile ----------------- //
    public async delete({ request }: HttpContextContract) {

        // Schema for request body validation
        const deleteUserSchema = await schema.create({
            email: schema.string({}, [
                rules.required(),
                rules.email(),
                rules.trim()
            ]),
        });

        // Validate request body
        const data = await request.validate({ schema: deleteUserSchema });

        // Check id User exists
        let user = await User.findBy('email', data.email);

        // Send Response if user does not exist
        if (!user) {
            return {
                message: 'User does not exists'
            }
        }

        // Delete user
        await user.delete();

        // Send response when user is deleted
        return {
            message: 'User delete successfully'
        }

    }

}