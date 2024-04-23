import { Schema, model }  from 'mongoose';

const photoSchema = new Schema({
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: Schema.Types.ObjectId,
    userName: String,
}, {
    timestamps: true
});

export const Photo = model('Photo', photoSchema);