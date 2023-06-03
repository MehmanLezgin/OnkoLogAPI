const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usedDrugSchema = new Schema({
    id: { type: Number, required: true },
    amount: { type: Number, required: true }
});

const therapySchema = new Schema({
    date: { type: Number, required: false },
    drugs: [{ type: usedDrugSchema, required: false }]
})

const patientSchema = new Schema({
    name: { type: String, required: true },
    birthday: { type: Number, required: false, default: 0 },
    card: { type: Number, required: false, default: 0 },
    scheme: { type: String, required: false, default: "" },
    diagnosis: { type: String, required: false, default: "" },
    therapy: [{ type: therapySchema, required: false }],
    version: { type: Number, required: true, default: 0 }
});

const Drug = new Schema({
    id: { type: Number, required: true },
    remainder: { type: Number, required: true, default: 0 },
    income: { type: Number, required: true, default: 0 },
    version: { type: Number, required: true, default: 0 }
});

const settingsSchema = new Schema({
    shared_to: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const projectSchema = new Schema({
    name: { type: String, required: true },
    patients: [{ type: patientSchema, required: true }],
    drugs: [{ type: Drug, required: true }],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    settings: { type: settingsSchema, required: true, default: { shared_to: [] } }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'editedAt' } });

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