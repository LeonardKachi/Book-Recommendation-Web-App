# 📚 Book Recommendation Web App

An interactive book discovery platform powered by **Google Books API**, deployed using **AWS Cloud Infrastructure** (S3, Lambda, API Gateway, Cognito, CloudWatch). The app lets users search, filter, and explore books by genres, ratings, and page count, all wrapped in a clean, theme-toggleable UI.

## 🔧 Architecture Overview

![Architecture Diagram](Book-recommendation-app.drawio.png)

### 🔹 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (static hosted on **Amazon S3**)
- **Authentication:** **Amazon Cognito** (user pool)
- **Backend:** **AWS Lambda** function (Node.js handler)
- **API Management:** **Amazon API Gateway** (REST API)
- **Logging & Monitoring:** **Amazon CloudWatch**
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
├── Book-recommendation-app.drawio.png
└── README.md
```

---

### ✅ 2. Setup Steps

#### 🔐 A. Create a Cognito User Pool
1. Go to **Amazon Cognito**.
2. Create a **User Pool** (for user authentication).
3. Enable **email-based signup/login**.
4. Note down the **User Pool ID** and **App Client ID**.

#### 🗂️ B. Deploy Frontend to S3
1. Go to **Amazon S3** and create a new bucket.
2. Enable **Static Website Hosting**.
3. Upload:
   - `index.html`
   - `app.js`
4. Set permissions:
   - Make objects **publicly readable** (or use CloudFront + signed URLs).
5. Update the **API endpoint URL** in `app.js` if it differs.

#### ⚙️ C. Set Up Lambda
1. Go to **AWS Lambda**, create a new function.
2. Choose "Author from scratch", runtime: **Node.js**.
3. Upload the zipped **`lambda_function.zip`**.
4. Set handler name (`index.handler` if your file is named `index.js` inside).
5. Grant permission to access the **Google Books API** (via Internet), and log to **CloudWatch**.

#### 🌐 D. Create REST API Gateway
1. Go to **API Gateway**, create a new REST API.
2. Set up a `/recommendations` resource and a `GET` method.
3. Link the method to your Lambda function.
4. Enable **CORS**.
5. Deploy the API to a new stage (e.g., `prod`) and copy the endpoint URL.

#### 🧐 E. Integrate Cognito Authentication
(Optional for now – for securing API access):
- Configure API Gateway to use Cognito **Authorizer** with the User Pool.
- Protect your `/recommendations` endpoint.

---

## 🌍 Live Demo

You can host this project on an **S3 public endpoint**, or connect a custom domain using **Amazon Route 53**.

---

## 🛆 API Reference

### `GET /recommendations`

**Returns**: A list of recommended books queried from the Google Books API.

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

## 🛡️ Security Considerations

- API access is isolated via **API Gateway**.
- Cognito is planned for authenticated user sessions.
- CloudWatch handles centralized logging for Lambda invocations.
- Ensure IAM roles **follow least privilege** best practices.

---

## 👨‍💻 Author

**Obidiegwu Onyedikachi Henry Leonard**  
Cloud Security Architect | DevSecOps Engineer  
🔗 [GitHub](https://github.com/LeonardKachi) • [Portfolio](https://leonardkachi.github.io/Portfolio-website) • 📧 Henryleo480@gmail.com

---

## 📜 License

MIT — feel free to fork and improve!

