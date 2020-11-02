import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { UserController } from './controllers'
import { registerValidation } from './validations'

import './core/db'

const app = express()
const port = Number(process.env.PORT) || 8888

app.use(express.json())

app.get('/users', UserController.index)
app.get('/users/verify', UserController.verify)
app.post('/users', registerValidation, UserController.create)
// app.patch('/users', UserController.update)
// app.delete('/users', UserController.delete)

app.listen(port, (): void => {
	// if(e) throw new Error(e)

	console.log(`Server is running at http://localhost:${port}`)
})
