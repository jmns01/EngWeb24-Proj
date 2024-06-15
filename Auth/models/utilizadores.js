import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    level: {type: String, required: true},
    dateCreated: {type: Date, required: true},
    lastAccess: {type: Date, required: true}
}, {collection: 'users', versionKey: false})

export default mongoose.model('user', modelSchema)