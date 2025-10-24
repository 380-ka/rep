// bin/main.ts
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { PipelineStack } from '../lib/stacks/pipeline-stack';

const app = new cdk.App();
const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION,
  }
});

app.synth();;