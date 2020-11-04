import express from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

import UserModel, { IUserModel, IUserModelDocument } from '../models/UserModel'
import { emailSender, encodeMD5 } from '../utils'
import { IResponse } from './types'


class UserControllerClass {
	async index(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const users: IUserModelDocument[] | null = await UserModel.find().exec()

			res.status(201).json({
				status: 'success',
				data: users
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `get users error: ${e}`
			})
		}
	}

	async show(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const userId: string = req.params.id

			if(!Types.ObjectId.isValid(userId)) {
				res.status(400).send()
				return
			}

			const user: IUserModelDocument | null = await UserModel.findById(userId).exec()
			
			if(!user) {
				res.status(404).send()
				return
			}

			res.status(201).json({
				status: 'success',
				data: user
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `get user error: ${e}`
			})
		}
	}

	async create(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const errors: Result<ValidationError>	= validationResult(req)

			if(!errors.isEmpty()) {
				res.status(400).json({ 
					status: 'error', 
					message: errors.array() 
				})
				return
			}

			const data: IUserModel = {
				email: req.body.email,
				fullname: req.body.fullname,
				username: req.body.username,
				password: encodeMD5(process.env.SECRET_KEY + req.body.password),
				confirmHash: encodeMD5(process.env.SECRET_KEY || Math.random().toString()),
				confirmed: false
			}
			const user: IUserModelDocument = await UserModel.create(data)

			emailSender({
				emailFrom: 'admin@twitclone.loc',
				emailTo: data.email,
				subject: 'Подтверждение почты Twtitter Clone',
				html: `
					<p>Для подтверждения почты, необходимо перейти по <a href="http://localhost:${process.env.PORT || 8888}/auth/verify?hash=${data.confirmHash}">этой ссылке</a>.</p>
				`
			}, (e: Error | null) => {
				if(e) {
					res.status(500).json({
						status: 'error',
						message: `send email error: ${e}`
					})
				} else {
					res.status(201).json({
						status: 'success',
						data: user
					})
				}
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `user creation error: ${e}`
			})
		}
	}

	async verify(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const hash: string = String(req.query.hash)
			
			if(!hash) {
				res.status(400).json({
					status: 'error',
					message: 'verify hash is not found',
				})
				return
			}

			const user: IUserModelDocument | null = await UserModel.findOne({ confirmHash: hash }).exec()

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

	async afterLogin(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const user = req.user ? (req.user as IUserModelDocument).toJSON() : undefined

			res.json({
				status: 'success',
				data: {
					...user,
					token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || '123', { expiresIn: '30 days' })
				}
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `get users error: ${e}`
			})
		}
	}

	async getUserInfo(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const user = req.user ? (req.user as IUserModelDocument).toJSON() : undefined

			res.json({
				status: 'success',
				data: user
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `get users error: ${e}`
			})
		}
	}
}


export default new UserControllerClass()
