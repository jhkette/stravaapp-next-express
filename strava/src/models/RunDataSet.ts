import mongoose, { Schema, Document } from "mongoose";

interface IRunDataSet extends Document {
  name: string;
  dataset: mongoose.Mixed[];
}
// run dataset
const runDataSetSchema = new Schema({
  name: String,
  dataset: { type: [Schema.Types.Mixed] },
})




const RunDataSet = mongoose.models.RunDataSet ||mongoose.model <IRunDataSet>("RunDataSet", runDataSetSchema);
export default RunDataSet