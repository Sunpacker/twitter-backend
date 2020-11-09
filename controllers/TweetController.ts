import express from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import { Types } from 'mongoose'

import TweetModel, { ITweetModel, ITweetModelDocument } from '../models/TweetModel'
import { IUserModel } from '../models/UserModel'
import { IResponse } from './types'


class TweetControllerClass {
	async index(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const tweets: ITweetModelDocument[] | null = await TweetModel.find().populate('user').exec()

			res.status(201).json({
				status: 'success',
				data: tweets
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `get tweets error: ${e}`
			})
		}
	}

	async show(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const tweetId: string = req.params.id

			if(!Types.ObjectId.isValid(tweetId)) {
				res.status(400).send()
				return
			}

			const tweet: ITweetModelDocument | null = await TweetModel.findById(tweetId).populate('user').exec()
			
			if(!tweet) {
				res.status(404).send()
				return
			}

			res.status(201).json({
				status: 'success',
				data: tweet
			})
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `get tweet error: ${e}`
			})
		}
	}

	async create(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const user = req.user as IUserModel

			if(user) {
				const errors: Result<ValidationError>	= validationResult(req)
	
				if(!errors.isEmpty()) {
					res.status(400).json({ 
						status: 'error', 
						message: errors.array() 
					})
					return
				}

				const tweet: ITweetModelDocument = await TweetModel.create<ITweetModel>({
					text: req.body.text,
					user
				})
				
				res.status(201).json({
					status: 'success',
					data: tweet
				})
			}
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `tweet creation error: ${e}`
			})
		}
	}

	async update(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const user = req.user as IUserModel
			
			if(user) {
				const tweetId = req.params.id

				if(!Types.ObjectId.isValid(tweetId)) {
					res.status(400).send()
					return
				}

				const tweet = await TweetModel.findById(tweetId)

				if(tweet) {
					if(String(tweet.user) === String(user._id)) {
						const text = req.body.text

						if(text.length >= 6 && text.length <= 280) {
							tweet.text = text
							tweet.save()
		
							res.status(200).json({ status: 'success' })
						} else {
							res.status(400).json({
								status: 'error',
								message: 'Длина текста твита может быть от 6 до 280 символов'
							})
						}
					} else {
						res.status(403).json({
							status: 'error',
							message: 'Нельзя изменить чужой твит'
						})
					}
				} else {
					res.status(404).send()
				}
			}
		} catch(e) {
			res.status(500).json({
				status: 'error',
				message: `tweet update error: ${e}`
			})
		}
	}

	async delete(req: express.Request, res: express.Response<IResponse>): Promise<void> {
		try {
			const user = req.user as IUserModel
			
			if(user) {
				const tweetId = req.params.id

				if(!Types.ObjectId.isValid(tweetId)) {
					res.status(400).send()
					return
				}

				const tweet = await TweetModel.findById(tweetId)

				if(tweet) {
					if(String(tweet.user) === String(user._id)) {
						tweet.remove()
	
						res.status(200).json({ status: 'success' })
					} else {
						res.status(403).json({
							status: 'error',
							message: 'Нельзя удалить чужой твит'
						})
					}
				} else {
					res.status(404).send()
				}
			}
		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: `user deletion error: ${e}`
			})
		}
	}
}


export default new TweetControllerClass()
