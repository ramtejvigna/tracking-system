import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    clockIn: {
        type: Date,
        required: true
    },
    clockOut: {
        type: Date
    },
    totalHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        default: "absent"
    }
}, {
    timestamps: true
});

attendanceSchema.pre("save", function(next) {
    if (this.clockIn && this.clockOut) {
        const totalMs = this.clockOut - this.clockIn;
        this.totalHours = Number((totalMs / (1000 * 60 * 60)).toFixed(2));
    }
    next();
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);