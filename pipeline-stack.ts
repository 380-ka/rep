// lib/stacks/pipeline-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { PipelineStage } from './pipeline-stage'; //追記箇所

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Secrets ManagerからGitHubトークンを取得
    const githubToken = secretsmanager.Secret.fromSecretNameV2(this, 'GitHubToken', 'github-token');

    // GitHubリポジトリ情報
    const repo = '380-ka/rep';
    const branch = 'main';

    // パイプラインの定義
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'Service-Pipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(repo, branch, {
          authentication: githubToken.secretValueFromJson('github-token'),
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
    const deploy = new PipelineStage(this, "Deploy"); //追記箇所
    const deployStage = pipeline.addStage(deploy); //追記箇所
  }
}