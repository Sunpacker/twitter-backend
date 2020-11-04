import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
import { passport } from './core/passport'
import './core/db'
import router from './core/router'


const app = express()
const port = Number(process.env.PORT) || 8888

app.use(express.json())
app.use(passport.initialize())
app.use(router)

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
}).on('error', (e: Error) => {
	console.log(`Server start error: ${e}`)
})
