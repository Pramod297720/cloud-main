import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({ region: process.env.AWS_REGION });
const TopicArn = process.env.SNS_TOPIC_ARN;

export async function notify(subject, payload) {
    const Message = JSON.stringify(payload, null, 2);
    await sns.send(new PublishCommand({ TopicArn, Subject: subject, Message }));
}
