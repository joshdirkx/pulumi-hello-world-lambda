import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const lambdaRole = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "lambda.amazonaws.com"
  })
});

const lambda = new aws.lambda.Function("lambda", {
  role: lambdaRole.arn,
  handler: "index.handler",
  runtime: aws.lambda.NodeJS12dXRuntime,
  code: new pulumi.asset.AssetArchive({
    "index.js": new pulumi.asset.StringAsset(
      "exports.handler = (e, c, cb) => cb(null, {statusCode: 200, body: 'Hello, world!'});",
    ),
  }),
});

const lambdaFunctionUrl = new aws.lambda.FunctionUrl("lambdaFunctionUrl", {
  functionName: lambda.arn,
  authorizationType: "NONE",
});

export const lambdaUrl = lambdaFunctionUrl.functionUrl;