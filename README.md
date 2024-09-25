# 🪄 Presto: A Lightweight Presentation App

**Author**: Kumaran Nathan  
**Project Type**: Frontend ReactJS Application  
**Tech Stack**: ReactJS, JavaScript, CSS, HTML, RESTful API

## Overview

Presto is a lightweight, web-based presentation application designed to revolutionize the way presentations are created and delivered. Inspired by the simplicity and efficiency of slides.com, Presto offers a lean, engaging user experience. It is built as a single-page application (SPA) using ReactJS for the frontend, which interacts with a provided RESTful backend API.

This project was part of a larger effort to create an MVP for an innovative presentation tool. I led the frontend development and focused on building a seamless, highly interactive interface with high standards for UI/UX and accessibility.

## Key Features

### 1. User Authentication
- **Login & Register**: Users can register and log into the platform. Validation for password matching, form submission on `Enter`, and error handling are implemented.
- **Logout**: Users can log out from any screen that requires authentication, redirecting them back to the login screen.

### 2. Presentation Management
- **Create Presentation**: Users can create new presentations, which are automatically populated with a default empty slide.
- **List Presentations**: Displays presentations in a dashboard with a thumbnail, name, description, and slide count. Responsive design ensures proper spacing and scaling.
- **Edit Presentation**: Allows users to view and modify the presentation title and manage slides.
- **Delete Presentation**: Users can delete any presentation with a confirmation prompt.

### 3. Slide Creation & Navigation
- **Add/Remove Slides**: Users can add new slides to their presentations and delete existing ones.
- **Slide Navigation**: Arrow controls and keyboard shortcuts allow users to move between slides seamlessly.
- **Slide Numbering**: Each slide is numbered and displayed at the bottom-left of the slide.

### 4. Slide Content
- **Text Boxes**: Users can add text elements to slides, specifying size, font, and color. Text can be edited and deleted as needed.
- **Images**: Images can be added via URL or base64 encoding, with alt text for accessibility.
- **Videos**: YouTube videos can be embedded with options for autoplay.
- **Code Blocks**: Syntax-highlighted code blocks (supporting C, Python, and JavaScript) can be added with automatic language detection.

### 5. Element Manipulation
- **Movable Elements**: Users can drag elements around the slide to adjust their position.
- **Resizable Elements**: Elements can be resized by dragging corners while maintaining aspect ratio.

### 6. Advanced Features
- **Slide Transitions**: Smooth animations (e.g., swipe or fade) are added when transitioning between slides.
- **Theme & Background Customization**: Users can choose solid or gradient backgrounds for individual slides or the entire presentation.
- **Preview Mode**: Users can preview the presentation in fullscreen mode, with slide navigation controls enabled.
- **Revision History**: Provides a version history for users to restore previous versions of their presentations.

## Project Structure

```plaintext
├── src
│   ├── components
│   │   ├── Login.js         # Login form component
│   │   ├── Dashboard.js     # User dashboard showing list of presentations
│   │   ├── Presentation.js  # Component for editing slides and elements
│   │   ├── Slide.js         # Component to manage individual slides
│   │   ├── Element.js       # Handles text, images, videos, and code elements
│   │   ├── Preview.js       # Preview mode for presentations
│   ├── App.js               # Main application entry point
│   ├── config.js            # API config and settings
│   ├── index.js             # ReactDOM render
│   └── styles.css           # Global and component-specific styles
└── ...

```
## Setup and Running the program
1. Clone the repository:
```bash
git clone https://github.com/your-username/presto.git
cd presto
```
2. Install dependencies:
```npm install```
3. Start the development server:
```npm start```




