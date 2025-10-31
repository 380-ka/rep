import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';

export class CodeBuildFailureEventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 既存のSNSトピックをARNで参照
    const existingTopic = sns.Topic.fromTopicArn(this, 'ExistingCodeBuildFailureTopic',
      'arn:aws:sns:ap-northeast-1:266735847975:Deploy-NotificationStack-CloudFormationFailureTopic8879BAD9-rkXNaq2bRYNW'
    );

    // CodeBuildの失敗イベントを検知するEventBridgeルール
    new events.Rule(this, 'CodeBuildFailureRule', {
      eventPattern: {
        source: ['aws.codebuild'],
        detailType: ['CodeBuild Build State Change'],
        detail: {
          'build-status': ['FAILED']
        }
      },
      targets: [new targets.SnsTopic(existingTopic)]
    });
  }
}