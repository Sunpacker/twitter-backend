import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt'

import UserModel, { IUserDocument } from '../models/UserModel'
import { encodeMD5 } from '../utils'


passport.use(
	new LocalStrategy( async (username, password, done): Promise<void> => {
		try {
			// авторизация пользователя с помощью имени пользователя или почты
			const user: IUserDocument | null = await UserModel.findOne({ $or: [{email: username}, {username}] }).exec()

			// сравнение введенного пароля и пароля в базе данных
			if(user && user.password === encodeMD5(process.env.SECRET_KEY + password)) {
				return done(null, user)
			}

			done(null, false)
		} catch (e) {
			done(e, false)
		}
  }
))

passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.SECRET_KEY || '123',
			jwtFromRequest: ExtractJwt.fromHeader('token')
		},
		async (payload: { data: IUserDocument }, done) => {
			try {
				const user: IUserDocument | null = await UserModel.findById(payload.data._id).exec()

				if(user) {
					return done(null, user)
				}

				done(null, false)
			} catch(e) {
				done(e, false)
			}
		}
	)
)

passport.serializeUser((user: IUserDocument, done) => done(null, user._id))

passport.deserializeUser( (id, done) => {
  UserModel.findById(id, (e, user) => done(e, user?.toJSON()))
})

export { passport }
