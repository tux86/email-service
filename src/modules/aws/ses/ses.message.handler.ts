import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '../sqs/sqs.decorators';
import { Message } from '@aws-sdk/client-sqs';
import awsConfig from '../../../config/aws.config';
import { SESService } from './ses.service';
import { SendEmailParameters } from './dtos/send-email-parameters';

const EmailQueueName = awsConfig.sqs.emailQueueName;

@Injectable()
export class SesMessageHandler {
  private readonly logger = new Logger(SesMessageHandler.name);

  constructor(private readonly sesService: SESService) {}

  @SqsMessageHandler(EmailQueueName)
  async handleMessage(message: Message) {
    this.logger.debug(
      'sqs message received\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n' +
        JSON.stringify(message, null, 2) +
        '\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n',
    );

    const sendEmailParameters: SendEmailParameters = JSON.parse(message.Body);

    this.logger.debug(
      'ses message \n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n' +
        JSON.stringify(sendEmailParameters, null, 2) +
        '\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n',
    );

    await this.sesService.sendEmailSync(sendEmailParameters);
  }
}
