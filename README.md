# 📚 Book Recommendation Web App

An interactive book discovery platform powered by **Google Books API**, built using **HTML, CSS, and JavaScript**, and designed for deployment via **GitHub Pages**, **Terraform with AWS Cloud Infrastructure**, or **S3**. The app lets users search, filter, and explore books by genres, ratings, and page count, all wrapped in a clean, theme-toggleable UI.

## 🔧 Architecture Overview

![Architecture Diagram](Book-recommendation-app.drawio.png)

### 🔹 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (deployable on **GitHub Pages** or **Amazon S3**)
- **Authentication (Optional):** **Amazon Cognito** (user pool)
- **Backend:** **AWS Lambda** function (Node.js handler)
- **API Management:** **Amazon API Gateway** (HTTP API)
- **Logging & Monitoring:** **Amazon CloudWatch**
- **Infrastructure as Code:** **Terraform**
- **Book Data Source:** **Google Books API**

---

## 🚀 Deployment Instructions

### 📁 1. Folder Structure

```
.
├── index.html
├── app.js
├── lambda/
│   └── lambda_function.zip  # Your zipped Lambda handler
├── main.tf                  # Terraform script for infrastructure

```

---

### 2. Deployment Options

#### 📲 A. GitHub Pages (Frontend Only)
1. Push your project to a GitHub repository.
2. Go to your repository settings > **Pages**.
3. Set source to `main` branch and `/ (root)`.
4. Wait for a few minutes.
5. Access it at: `https://<username>.github.io/<repository-name>/`

Update the `API_ENDPOINT` in `app.js` to point to your deployed API Gateway URL.

#### ⚙️ B. Terraform Deployment (Full Stack)
Use the provided `main.tf` file to set up your infrastructure.

1. Ensure you have **Terraform** and **AWS CLI** configured.
2. Run the following commands:
   ```bash
   terraform init
   terraform apply
   ```
3. This will automatically:
   - Deploy a public S3 bucket for static hosting
   - Deploy the Lambda backend
   - Configure API Gateway
   - Create IAM roles and permissions
4. Outputs will include:
   - `website_url`: S3 hosted frontend
   - `api_url`: API Gateway endpoint

Update `API_ENDPOINT` in `app.js` with the output `api_url`.

#### 🌐 C. Manual S3 Deployment (Frontend Only)
1. Create an S3 bucket, enable **Static Website Hosting**.
2. Upload `index.html` and `app.js`.
3. Set permissions for public read access.
4. Link the frontend to your API Gateway.

#### 🧐 D. Cognito (Optional for Auth)
- Set up a Cognito User Pool.
- Use API Gateway authorizers to protect endpoints.

---

## 🌍 Live Demo

Host this project on **GitHub Pages** for frontend only, or use **Terraform on AWS** for full infrastructure provisioning.

---

## 🛆 API Reference

### `GET /recommendations`

Returns a list of books recommended from the Google Books API.

```json
{
  "books": [
    {
      "id": "123",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "genre": "Programming",
      "rating": 4.7,
      "pageCount": 464,
      "description": "...",
      "image": "https://...",
      "purchaseLink": "https://...",
      "price": "$30.99"
    },
    ...
  ]
}
```

---

## Security Considerations

- API access is secured via **API Gateway**.
- Optional **Cognito** integration for user authentication.
- Logs are collected via **CloudWatch**.
- IAM roles follow **least privilege** principles.

---

## 👨‍💻 Author

**Obidiegwu Onyedikachi Henry Leonard**  
Cloud Security Architect | DevSecOps Engineer  
🔗 [GitHub](https://github.com/LeonardKachi) • [Portfolio](https://leonardkachi.github.io/Portfolio-website) • 📧 Henryleo480@gmail.com

---

## 📜 License

MIT — feel free to fork and improve!
