
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class NotificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create SNS Topic
    const topic = new sns.Topic(this, 'CloudFormationFailureTopic', {
      displayName: 'CloudFormation Failure Notifications'
    });

    // Add email subscription
    topic.addSubscription(new subscriptions.EmailSubscription('kasai.kazumasa@fujitsu.com'));
  }
}
