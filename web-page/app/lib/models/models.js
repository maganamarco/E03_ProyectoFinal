import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        school: String,
        sex: String,
        age: Number,
        address: String,
        famsize: String,
        Pstatus: String,
        Medu: Number,
        Fedu: Number,
        Mjob: String,
        Fjob: String,
        reason: String,
        guardian: String,
        traveltime: Number,
        studytime: Number,
        failures: Number,
        schoolsup: String,
        famsup: String,
        paid: String,
        activities: String,
        nursery: String,
        higher: String,
        internet: String,
        romantic: String,
        famrel: Number,
        freetime: Number,
        goout: Number,
        Dalc: Number,
        Walc: Number,
        health: Number,
        absences: Number,
        G1: Number,
        G2: Number,
        G3: Number
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.models.Task || mongoose.model("Students", studentSchema);

export default Student;