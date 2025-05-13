# PromptPal - AI Prompt Organizer & Enhancer

PromptPal is a web-based tool and Chrome extension designed to help users organize, optimize, and enhance AI prompts for better clarity, structure, and functionality. The platform allows users to save, manage, and optimize prompts, making it easier for AI engineers, content creators, and anyone working with AI language models to store, reuse, and improve their prompts.

## Key Features:
- **Prompt Management**: Organize prompts by tags, categories, and favorites for easy access and use.
- **Prompt Enhancement**: Improve and optimize prompts for better performance with clear instructions and enhanced structures.
- **Chrome Extension**: A Chrome extension version allows users to quickly create, save, and modify prompts directly from their browser.
- **Backend Integration**: Securely store prompts and API keys on the backend, ensuring persistence across devices.
  
## Technologies Used:
- **Frontend**: React, CSS, HTML
- **Backend**: Node.js, Express, MongoDB
- **Chrome Extension**: JavaScript, Manifest V3 API
- **Authentication**: JWT, secure storage for API keys

## Installation

### Web App:
1. Clone this repository to your local machine.
    ```bash
    git clone https://github.com/yourusername/promptpal.git
    ```
2. Navigate to the project directory.
    ```bash
    cd promptpal
    ```
3. Install dependencies.
    ```bash
    npm install
    ```
4. Start the app.
    ```bash
    npm start
    ```
5. Open the app in your browser at `http://localhost:3000`.

### Chrome Extension:
1. Clone this repository to your local machine.
    ```bash
    git clone https://github.com/yourusername/promptpal.git
    ```
2. Navigate to the extension directory and build the project using Webpack or Vite.
3. Go to `chrome://extensions/` in your Chrome browser.
4. Enable **Developer mode** and click **Load unpacked**.
5. Select the `build/` directory from your cloned repository.

## Usage

- **Web App**: Use the web interface to create, organize, and enhance your AI prompts. You can tag prompts, categorize them, and optimize them for AI models.
- **Chrome Extension**: Once installed, click the extension icon in the browser to open the popup and manage your prompts directly from the browser.
