import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BuildIamUpdateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 既存の IAM Role を参照（Role名は CloudFormation によって生成されたもの）
    const codeBuildRole = iam.Role.fromRoleName(this, 'ImportedCodeBuildRole', 'PipelineStack-CodeBuildServiceRoleA9C1F6A8-OThxR01foKH6');

    // SQS 作成権限を追加
    codeBuildRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        "sqs:CreateQueue",
        "sqs:GetQueueAttributes",
        "sqs:SetQueueAttributes",
        "sqs:TagQueue"
      ],
      resources: ["*"] // 必要に応じて制限可能
    }));
  }
}
