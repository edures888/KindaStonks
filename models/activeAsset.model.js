import mongoose from 'mongoose';
import { assetSchema } from './asset.model.js';

const ActiveAsset = mongoose.model('ActiveAsset', assetSchema);
export default ActiveAsset;
