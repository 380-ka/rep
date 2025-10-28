import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
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

    // パイプラインの定義
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'Service-Pipeline',
      synth: new CodeBuildStep('Synth', {
        input: CodePipelineSource.gitHub(repo, branch, {
          authentication: githubToken.secretValueFromJson('github-token'),
        }),
        commands: [
          'npm ci',                // 依存関係インストール
          'npm run lint',          // コード品質チェック
          'npm test',              // ユニットテスト実行
          'npm audit --production',// セキュリティチェック
          'npm run build',         // ビルド
          'npx cdk synth'          // CDK合成
        ],
        role: codeBuildRole,
      }),
    });

    // デプロイステージの追加
    const deploy = new PipelineStage(this, "Deploy");
    pipeline.addStage(deploy);
  }
}