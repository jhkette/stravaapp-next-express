import mongoose, { Schema, Document } from "mongoose";
interface IRideDataSet extends Document {
  name: string;
  dataset: mongoose.Mixed[];
}
// ride dataset
const rideDataSetSchema = new Schema({
  name: String,
  dataset: { type: [Schema.Types.Mixed] },
})



const RideDataSet = mongoose.models.RideDataSet ||mongoose.model <IRideDataSet>("RideDataSet", rideDataSetSchema);
export default RideDataSet