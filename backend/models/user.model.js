import mongoose from "mongoose";

const User = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		dateCreated: { type: Date, required: true, default: Date.now }
	}, { collection: 'users', timestamps: true }
)

const userModel = mongoose.model('User', User)
export default userModel;