import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BuildIamUpdateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const codeBuildRole = iam.Role.fromRoleName(this, 'ImportedCodeBuildRole', 'arn:aws:iam::266735847975:role/PipelineStack-CodeBuildServiceRoleA9C1F6A8-9JGfRJ5yVo8Q');

    codeBuildRole.addToPrincipalPolicy(new iam.PolicyStatement({
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