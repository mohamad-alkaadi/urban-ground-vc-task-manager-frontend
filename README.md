# 🎙️ Urban Ground VC Task Manager (Frontend)

Welcome to the **Voice-Controlled (VC) Task Manager Frontend**! This is a modern, interactive web application built to explore hands-free productivity. By integrating real-time speech recognition, text-to-speech, and WebSockets, this frontend provides a seamless, conversational interface for managing tasks.

## 🚀 Features

- **Conversational Task Management:** Add, list, and manage your tasks entirely through voice commands.
- **Real-Time Voice Feedback:** Visualizes your voice stream using a custom interactive canvas audio visualizer.
- **AI Agent Integration:** Communicates over WebSockets to an AI backend that parses intent and manages task states.
- **Text-to-Speech (TTS):** Speaks responses back to the user, ensuring a fully hands-free experience.
- **Modern Tech Stack:** Built with the latest tools including Next.js 16, React 19, and Tailwind CSS v4.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI Library:** [React](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Real-time Communication:** [Socket.IO Client](https://socket.io/)
- **Language:** TypeScript

## 📂 Project Structure

- `/app` - Next.js App Router entry points (`page.tsx`, `layout.tsx`).
- `/components` - Reusable UI elements (`VoiceAgent.tsx`, `TasksSection.tsx`, `Task.tsx`).
- `/hooks` - Core business logic and custom React hooks:
  - `useVoiceTasks.ts` - Manages task state and AI socket interactions.
  - `useSocket.ts` - Maintains the WebSocket connection.
  - `useSpeechRecognition.ts` - Handles the browser's Speech-to-Text API.
  - `useVoiceSynthesis.ts` - Handles Text-to-Speech capabilities.
- `/types` - TypeScript definitions for tasks, history, and voice data.

## ⚙️ Getting Started

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) and `npm` installed.
- **Browser Compatibility:** This application currently only runs on **Google Chrome** or **Microsoft Edge**.

### Installation

1. Clone the repository and navigate to the project folder:

   ```bash
   cd urban-ground-vc-task-manager-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
_(Note: Ensure your backend server is running and accessible to establish the WebSocket connection.)_

## 🎙️ How to Use

1. **Connect:** The app will automatically attempt to connect to the backend via WebSocket. The header will indicate if you are connected.
2. **Activate Session:** Click the microphone button to activate the listening session.
3. **Speak:** Give commands like _"Get all my tasks"_, or _"Remind me to buy groceries tomorrow."_
4. **Listen & See:** The AI will process your request, update the visual task list in real-time, and speak back to you to confirm the action.

## 📜 License

This project is proprietary.
