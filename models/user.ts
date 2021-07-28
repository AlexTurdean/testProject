import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;

export interface IShift extends Document {
    date: Date;
    hour: number;
}

export interface IUser extends Document {
    name: string;
    password: string;
    shifts?: Array<IShift>;
    isPasswordValid(this: IUser, password: string): boolean;
}


const UserSchema = new Schema({
    name: { type: String, required: true , unique: true },
    password: { type: String, required: true },
    shifts: [
        {
            date: { type: Date, required: true},
            hour: { type: Number, enum: {values: ['0', '8', '16'], message: 'Hours accepts are 0,8,16'}, required: true }
        },
        { required: false }
    ]
});

UserSchema.pre('save', function(this: IUser, next: any) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});

UserSchema.methods.isPasswordValid = function (this: IUser, password: string) {
    return bcrypt.compareSync(password, this.password);
};

const UserModel = model<IUser>('User', UserSchema);
export default UserModel;
