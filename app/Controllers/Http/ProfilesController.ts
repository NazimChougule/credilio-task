// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfilesController {

    public async get() {
        return 'Get'
    }

    public async getByID() {
        return 'Get by ID'
    }

    public async create() {
        return 'Create'
    }

    public async update() {
        return 'Update'
    }

    public async delete() {
        return 'Delete'
    }

}
