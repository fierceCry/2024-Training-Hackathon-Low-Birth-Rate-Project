export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
   
  async findUsers(id){
    return this.usersRepository.findUserId(id)
  }
}
