# Output values for the Book Recommendation App infrastructure

output "website_url" {
  description = "URL of the hosted frontend S3 website"
  value       = aws_s3_bucket.frontend_bucket.website_endpoint
}

output "api_url" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.book_api.api_endpoint
}
