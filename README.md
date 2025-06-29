<h1><img src="client/public/logo.svg" alt="Linkly Logo" width="30" style="vertical-align: middle;"/> Linkly - Modern URL Shortener</h1>

A modern, feature-rich URL shortener built with React and Node.js, featuring a beautiful UI, user authentication, and powerful link management capabilities.

## Features

- 🎨 **Modern UI/UX**: Sleek, responsive design with a futuristic theme
- 🔐 **User Authentication**: Secure login with Google and GitHub
- ⚡ **Fast & Reliable**: Redis caching for quick URL retrieval
- 📊 **Link Management**: Track clicks and manage your shortened URLs
- 🔄 **Efficient Encoding**: Base62 encoding for converting long URLs to short URLs
- 🎯 **Custom Features**:
  - Custom short URLs
  - Click limits
  - Expiration dates
  - Link analytics

## Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Firebase Authentication
- React Router for navigation
- Framer Motion for animations
- Axios for API calls

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Base 64 encoding (Long Url to Short Url) 
- Redis for caching
- Firebase Admin SDK
- Rate limiting
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Shobhit070304/linkly.git
cd linkly
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables

Create `.env` files in both client and server directories:

Client `.env`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_BASE_URL=your_backend_url
VITE_BACKEND_URL = your_backend_url(for url redirection route)
```

Server `.env`:
```env
MONGO_URI=your_mongodb_uri
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=your_auth_uri
FIREBASE_TOKEN_URI=your_token_uri
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=your_auth_provider_cert_url
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url
PORT=your_port
```

4. Start the development servers

```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm start
```

## API Endpoints

### URL Routes
- `POST /api/url/shorten` - Create short URL
- `POST /api/url/original` - Get original URL
- `GET /api/url/me` - Get user's URLs
- `POST /api/url/delete` - Delete URL

### User Routes
- `POST /api/user/login` - User authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with ❤️ by Shobhit using modern web technologies
