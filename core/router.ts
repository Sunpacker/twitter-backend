import { Router } from 'express'
import { passport } from './passport'
import { UserController, TweetController } from '../controllers'
import { registerValidation, tweetCreationValidation } from '../validations'


const router: Router = Router()

router.get('/auth/verify', UserController.verify)
router.post('/auth/register', registerValidation, UserController.create)
router.post('/auth/login', passport.authenticate('local'), UserController.afterLogin)

router.get('/users', UserController.index)
router.get('/users/me', passport.authenticate('jwt', { session: false }), UserController.getUserInfo)
router.get('/users/:id', UserController.show)

router.get('/tweets', TweetController.index)
router.get('/tweets/:id', TweetController.show)
router.post('/tweets', passport.authenticate('jwt'), tweetCreationValidation, TweetController.create)
router.delete('/tweets/:id', passport.authenticate('jwt'), TweetController.delete)

export default router
