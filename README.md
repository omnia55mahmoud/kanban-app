# Kanban App

A fully interactive Kanban board application featuring task CRUD operations, smooth drag & drop between columns, pagination, and real-time search. Built with Next.js, React Query, Material-UI, and @dnd-kit for a drag and drop experience.

## Features

 **Task Management**: Create, edit, and delete tasks
 **Drag & Drop**: Smooth Trello-like drag and drop between columns
 **Pagination**: Load more tasks with pagination support
 **Search**: Real-time task search with debouncing
 **Responsive Design**: Works on desktop, tablet, and mobile devices
 **Modern UI**: Built with Material-UI for a polished interface

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher) 

You can check your versions by running:
```bash
node --version
npm --version
```

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
```bash
cd kanban-app
```

2. **Install dependencies**:
```bash
npm install
```
or
```bash
yarn install
```
or
```bash
pnpm install
```

## Running the Project

This project requires **two terminals** to run - one for the API server and one for the Next.js frontend.

### Terminal 1: Start the API Server

Start the mock API server using json-server:

```bash
npm run api
```

This will start the JSON Server on `http://localhost:4000` and watch the `mock/db.json` file for changes.

### Terminal 2: Start the Development Server

In a **new terminal window**, start the Next.js development server:

```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - Ready in X.XXs
```

## Accessing the Application

Once both servers are running:

1. Open your browser and navigate to: **http://localhost:3000**
2. You should see the Kanban board with four columns:
   - Backlog
   - In Progress
   - Review
   - Done

## Available Scripts

- `npm run dev` - Start the Next.js development server (runs on port 3000)
- `npm run build` - Build the production version of the app
- `npm run start` - Start the production server (requires build first)
- `npm run api` - Start the json-server API (runs on port 4000)


## Technologies Used

- **Next.js 16** - React framework for production
- **React 19** - UI library
- **Material-UI (MUI)** - Component library
- **@dnd-kit** - Modern drag and drop library
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **json-server** - Mock REST API server

### API Server Not Running

If you see errors about API requests failing, make sure:
1. The API server is running (`npm run api`)
2. It's running on port 4000
3. Check that `mock/db.json` exists