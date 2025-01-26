import mongoose, { Schema, Document } from "mongoose";
interface IRideDataSet extends Document {
  name: string;
  dataset: Array<any>;
}
// ride dataset
const rideDataSetSchema = new Schema({
  name: String,
  dataset: [
    Schema.Types.Mixed 
  ]
})



export default mongoose.model<IRideDataSet>("RunDataSet", rideDataSetSchema);