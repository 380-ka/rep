import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class IntentionalDeployFailureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 存在しないランタイムを指定してLambdaを作成（デプロイ失敗を意図）
    new lambda.Function(this, 'BrokenLambdaFunction', {
      runtime: lambda.Runtime.of('nonexistent-runtime'), // ← 存在しないランタイム
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => { return "Hello"; };'),
    });
  }
}