import { inject, injectable } from "tsyringe"
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository"
import { compare } from 'bcrypt'
import { sign } from "jsonwebtoken"
import { AppError } from "@errors/AppError"

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: {
    name: string
    email: string
  }
  token: string
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Email or password incorrect')
    }

    // const passwordMatch = await compare(password, user.password)

    const passwordMatch = password === user.password

    if(!passwordMatch) {
      throw new AppError('Email or password incorrect')
    }

    // JWT
    const token = sign({}, 'f5ee2251a2d7c1defe64c9bad2d45493', {
      subject: user.id,
      expiresIn: "1d"
    })

    return {
      user: {
        name: user.name,
        email: user.email
      },
      token
    }
  } 
}

export { AuthenticateUserUseCase }