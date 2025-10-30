// lib/stacks/pipeline-stage.ts
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StorageStack } from './storage-stack';
import { BuildIamUpdateStack } from './build-iam-stack';

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new StorageStack(this, 'StorageStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

    new BuildIamUpdateStack(this, 'BuildIamUpdateStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

  }
}