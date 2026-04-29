# Hackathon Applet

This is the Hackathon Applet, a web application providing a conversational AI interface. It features modern design elements, user authentication via Firebase, and integrations with multiple AI models out of the box.

## AI Models
You can configure and chat with several Hackathon models including:
- **Hackathon-Flash**
- **Hackathon-Advanced**
- **Hackathon-Lite**
- **Hackathon-Pro**
- **Hackathon-Flash-8B**

## Key Features
- **Responsive Chat Interface**: Built with React and Tailwind CSS for mobile and desktop support.
- **User Authentication**: Secure user login and profile management using Firebase.
- **Model Tuning**: Configure advanced properties like Temperature, Max Tokens, and Top-P for each of the available Hackathon models.
- **Customizable Appearance**: Native support for Light, Dark, and System-synced themes.
- **Emoji Reactions**: Apply and display emoji reactions on the conversational messages.
- **Local Data Governance**: Easily delete local history and settings gracefully.
- **Searchable Chat History**: Quickly locate past discussions with the sidebar search bar.

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
