import { model, Schema, Document } from 'mongoose'
import { IUserModel } from './UserModel'


export interface ITweetModel {
	_id?: string;
	text: string;
	user: IUserModel;
}
export type ITweetModelDocument = ITweetModel & Document

const TweetSchema = new Schema<ITweetModel>({
	text: {
		required: true,
		type: String,
		minlength: 6,
		maxlength: 280
	},
	user: {
		required: true,
		ref: 'User',
		type: Schema.Types.ObjectId
	},
})


export default model<ITweetModelDocument>('Tweet', TweetSchema)
