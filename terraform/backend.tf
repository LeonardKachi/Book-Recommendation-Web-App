# Backend configuration for storing Terraform state in S3

terraform {
  backend "s3" {
    bucket         = "your-tf-state-bucket-name"
    key            = "book-recommendation-app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
