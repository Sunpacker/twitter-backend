import { body } from 'express-validator'


const registerValidation = [
	body('email', 'Введите E-Mail')
		.isEmail().withMessage('Неверный формат E-Mail')
		.isLength({ min: 10, 	max: 32 }).withMessage('Длина почты может быть от 10 до 32 символов'),
	body('fullname', 'Введите имя')
		.isString().withMessage('Неверный формат имени')
		.isLength({ min: 2, 	max: 16 }).withMessage('Длина имени может быть от 2 до 16 символов'),
	body('username', 'Введите логин')
		.isString().withMessage('Неверный формат логина')
		.isLength({ min: 2, 	max: 16 }).withMessage('Длина логина может быть от 2 до 16 символов'),
	body('password', 'Введите пароль')
		.isString().withMessage('Неверный формат пароля')
		.isLength({ min: 6, 	max: 32 }).withMessage('Длина пароля может быть от 6 до 32 символов')
		.custom((value, { req }) => {
			if(value !== req.body.passwordRepeat) {
				throw new Error('Пароли не совпадают')
			} else {
				return value
			}
		}),
]


export default registerValidation
