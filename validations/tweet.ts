import { body } from 'express-validator'


const tweetCreationValidation = [
	body('text', 'Введите текст твита')
		.isString()
		.isLength({ min: 6, 	max: 280 }).withMessage('Длина текста твита может быть от 6 до 280 символов')
]


export default tweetCreationValidation
