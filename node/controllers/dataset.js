const RunDataSet = require("../models/RunDataSets");
const RideDataSet = require("../models/RideDataSet");



// exports datasets to frontend
exports.dataSet = async (req, res) => {
  const marathon = await RunDataSet.find({ name: "marathon" });
  const half = await RunDataSet.find({ name: "half marathon" });
  const hardknott= await RideDataSet.find({ name: "Hardknott pass" });
  const scotland= await RideDataSet.find({ name: "Bealach-na-ba" });
  const alpe = await RideDataSet.find({ name: "Alpe du zwift" });
  const box = await RideDataSet.find({ name: "Box Hill" });
  res.send({ marathon, half,  hardknott, scotland, alpe, box });
};


const fs = require("fs").promises;
const path = require("path");

exports.dataSetWrite = async (req, res) => {
  try {
    const marathon = await RunDataSet.find({ name: "marathon" });
    const half = await RunDataSet.find({ name: "half marathon" });
    const hardknott = await RideDataSet.find({ name: "Hardknott pass" });
    const scotland = await RideDataSet.find({ name: "Bealach-na-ba" });


    const data = { marathon, half, hardknott, scotland, alpe, boxHill };
    const filePath = path.join(__dirname, "data.json");

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    res.status(200).json({ message: "Data written to file", filePath });
  } catch (error) {
    console.error("Error writing data:", error);
    res.status(500).json({ error: "Failed to write data to file" });
  }
};