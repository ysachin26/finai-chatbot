

# 🚀 FinAI – Smarter Finance Assistant with Secure Admin Controls

**Ensuring secure operations and empowering users with AI-driven financial assistance.**

---

## 📌 Problem Statement

**Problem Track:**
- 🧠 **Groq Track** – For ultra-fast AI inference.
- 💸 **Stellar Track** – For efficient and secure blockchain-based wallet management.

> _Today’s platforms struggle with securely separating admin and user privileges. FinAI solves this by introducing a secure Admin Key system along with an AI-powered financial assistant._

---

## 🎯 Objective

FinAI is designed to:
- Offer a secure way to manage **admin-level operations** (like wallet management, user deletion, article updates) without exposing access on the frontend.
- Integrate **AI features using Groq** for a responsive chatbot and content updates.
- Enable **blockchain transactions via Stellar**, ensuring low-cost, fast wallet operations.
- Provide an intuitive interface for **financial education, updates**, and **chat-based transactions.**

---

## 👥 Team: VSA

- **Sachin Yadav**
- **Aryan Yadav**
- **Alok Gupta**
- **Vinayak Maurya**

---

## 🔐 How FinAI Solves the Problem

### ✅ Secure Admin Identification
- Admin privileges managed via a hidden **`.env` key** – no frontend exposure.
- Protects critical operations: account deletion, fund transfers, article publishing, etc.

### ✅ Smarter Financial Tasks
- Users interact with a **Groq-powered chatbot** for market updates, balance inquiries, and wallet transfers.
- **Stellar blockchain integration** allows users to perform **secure, real-time XLM transactions**.

### ✅ Admin-Controlled Content
- Admins can update market values, financial articles, and news securely from the backend.

---

## 💡 Features

- 🔐 Secure Admin Access Control System
- 💬 Groq-Powered AI Chatbot
- 💸 Stellar Wallet Integration and Transactions
- 📈 Financial News & Market Updates
- 📱 Fully Mobile Responsive UI
- 🚀 Real-time Updates with Cron Jobs and Caching

---

## 📽️ Demo & Deployment

- **Live Site**: [https://finai-chatbot-ysachin26s-projects.vercel.app/](https://finai-chatbot-ysachin26s-projects.vercel.app/)
- **Demo Video**: [Watch Here](https://www.youtube.com/watch?v=oSdLvN8JMnE&feature=youtu.be)

---![Screenshot 2025-04-27 234021](https://github.com/user-attachments/assets/c2170571-d8be-41ed-bae0-8e3d471b2a44)
![Screenshot 2025-04-27 233929](https://github.com/user-attachments/assets/a0aaf134-3d16-44b9-bffc-d1c1abe0661d)
![Screenshot 2025-04-27 233923](https://github.com/user-attachments/assets/9ecdd7fe-f130-494e-8cf4-1d863743a3b9)
![Screenshot 2025-04-27 233731](https://github.com/user-attachments/assets/c56aa4d8-dfe0-4887-ac8f-94ff30b3540b)
![Screenshot 2025-04-27 233725](https://github.com/user-attachments/assets/292b3544-5236-452f-a938-9c23a1cf5d4c)
![Screenshot 2025-04-27 233705](https://github.com/user-attachments/assets/74b29f64-4f97-44f9-8f33-7b6d51291530)
![Screenshot 2025-04-27 233605](https://github.com/user-attachments/assets/f469318d-cc91-4776-a6c3-062acee0e7f7)
![Screenshot 2025-04-27 233554](https://github.com/user-attachments/assets/b1ac1798-eb88-4171-950b-cd4033cdba31)
![Screenshot 2025-04-27 233429](https://github.com/user-attachments/assets/f70d7ca6-f66d-48ae-ac51-b5cbe58496d7)
![Screenshot 2025-04-27 233413](https://github.com/user-attachments/assets/f233dda7-a36a-4356-8e72-cbc5715e5b2b)
![Screenshot 2025-04-27 234148](https://github.com/user-attachments/assets/e8972e19-017e-4aa0-9c3c-4b91d1bb39ea)


## 🛠️ Tech Stack

- **Frontend**: Next.js, React.js, Tailwind CSS, TypeScript
- **Backend**: Node.js, MongoDB, Stellar SDK, Groq API
- **Hosting**: Vercel (Frontend)
- **APIs/Libraries**: Groq API, Stellar SDK, Cron jobs for dynamic updates

---

## 🚧 Challenges & Solutions

### 🔐 Secure Admin Access
- Problem: Risk of exposing admin controls on frontend.
- Solution: Used hidden keys in `.env` to validate roles strictly on the backend.

### 🔁 Dynamic Data Updates
- Problem: Real-time financial data updates caused lag due to API limits.
- Solution: Scheduled background jobs with smart caching strategies.

### 🤖 Chatbot-Wallet Sync
- Problem: Real-time blockchain updates were tricky.
- Solution: Backend Stellar SDK integration with balance updates post-transaction.

### 📱 UI Breakage on Mobile
- Problem: Layout issues on small screens.
- Solution: Responsive redesign using scrollable sections and flexible grid layouts.

---

## 🧪 How to Run the Project

### Prerequisites:
- Node.js
- MongoDB
- GROQ API Key
- Stellar Secret Key

### Steps:

```bash
# Clone the repository
git clone https://github.com/your-team/finai

# Go to project directory
cd finai

# Install dependencies
npm install

# Add environment variables in `.env` file
GROQ_API_KEY=your_key
ADMIN_SECRET_KEY=your_key
STELLAR_SECRET=your_key

# Run the dev server
npm run dev


Resources & Credits:
Groq API – For AI chatbot capabilities.
Stellar SDK – For blockchain wallet integration
Cron Jobs – For content scheduling.

Special thanks to Hackathon Organizers, Groq, and Stellar teams.

🏁 Final Words
This journey was full of:
🧠 Breakthroughs in securely handling admin-level operations.
💬 Fun experiments with AI chat commands.
🔗 Real-time blockchain integration experiences.

We are proud of what we’ve built — FinAI isn’t just a project, it's a step towards smarter and safer digital finance.
