import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BuildIamUpdateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 既存の IAM Role を参照
    const codeBuildRole = iam.Role.fromRoleName(this, 'ImportedCodeBuildRole', 'PipelineStack-CodeBuildServiceRoleA9C1F6A8-9JGfRJ5yVo8Q');

    // CloudTrail の権限を追加
    codeBuildRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        "cloudtrail:DescribeTrails",
        "cloudtrail:GetTrailStatus",
        "cloudtrail:LookupEvents",
        "cloudtrail:ListTrails",
        "cloudtrail:GetEventSelectors",
        "cloudtrail:GetInsightSelectors"
      ],
      resources: ["*"]
    }));
  }
}