import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    // すべてのスタックを削除する場合は、ここを空にする
    // 例: new StorageStack(...) や new Ec2Stack3(...) を削除
  }
}