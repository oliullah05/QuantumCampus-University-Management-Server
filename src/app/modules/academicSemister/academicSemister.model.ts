import { Schema, model } from 'mongoose';
import { academicSemisterCode, academicSemisterMonth, academicSemisterName } from './academicSemister.constant';
import { TAcademicSemister } from './academicSemister.interface';






const academicSemesterSchema = new Schema<TAcademicSemister>({
    name: { type: String, enum: academicSemisterName, required: true, trim: true },
    code: { type: String, enum: academicSemisterCode, required: true },
    year: { type: String, required: true },
    startMonth: { type: String, enum: academicSemisterMonth, required: true, },
    endMonth: { type: String, enum: academicSemisterMonth, required: true },
}, {
    timestamps: true
});

// academicSemesterSchema.index({ name: 1, year: 1 }, { unique: true })

academicSemesterSchema.pre("save", async function (next) {
    const isSemisterExits = await AcademicSemester.findOne({
        name: this.name,
        year: this.year
    })
    if (isSemisterExits) {
        throw new Error("Semister is alrady exits")
    }

})


export const AcademicSemester = model<TAcademicSemister>("AcademicSemister", academicSemesterSchema)