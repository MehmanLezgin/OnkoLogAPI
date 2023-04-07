const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usedDrugSchema = new Schema({
    id: { type: Number, required: true },
    amount: { type: Number, required: true }
});

const patientSchema = new Schema({
    name: { type: String, required: true },
    birthday: { type: Number, required: false, default: 0 },
    card: { type: Number, required: false, default: 0 },
    scheme: { type: String, required: false, default: "" },
    diagnosis: { type: String, required: false, default: "" },
    drugs: [{ type: usedDrugSchema, required: false }],
    version: { type: Number, required: true, default: 0 }
});

const Project = mongoose.model('Patient', patientSchema);
module.exports = Project;

/*
{
    "name": "name",
    "birthday": 1956,
    "card": 3241,
    "scheme": "AT",
    "diagnosis": "LOL",
    "drug": [
        {
            "id": 0,
            "amount": 3
        },
        {
            "id": 3,
            "amount": 1
        }
    ]
}
*/