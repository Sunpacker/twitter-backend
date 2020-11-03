import { model, Schema, Document } from 'mongoose'

export interface IUser {
	_id?: string;
	email: string;
	fullname: string;
	username: string;
	password: string;
	confirmHash: string;
	confirmed: Boolean;
	location?: string;
	about?: string;
	website?: string;
}
export type IUserDocument = IUser & Document

const UserSchema = new Schema<IUser>({
	email: {
		unique: true,
		required: true,
		type: String
	},
	fullname: {
		required: true,
		type: String
	},
	username: {
		unique: true,
		required: true,
		type: String
	},
	password: {
		required: true,
		type: String
	},
	confirmed: {
		type: Boolean,
		default: false
	},
	confirmHash: {
		required: true,
		type: String
	},
	location: String,
	about: String,
	website: String,
})

UserSchema.set('toJSON', {
	transform(_, obj) {
		delete obj.password
		delete obj.confirmHash
		return obj
	}
})

export default model<IUserDocument>('User', UserSchema)
