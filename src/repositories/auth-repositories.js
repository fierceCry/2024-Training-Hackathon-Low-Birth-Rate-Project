export class AuthRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async findUserById({ id }) {
    return this.userModel.findOne({ id }).exec();
  }

  async findByUserName({ username }) {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser({ id, hashedPassword, username }) {
    const newUser = new this.userModel({
      id,
      password: hashedPassword,
      username,
    });
    return newUser.save();
  }
}
