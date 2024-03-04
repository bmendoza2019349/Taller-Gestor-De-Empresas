import mongoose, { Schema } from "mongoose";

const companiSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "name is required"]
    },
    businessActivity: {
        type: String,
        require: [true, "creationDate is required"]
    },
    yearsOfExperience: {
        type: Number,
        require: [true, "yearsOfExperience is required"]
    },
    impactLevel: {
        type: String,
        require: [true, "impactLevel is required"]
    },
    businessCategory: {
        type: String,
        require: [true, "businessCategory is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The User is mandatory']
    }
});

companiSchema.methods.toJSON = function () {
    const { __v, _id, ...companies } = this.toObject();
    companies.uid = _id;
    return companies;
  };

  export default mongoose.model('Compani', companiSchema);