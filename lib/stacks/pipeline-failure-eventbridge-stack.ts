import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';

export class PipelineFailureEventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 既存のSNSトピックをARNで参照
    const existingTopic = sns.Topic.fromTopicArn(this, 'ExistingPipelineFailureTopic',
      'arn:aws:sns:ap-northeast-1:266735847975:Deploy-NotificationStack-CloudFormationFailureTopic8879BAD9-rkXNaq2bRYNW'
    );

    // CodePipelineの失敗イベントを検知するEventBridgeルール
    new events.Rule(this, 'PipelineFailureRule', {
      eventPattern: {
        source: ['aws.codepipeline'],
        detailType: ['CodePipeline Pipeline Execution State Change'],
        detail: {
          state: ['FAILED']
        }
      },
      targets: [new targets.SnsTopic(existingTopic)]
    });
  }
}