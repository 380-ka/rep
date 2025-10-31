import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';

export class CloudFormationFailureEventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 既存のSNSトピックをARNで参照
    const existingTopic = sns.Topic.fromTopicArn(this, 'ExistingFailureTopic',
      'arn:aws:sns:ap-northeast-1:266735847975:Deploy-NotificationStack-CloudFormationFailureTopic8879BAD9-rkXNaq2bRYNW'
    );

    // CloudFormationの失敗イベントを検知するEventBridgeルール
    new events.Rule(this, 'CloudFormationFailureRule', {
      eventPattern: {
        source: ['aws.cloudformation'],
        detailType: ['CloudFormation Stack Status Change'],
        detail: {
          status: ['ROLLBACK_IN_PROGRESS', 'ROLLBACK_COMPLETE', 'DELETE_FAILED']
        }
      },
      targets: [new targets.SnsTopic(existingTopic)]
    });
  }
}