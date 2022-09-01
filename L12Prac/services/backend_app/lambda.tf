# Create a S3 bucket
resource "aws_s3_bucket" "terraform-homework" {
	bucket = "terraform-serverless-homework-arno"
}

resource "aws_s3_bucket_acl" "terraform-homework" {
  bucket = "terraform-serverless-homework-arno"
  acl    = "private"
}

# Upload an object to S3
resource "aws_s3_object" "terraform-homework" {
  bucket = "terraform-serverless-homework-arno"
  key    = "v${var.app_version}/example.zip"
  source = "../../example.zip"
  depends_on = [aws_s3_bucket.terraform-homework]

  # The filemd5() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the md5() function and the file() function:
  # etag = "${md5(file("path/to/file"))}"
  etag = filemd5("../../example.zip")
}

resource "aws_lambda_function" "example" {
  function_name = "ServerlessExample"

  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = "terraform-serverless-homework-arno"
  s3_key    = "v${var.app_version}/example.zip"

  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "main.handler"
  runtime = "nodejs14.x"
  role = aws_iam_role.lambda_exec.arn
  depends_on = [aws_s3_object.terraform-homework]
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_example_lambda"
  # Each Lambda function must have an associated IAM role which dictates what access it has to other AWS services.
  # The above configuration specifies a role with no access policy,
  # effectively giving the function no access to any AWS services,
  # since our example application requires no such access.
  assume_role_policy=<<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "lambda.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF

}

resource "aws_lambda_permission" "apigw" {
   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.example.function_name
   principal     = "apigateway.amazonaws.com"

   # The "/*/*" portion grants access from any method on any resource
   # within the API Gateway REST API.
   source_arn = "${aws_api_gateway_rest_api.example.execution_arn}/*/*"
}
