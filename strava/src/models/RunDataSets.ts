import mongoose, { Schema, Document } from "mongoose";

interface IRunDataSet extends Document {
  name: string;
  dataset: Array<any>;
}
// run dataset
const runDataSetSchema = new Schema({
  name: String,
  dataset: [
    Schema.Types.Mixed 
  ]
})



export default mongoose.model<IRunDataSet>("RunDataSet", runDataSetSchema);
