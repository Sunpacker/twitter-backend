import express from 'express'
import { validationResult } from 'express-validator'
import UserModel, { IUser, IUserDocument } from '../models/UserModel'
import { emailSender, hashGenerator } from '../utils'
import { IResponse } from './types'


class UserControllerClass {
	async index(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const users = await UserModel.find({}).exec()

			res.status(201).json({
				status: 'success',
				data: users
			})
		} catch(e) {
			res.status(500).json({
				status: 'get users error',
				message: `get users error: ${e}`
			})
		}
	}

	async create(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const errors = validationResult(req)

			if(!errors.isEmpty()) {
				res.status(400).json({ 
					status: 'error', 
					message: errors.array() 
				})
				return
			}

			const data: IUser = {
				email: req.body.email,
				fullname: req.body.fullname,
				username: req.body.username,
				password: req.body.password,
				confirmed: false,
				confirmHash: hashGenerator(process.env.SECRET_KEY || Math.random().toString())
			}
			const user = await UserModel.create(data)


			emailSender({
				emailFrom: 'admin@twitclone.loc',
				emailTo: data.email,
				subject: 'Подтверждение почты Twtitter Clone',
				html: `
					<p>Для подтверждения почты, необходимо перейти по <a href="http://localhost:${process.env.PORT || 8888}/users/verify?hash=${data.confirmHash}">этой ссылке</a>.</p>
				`
			}, (e: Error | null) => {
				if(e) {
					res.status(500).json({
						status: 'send email error',
						message: e
					})
				} else {
					res.status(201).json({
						status: 'user creation success',
						data: user
					})
				}
			})
		} catch(e) {
			res.status(500).json({
				status: 'user creation error',
				message: e
			})
		}
	}

	async verify(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const hash = String(req.query.hash)
			
			if(!hash) {
				res.status(400).json({
					status: 'error',
					message: 'verify hash is not found',
				})
				return
			}

			const user: IUserDocument | null = await UserModel.findOne({ confirmHash: hash }).exec()

			if(user) {
				user.confirmed = true
				user.save()

				res.status(201).json({
					status: 'success',
					message: 'user verifying success',
				})
			} else {
				res.status(404).json({
					status: 'error',
					message: 'user is not found',
				})
				return
			}
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `user verify error: ${e}`
			})
		}
	}
}

const UserController = new UserControllerClass()
export default UserController
