// backend/queues/sns.js
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({
    region: process.env.AWS_REGION || 'us-east-1',
});

export async function notify(subject, payload, topicArn = process.env.SNS_TOPIC_ARN) {
    if (!topicArn) return { skipped: true };

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
    const cmd = new PublishCommand({
        TopicArn: topicArn,
        Subject: (subject || 'Notification').slice(0, 100),
        Message: message,
    });

    const res = await sns.send(cmd);
    return { messageId: res.MessageId };
}
