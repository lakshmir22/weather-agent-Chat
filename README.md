# 🌤 Weather Agent Chat Interface

<div align="center">

*A modern, responsive chat interface for real-time weather conversations*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-blue?style=for-the-badge)](https://lakshmi-weather-agent-chat.vercel.app/)
[![Documentation](https://img.shields.io/badge/📚_Documentation-green?style=for-the-badge)](https://drive.google.com/file/d/1Fo9z66w6hC3abDt7yImM5C82PzuU017U/view?usp=sharing)

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.6-646CFF?style=flat&logo=vite&logoColor=white)

</div>

---

## ✨ Overview

An intelligent weather chat application that provides real-time weather information through natural language conversations. Built with modern React and featuring a sleek, responsive design with dark/light theme support.

## 🚀 Features

<details>
<summary><b>🎯 Core Functionality</b></summary>

- ✅ *Real-time Chat*: Interactive conversations with weather agent via streaming API
- 🔄 *Auto-scroll*: Automatic scrolling to latest messages
- ⏳ *Loading States*: Beautiful visual indicators during API calls
- 🛡 *Error Handling*: Comprehensive error management with user feedback

</details>

<details>
<summary><b>🎨 UI/UX Features</b></summary>

- 📱 *Responsive Design*: Mobile-first approach with adaptive layouts
- 🌙 *Dark/Light Theme*: Smooth theme toggle with localStorage persistence
- 📋 *Copy Messages*: One-click copy functionality with feedback
- 💾 *Export Chat*: Download conversation history as JSON
- ⌨ *Keyboard Shortcuts*: Enter to send, Ctrl+D for theme change.

</details>

<details>
<summary><b>  Advanced Features</b></summary>

- 🕒 *Smart Timestamps*: Relative time formatting with full date toggle
- ⌨ *Typing Indicators*: Visual feedback during streaming responses
- 🎨 *Custom Scrollbar*: Styled scrollbars for enhanced UX
- ✨ *Smooth Animations*: Fade-in effects and micro-interactions
- 👍 *Message Reactions*: Like/dislike messages.

</details>

---

## 🛠 Tech Stack

<table>
<tr>
<td>

*Frontend*
- React 19.1.1
- Tailwind CSS 4.1.13
- Lucide React (Icons)
- date-fns (Date utilities)

</td>
<td>

*Development*
- Vite 7.1.6 (Build tool)
- ESLint (Code quality)
- Hot Module Replacement
- Modern ES6+ features

</td>
</tr>
</table>

---

## 🌐 API Integration

Connects to weather agent streaming endpoint for real-time responses:


🔗 https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream


<details>
<summary><b>📝 Request Format</b></summary>

json
{
  "messages": [
    {
      "role": "user",
      "content": "What's the weather in New York?"
    }
  ],
  "runId": "weatherAgent",
  "threadId": "unique-thread-id",
  "temperature": 0.5,
  "maxRetries": 2
}


</details>

---

## 🚀 Quick Start

### 📦 Installation
bash
# Clone the repository
git clone https://github.com/lakshmir22/weather-agent-Chat.git
cd weather-agent-Chat

# Install dependencies
npm install


### 🔧 Development
bash
# Start development server
npm run dev
# 🌐 Opens at http://localhost:5173


### 🏗 Build
bash
# Build for production
npm run build

# Preview production build
npm run preview


---

## 📁 Project Structure


src/
├── 🧩 components/
│   ├── ChatWindow.jsx       # Main chat container with state management
│   ├── ChatHeader.jsx       # Header with theme toggle & export
│   ├── MessageList.jsx      # Scrollable message container
│   ├── MessageItem.jsx      # Individual message bubbles
│   ├── MessageInput.jsx     # Input field with voice support
│   └── LoadingIndicator.jsx # Beautiful loading animation
├── 🔌 services/
│   └── weatherAgent.js      # API service with streaming parser
├── 🛠 utils/
│   └── chatUtils.js         # Utility functions for chat operations
├── 🎨 styles/
│   └── index.css           # Global styles and theme definitions
├── App.jsx                 # Root component
└── main.jsx               # App entry point


---

## 💡 Usage Examples

### 🌦 Weather Queries

• "What's the weather in New York?"
• "Will it rain tomorrow in London?"
• "Compare weather in Tokyo vs Sydney"
• "Is it sunny in California right now?"


### 🎮 Feature Demos
| Feature | Action |
|---------|--------|
| 🌙 *Dark Mode* | Click moon/sun icon in header |
| 💾 *Export* | Click download icon to save chat |
| 📋 *Copy* | Hover over messages to see copy button |
| 👍 *Reactions* | Click like/dislike on agent messages |

---


*⭐ If you find this project helpful, please give it a star! ⭐*

[![GitHub stars](https://img.shields.io/github/stars/lakshmir22/weather-agent-Chat?style=social)](https://github.com/lakshmir22/weather-agent-Chat/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/lakshmir22/weather-agent-Chat?style=social)](https://github.com/lakshmir22/weather-agent-Chat/network/members)


</div>
