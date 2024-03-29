import { Request, Response } from "express";
import { container } from "tsyringe";
import { VerifyPasswordMatchUseCase } from "./verifyPasswordMatchUseCase";

class VerifyPasswordMatchController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.user.id

    const { password } = request.body

    const verifyPasswordMatchUseCase = container.resolve(VerifyPasswordMatchUseCase)

    const isCorrect = await verifyPasswordMatchUseCase.execute(id, password)

    return response.status(200).json({
      isCorrect
    })
  }
}

export { VerifyPasswordMatchController }