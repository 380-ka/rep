// lib/stacks/ec2-stack3.ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Ec2Stack3 extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      ...props,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });

    const vpc = ec2.Vpc.fromLookup(this, 'ImportedVPC', {
      vpcId: 'vpc-0f6dd8e7de893c37a',
    });

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'ImportedSG',
      'sg-071607d78a2af2287'
    );

    const keyPair = ec2.KeyPair.fromKeyPairName(this, 'ImportedKeyPair', 'k-share-key');

    new ec2.Instance(this, 'MyEC2Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-northeast-1': 'ami-041b7189cc3449f92',
      }),
      keyPair,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroup,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: {
            ebsDevice: {
              volumeSize: 10,
              volumeType: ec2.EbsDeviceVolumeType.GP3,
              deleteOnTermination: true,
            },
          },
        },
      ],
      associatePublicIpAddress: true,
    });
  }
}