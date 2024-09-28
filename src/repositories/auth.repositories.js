export class AuthRepository {
  constructor(userModel, refreshTokenModel) {
    this.userModel = userModel;
    this.refreshTokenModel = refreshTokenModel;
  }

  async findUserById({ logId }) {
    return this.userModel.findOne({ logId }).exec();
  }

  async findUserByObjectId({ id }) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findByUserName({ username }) {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser({ logId, hashedPassword, username }) {
    const newUser = new this.userModel({
      logId,
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
