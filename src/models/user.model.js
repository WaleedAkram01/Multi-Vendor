import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    //   password: {
    //     type: String,
    //     required: function () {
    //       return !this.googleId;
    //     },
    //     select: false,
    //   },

    //   role: {
    //     type: String,
    //     enum: ["CUSTOMER", "VENDOR", "ADMIN", "SUPER_ADMIN"],
    //     default: "CUSTOMER",
    //   },

    //   avatar: {
    //     url: {
    //       type: String,
    //       default: "",
    //     },
    //     publicId: {
    //       type: String,
    //       default: "",
    //     },
    //   },

    //   isEmailVerified: {
    //     type: Boolean,
    //     default: false,
    //   },

    //   isActive: {
    //     type: Boolean,
    //     default: true,
    //   },

    //   googleId: {
    //     type: String,
    //     default: null,
    //   },

    //   refreshTokens: [
    //     {
    //       tokenHash: {
    //         type: String,
    //         required: true,
    //       },
    //       device: {
    //         type: String,
    //         default: "Unknown Device",
    //       },
    //       createdAt: {
    //         type: Date,
    //         default: Date.now,
    //       },
    //     },
    //   ],

    //   passwordChangedAt: {
    //     type: Date,
    //   },

    //   passwordResetToken: {
    //     type: String,
    //   },

    //   passwordResetExpires: {
    //     type: Date,
    //   },
  },

  {
    timestamps: true,
  },
);
// ***********************MONGOOSE MIDDLEWARE/HOOKS *******************************
//HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//COMPARE PASSWORD METHOD
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);

export default User;
