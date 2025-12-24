# QR Generator Pro - React Edition

Re-implemented in React + TypeScript + Tailwind CSS for scalability, maintainability, and modern features.

## Project Overview

This is a modern web application for generating customizable QR codes with structured data (Key-Value pairs).

### Tech Stack
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **QR Engine**: qrcode.react

## Features
- **Dynamic Fields**: Add/Remove key-value pairs freely.
- **Real-time Preview**: QR code updates instantly as you type.
- **Persistence**: Your data is saved automatically to your browser (LocalStorage).
- **Customization**: Change QR colors (Foreground/Background).
- **Export**: Download as PNG or copy structured text to clipboard.
- **Responsive Design**: Mobile-first "Mac-style" UI.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development

- `src/components`: UI components (FieldInput, QRDisplay, Layout).
- `src/hooks`: Custom hooks (e.g., useLocalStorage).
- `src/types`: TypeScript definitions.

## Legacy
The original HTML version is archived in the `legacy/` directory.
