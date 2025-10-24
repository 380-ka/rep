// lib/stacks/pipeline-stage.ts
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StorageStack } from './storage-stack';
import { Ec2Stack3 } from './ec2-stack3'; 



export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new StorageStack(this, 'StorageStack', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    });

    new Ec2Stack3(this, 'Ec2Stack3', {
      env: { region: process.env.CDK_DEFAULT_REGION },
    }); 
  }
}