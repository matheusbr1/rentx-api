import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRentals1650635306080 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'rentals',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'car_id',
                        type: 'uuid'
                    },
                    {
                        name: 'user_id',
                        type: 'uuid'
                    },
                    {
                        name: 'start_date',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'end_date',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'expected_return_date',
                        type: 'timestamp',
                    },
                    {
                        name: 'total',
                        type: 'numeric',
                        isNullable: true
                    }, 
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKCarRental', // Nome da chave estrangeira
                        referencedTableName: 'cars', // Tabela origem
                        referencedColumnNames: ['id'], // Nome do campo na tabela origem
                        columnNames: ['car_id'], // Nome do campo na tabela destino
                        onDelete: 'SET NULL',
                        onUpdate: 'SET NULL'
                    },
                    {
                        name: 'FKUserRental', // Nome da chave estrangeira
                        referencedTableName: 'users', // Tabela origem
                        referencedColumnNames: ['id'], // Nome do campo na tabela origem
                        columnNames: ['user_id'], // Nome do campo na tabela destino
                        onDelete: 'SET NULL',
                        onUpdate: 'SET NULL'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('rentals')
    }

}
