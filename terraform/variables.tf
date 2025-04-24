# Variable definitions for the Book Recommendation App infrastructure

variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket to host the frontend."
  type        = string
}

variable "lambda_zip_path" {
  description = "Relative path to the zipped Lambda function code."
  type        = string
  default     = "lambda/lambda_function.zip"
}
