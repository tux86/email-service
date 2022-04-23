import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '../sqs/sqs.decorators';
import { Message } from '@aws-sdk/client-sqs';
import awsConfig from '../../../config/aws.config';
import { SESService } from './ses.service';
import { SendEmailParameters } from './dtos/send-email-parameters';

const EmailQueueName = awsConfig.sqs.queueNames.emailQueue;

@Injectable()
export class SesMessageHandler {
  private readonly logger = new Logger(SesMessageHandler.name);

  constructor(private readonly sesService: SESService) {
    this.logger.debug('SesMessageHandler initialized');
  }

  @SqsMessageHandler(EmailQueueName)
  async handleMessage(message: Message) {
    try {
      const parameters: SendEmailParameters = JSON.parse(message.Body);
      await this.sesService.sendEmailSync(parameters);
    } catch (error) {
      this.logger.error('failed to send email');
    }
  }
}