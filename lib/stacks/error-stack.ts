// lib/stacks/storage-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class ErrorStorageStack extends cdk.Stack {
  public readonly testBucket: s3.Bucket;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // test bucket
    this.testBucket = new s3.Bucket(this, 'ArtifactBucket', {
      bucketName: "dev-bjm-test-cdk-bucket-20251014",
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, 
    });
  }
}