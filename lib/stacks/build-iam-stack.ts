import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BuildIamUpdateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 既存の IAM Role を参照
    const codeBuildRole = iam.Role.fromRoleName(this, 'ImportedCodeBuildRole', 'PipelineStack-CodeBuildServiceRoleA9C1F6A8-OThxR01foKH6');

    // SQS 作成権限を追加
    codeBuildRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        "sqs:CreateQueue",
        "sqs:GetQueueAttributes",
        "sqs:SetQueueAttributes",
        "sqs:TagQueue"
      ],
      resources: ["*"]
    }));

    // Lambda 関数作成権限を追加
    codeBuildRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:TagResource",
        "iam:PassRole" // Lambda に IAM Role を渡すために必要
      ],
      resources: ["*"]
    }));
  }
}