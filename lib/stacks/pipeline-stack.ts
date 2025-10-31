import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { PipelineStage } from './pipeline-stage';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // GitHubトークンの取得
    const githubToken = secretsmanager.Secret.fromSecretNameV2(this, 'GitHubToken', 'github-token');

    // GitHubリポジトリ情報
    const repo = '380-ka/rep';
    const branch = 'main';

    // IAMロールの作成（CodeBuild用）
    const codeBuildRole = new iam.Role(this, 'CodeBuildServiceRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    // 必要なポリシー（最小権限化推奨）
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'));
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonVPCFullAccess'));
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'));
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess'));
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'));
    codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'));

    // Semgrepによるセキュリティチェックステップ
    const sastStep = new CodeBuildStep('SemgrepScan', {
      input: CodePipelineSource.gitHub(repo, branch, {
        authentication: githubToken.secretValueFromJson('github-token'),
      }),
      commands: [
        'n 20.19.5',
        'ln -sf /usr/local/n/versions/node/20.19.5/bin/node /usr/bin/node',
        'ln -sf /usr/local/n/versions/node/20.19.5/bin/npm /usr/bin/npm',
        'npm install -g npm@11',
        'npm ci',
        'pip install semgrep',
        'semgrep --config=auto .'
      ],
      role: codeBuildRole,
      buildEnvironment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
    });

    // Synthステップ（ビルド・テスト・CDK合成）
    const synthStep = new CodeBuildStep('Synth', {
      input: CodePipelineSource.gitHub(repo, branch, {
        authentication: githubToken.secretValueFromJson('github-token'),
      }),
      commands: [                    
        'n 20.19.5',                            
        'ln -sf /usr/local/n/versions/node/20.19.5/bin/node /usr/bin/node',
        'ln -sf /usr/local/n/versions/node/20.19.5/bin/npm /usr/bin/npm',
        'node -v',
        'npm -v',
        'npm install -g npm@11',
        'npm ci',
        'npm audit fix',
        'npm run lint',
        'npm run build',
        'npm test',
        'npx cdk synth'
      ],
      role: codeBuildRole,
      buildEnvironment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
    });

    // パイプラインの定義
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'Service-Pipeline',
      synth: synthStep,
    });

    // セキュリティチェックWaveの追加（Synthの前に実行）
    pipeline.addWave('SecurityChecks', {
      pre: [sastStep],
    });

    // デプロイステージの追加
    const deploy = new PipelineStage(this, "Deploy");
    pipeline.addStage(deploy);
  }
}