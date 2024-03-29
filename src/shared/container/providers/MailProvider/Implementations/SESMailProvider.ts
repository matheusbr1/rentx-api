import { IMailProvider } from "../IMailProvider";
import aws, { SES } from 'aws-sdk'
import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

class SESMailProvider implements IMailProvider {
  private client: Transporter

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION
      })
    })
  }

  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    const myemail = 'noreplayer@rentx.com.br'

    await this.client.sendMail({
      to,
      from: `Rentx <${myemail}>`,
      subject,
      html: templateHTML
    })
  }
}

export { SESMailProvider }