import mongoose from 'mongoose'

mongoose.connect(process.env.DB_CONNECTION || 'mongodb://localhost:27017', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))

export { db, mongoose }
