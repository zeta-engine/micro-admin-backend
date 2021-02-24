import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phoneNumber: { type: String },
  name: { type: String },
  imageUrl: { type: String },
  ranking: { type: String },
}, {timestamps: true, collection: 'players'});