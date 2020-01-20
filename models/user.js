var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: /\S+@\S+\.\S+/
  },
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    required: true,
    trim: true
  }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if(this.password && this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = function(password) {
   return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema);

