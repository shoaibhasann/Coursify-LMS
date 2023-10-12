import {Schema, model} from 'mongoose';


const miscellaneousSchema = new Schema({
    contactQueries: [
        {
            name: {
                type: String
            },
            email: {
                type: String
            },
            message: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
});

const Miscellaneous = model("Miscellaneous", miscellaneousSchema);

export default Miscellaneous;