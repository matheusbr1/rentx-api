import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental"
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository"
import { AppError } from "@shared/errors/AppError"
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { inject, injectable } from 'tsyringe'

dayjs.extend(utc)

interface IRequest {
  user_id: string
  car_id: string
  expected_return_date: Date
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    
    @inject('DayJsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const minHour = 24

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id)

    if (carUnavailable) {
      throw new AppError('Car is unavailable')
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id)

    if (rentalOpenToUser) {
      throw new AppError('There is a rental in progress for this user')
    }
    
    const dateNow = this.dateProvider.dateNow()

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    )

    if(compare < minHour) {
      throw new AppError('Invalid return time')
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date
    })

    return rental
  }
}

export { CreateRentalUseCase }