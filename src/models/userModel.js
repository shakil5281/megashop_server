const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: [true, "First name cannot be blank"],
    capitalize: true,
    minlength: 3,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: [true, "First name cannot be blank"],
    capitalize: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: [true, "Email cannot be blank"],
    lowercase: true,
    unique: [true, "Email already exists"],
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: [true, "Phone number cannot be blank"],
    match: /^(\+?88)?01[0-9]{9}$/
  },
  password: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (value) {
          // Check for at least one uppercase letter
          return /[A-Z]/.test(value);
        },
        message: 'Password must contain at least one uppercase letter'
      },
      {
        validator: function (value) {
          // Check for at least one lowercase letter
          return /[a-z]/.test(value);
        },
        message: 'Password must contain at least one lowercase letter'
      },
      {
        validator: function (value) {
          // Check for at least one number
          return /[0-9]/.test(value);
        },
        message: 'Password must contain at least one number'
      },
      {
        validator: function (value) {
          // Check for minimum length of 8 characters
          return value.length >= 8;
        },
        message: 'Password must be at least 8 characters long'
      }
    ]
  },

  // photo: {
  //   type: String,
  //   required: true,

  //   validate: {
  //     validator: function(v) {
  //       return /\.(jpeg|jpg|gif|png)$/.test(v);
  //     },
  //     message: props => `${props.value} is not a valid image URL`
  //   }
  // },

  role: {
    type: String,
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  cart: {
    type: Array,
    default: []
  },
  address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  refreshToken: {
    type: String,
  }

}, { versionKey: false, timestamps: true });



UserSchema.pre('save', function (next) {
  this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSaltSync(12);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)

}


const User = mongoose.model("User", UserSchema);
module.exports = User;