
import 'reflect-metadata'
import 'dotenv/config'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import "express-async-errors"
import createConnection from "@shared/infra/typeorm" // Database
import "@shared/container"
import swaggerUI from 'swagger-ui-express'
import swaggerFile from '../../../swagger.json'
import { router } from './routes'
import { AppError } from '@shared/errors/AppError'
import upload from '@config/upload'

// Criando conexão com o banco de dados
createConnection()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
app.use('/cars', express.static(`${upload.tmpFolder}/cars`))

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.use(router)

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  return response.status(500).json({
    status: "error",
    message: `Interna server error - ${err.message}`
  })
})


export { app }