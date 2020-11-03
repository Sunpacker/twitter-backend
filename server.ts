import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import { UserController } from './controllers'
import { registerValidation } from './validations'
import { passport } from './core/passport'
import './core/db'


const app = express()
const port = Number(process.env.PORT) || 8888

app.use(express.json())
app.use(passport.initialize())

app.get('/users', UserController.index)
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserController.getUserInfo)
app.get('/users/:id', UserController.show)
app.get('/auth/verify', UserController.verify)
app.post('/auth/register', registerValidation, UserController.create)
app.post('/auth/login', passport.authenticate('local'), UserController.afterLogin)
// app.patch('/users', UserController.update)
// app.delete('/users', UserController.delete)


app.listen(port, (): void => {
	// if(e) throw new Error(e)

	console.log(`Server is running at http://localhost:${port}`)
})
