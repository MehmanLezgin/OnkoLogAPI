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
    drugs: [{ type: usedDrugSchema, required: false }]
});

const drugSchema = new Schema({
    id: { type: Number, required: true },
    remainder: { type: Number, required: true },
    income: { type: Number, required: true }
});

const projectSchema = new Schema({
    name: { type: String, required: true },
    patients: [{ type: patientSchema, required: true, default: 0 }],
    drugs: [{ type: drugSchema, required: true, default: 0 }],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now, default: 0 },
    editedAt: { type: Date, default: Date.now, default: 0 },
    version: { type: Number, required: false }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
/*{
    [
        patients: [
            {
                name: "Name",
                birthDate: 1959,
                scheme: "AC",
                diagnosis: "Some diagnosis",
                drugs: [
                    [0, 3],
                    [3, 1]
                ]
            }
        ],
        drugs: [
            [0, 13, 42],
            [1, 29, 32]
        ],
        
    ]
}*/