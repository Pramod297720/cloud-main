import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: process.env.AWS_REGION });

export async function notify(subject, payload) {
    try {
        await sns.send(new PublishCommand({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Subject: subject,
            Message: JSON.stringify(payload, null, 2),
        }));
        console.log(`SNS: ${subject} sent`);
    } catch (err) {
        console.error("SNS error:", err);
    }
}
