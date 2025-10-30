
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';

export class CloudFormationFailureNotifierStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CloudWatch Log Group with 1-week retention
    const logGroup = new logs.LogGroup(this, 'CloudTrailLogGroup', {
      logGroupName: '/aws/cloudtrail/logs',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Lambda function to process log events
    const notifierFunction = new lambda.Function(this, 'FailureNotifierFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { SNS } = require('aws-sdk');
        const sns = new SNS();
        const topicArn = 'arn:aws:sns:ap-northeast-1:266735847975:Deploy-NotificationStack-CloudFormationFailureTopic8879BAD9-SmhcIJKVAzVj';

        exports.handler = async (event) => {
          const payload = Buffer.from(event.awslogs.data, 'base64');
          const json = JSON.parse(payload.toString('utf8'));

          const failedEvents = json.logEvents.filter(log => log.message.includes('CloudFormation') && log.message.includes('FAILED'));

          for (const log of failedEvents) {
            await sns.publish({
              Message: `CloudFormation failure detected: ${log.message}`,
              TopicArn: topicArn
            }).promise();
          }

          return { statusCode: 200 };
        };
      `),
      timeout: cdk.Duration.seconds(30),
    });

    // Permissions for Lambda to publish to SNS
    notifierFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: ['arn:aws:sns:ap-northeast-1:266735847975:Deploy-NotificationStack-CloudFormationFailureTopic8879BAD9-SmhcIJKVAzVj']
    }));

    // Permissions for Lambda to be invoked by CloudWatch Logs
    notifierFunction.addPermission('AllowCWLogsInvoke', {
      principal: new iam.ServicePrincipal('logs.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: logGroup.logGroupArn,
    });

    // Create subscription filter to trigger Lambda on CloudFormation failure logs
    new logs.SubscriptionFilter(this, 'FailureLogFilter', {
      logGroup,
      destination: new destinations.LambdaDestination(notifierFunction),
      filterPattern: logs.FilterPattern.allTerms('CloudFormation', 'FAILED'),
    });
  }
}
