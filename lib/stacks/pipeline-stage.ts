// lib/stacks/pipeline-stage.ts
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StorageStack } from './storage-stack';
import { BuildIamUpdateStack } from './build-iam-stack';
import { NotificationStack } from './notification_stack';
import { CloudTrailToS3Stack } from './cloudtrail_to_s3_stack';
import { CloudFormationFailureNotifierStack } from './cloudtrail_lambda_sns_notifier';


export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new StorageStack(this, 'StorageStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

    new BuildIamUpdateStack(this, 'BuildIamUpdateStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

    new NotificationStack(this, 'NotificationStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

    new CloudTrailToS3Stack(this, 'CloudTrailToS3Stack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

    new CloudFormationFailureNotifierStack(this, 'CloudFormationFailureNotifierStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    }); 

  }
}