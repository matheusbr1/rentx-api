import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import  { v4 as uuidV4 } from 'uuid'
import { CarImage } from './CarImage'
import { Category } from './Category'
import { Specification } from './Specification'
@Entity('cars')
class Car {
  @PrimaryColumn()
  id: string
  
  @Column()
  name: string
  
  @Column()
  description: string
  
  @Column()
  daily_rate: number
  
  @Column()
  available: boolean
  
  @Column()
  license_plate: string
  
  @Column()
  fine_amount: number
  
  @Column()
  brand: string
  
  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category

  @OneToMany(type => CarImage, image => image.car)
  images: CarImage[]
 
  @Column()
  category_id: string

  @ManyToMany(() => Specification)
  @JoinTable({
    name: 'specifications_cars',
    joinColumns: [{ name: 'car_id' }],
    inverseJoinColumns: [{ name: 'specification_id' }]
  })
  specifications: Specification[]
  
  @CreateDateColumn()
  created_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
      this.available = true
    }
  }
}

export { Car }