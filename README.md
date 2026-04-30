# Hackathon Applet

This is the Hackathon Applet, a web application providing a conversational AI interface. It features modern design elements, user authentication via Firebase, and integrations with multiple AI models out of the box.

## AI Models
You can configure and chat with several Hackathon models including:
- **Hackathon-Flash**: Fast, versatile model for everyday tasks. Best default choice for 90% of user queries.
- **Hackathon-Advanced**: Deep reasoning model that visualizes its thought process.
- **Hackathon-Lite**: Ultra low-latency model optimized for instant responses.
- **Hackathon-Pro**: Highest capability for tackling complex, multi-step problems.
- **Hackathon-Flash-8B**: Efficient model ideal for repetitive, high-volume tasks.

## Key Features
- **Responsive Chat Interface**: Built with React and Tailwind CSS for mobile and desktop support.
- **User Authentication**: Secure user login and profile management using Firebase.
- **Model Tuning**: Configure advanced properties like Temperature, Max Tokens, and Top-P for each of the available Hackathon models.
- **Customizable Appearance**: Native support for Light, Dark, and System-synced themes.
- **Emoji Reactions**: Apply and display emoji reactions on the conversational messages.
- **Local Data Governance**: Easily delete local history and settings gracefully.
- **Searchable Chat History**: Quickly locate past discussions with the sidebar search bar.

## Project Status: What's Working and What's Not

### ✅ What's Working
- **AI Chat & Streaming**: Connecting to real Gemini models via the API. Streaming responses and formatting Markdown/code blocks correctly.
- **Model Switching**: Switching between various Hackathon models (Flash, Advanced/R1, Lite, Pro, 8B) adjusts the underlying API endpoints accurately. Includes a real-time comparison metrics view.
- **Enhanced Error Handling**: Informative messages for users if API quota is exceeded, API keys are invalid, or a model isn't found. 
- **Quota Error Fallbacks**: Automatic fallback system that gracefully defaults to a faster model if rate limits or 429 quota exhaustion errors are encountered on advanced/experimental models.
- **Image/File Attachments**: Uploading images inline converts them to base64, passes them to the Gemini Vision API natively, and displays image previews in the chat bubble.
- **Voice/Microphone Input**: The microphone button hooks into native speech-to-text to transcribe words directly into the textarea seamlessly.
- **Local Authentication**: Uses `localStorage` to simulate login/registration offline.
- **UI & Theming**: Dark/Light mode switching, styling, haptics UI, responsive CSS.
- **Chat Management**: You can export chat transcripts to text files, clear chats, and switch models dynamically.

### 🚧 What's Not Working (UI or Simulated Only)
- **Firebase/Cloud Sync**: The backend auth and Firestore sync are simulated. User sessions & history rely on browser `localStorage` and will not sync across different devices.
- **Software Updater**: The 'Update Now' button in the settings is purely a visual simulation and progress-bar animation.
- **Push Notifications / Cloud Analytics**: Features referenced in the settings are UI placeholders and do not link to real services.
- **Emoji Reactions**: While mentioned in UI, they do not persist to a backend.

## Technology Stack
- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Rich Text Rendering**: React Markdown, Syntax Highlighter
- **Backend / Auth / Database**: Firebase (Auth & Firestore)
- **Tooling**: Vite for lightning fast dev builds

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs on `0.0.0.0:3000` by default):
   ```bash
   npm run dev
   ```

## Build & Lint
- **Build**: `npm run build`
- **Lint**: `npm run lint`
