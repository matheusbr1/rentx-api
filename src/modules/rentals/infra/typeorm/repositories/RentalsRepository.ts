import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>

  constructor() {
    this.repository = getRepository(Rental)
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const openByCar = await this.repository.findOne({ 
      where: { car_id, end_date: null }, 
    })
    return openByCar
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openByUser = await this.repository.findOne({
      where: { user_id, end_date: null }
    })
    return openByUser
  }

  async create({ 
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total
   }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({ 
      car_id,
      user_id,
      expected_return_date,
      id,
      end_date,
      total
     })

    await this.repository.save(rental)

    return rental
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id)

    return rental
  }

  // async findByUser(user_id: string): Promise<Rental[]> {
  //   const rentals = await this.repository.find({
  //     where: { user_id },
  //     relations: ["car"],
  //   })

  //   return rentals
  // }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentalsQuery = await this.repository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.car', 'c')
      .leftJoinAndSelect('c.images', 'i')
      .where("r.user_id = :id", { id: user_id })  

    const rentals = await rentalsQuery.getMany()

    return rentals
  }
}

export { RentalsRepository }