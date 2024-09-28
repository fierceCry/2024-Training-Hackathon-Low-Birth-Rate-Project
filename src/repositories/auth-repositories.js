export class AuthRepository {
  constructor(userModel, refreshTokenModel) {
    this.userModel = userModel;
    this.refreshTokenModel = refreshTokenModel;
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

  async token(id, hashRefreshToken) {
    const newToken = new this.refreshTokenModel({
      userId: id,
      token: hashRefreshToken,
    });
    return newToken.save();
  }
}
