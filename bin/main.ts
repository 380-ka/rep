// bin/main.ts
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline-stack';

const app = new cdk.App();

// パイプラインスタックを作成し、変数として保持
const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// ESLint の警告回避のため、最低限使用する
console.log(`PipelineStack created: ${pipelineStack.stackName}`);

app.synth();