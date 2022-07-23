import AWS from 'aws-sdk';
import { exec } from 'child_process';
const ec2 = new AWS.EC2();
const InstanceId = process.env.AWS_EC2 || ""

export async function ec(folder: string, startAndStop = true) {
  if (startAndStop) await ec2Start()
  let ip: string = "";
  while (!ip) {
    const data = await ec2.describeInstances({ InstanceIds: [InstanceId] }).promise()
    ip = data?.Reservations![0].Instances![0].PublicIpAddress ?? ""
    await new Promise(resolve => setTimeout(resolve, 4000))
  }
  await new Promise((resolve) => exec(`ssh -i "mac.cer" ubuntu@${ip} ". /home/ubuntu/.nvm/nvm.sh ; cd content ; yarn start remtik,uptik ${folder}"`, (err, stdout, stderr) => {
    console.log(stdout, err, stderr);
    resolve("")
  }))
  if (startAndStop) await ec2Stop()
}
export async function ec2Start() {
  console.log("Starting...")
  await ec2.startInstances({ InstanceIds: [InstanceId] }).promise()
  console.log("started")

}

export async function ec2Stop() {
  console.log("Stopping...")
  await ec2.stopInstances({ InstanceIds: [InstanceId] }).promise()
  console.log("stopped")
}
