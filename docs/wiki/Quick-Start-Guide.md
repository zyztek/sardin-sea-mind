# ⚡ Quick Start Guide

Ready to set sail? Follow these steps to get SARDIN-AI working on your local machine.

## Prerequisites

- **Node.js**: v18.0.0 or higher.
- **Git**: To clone the repo.
- **Docker** (Optional): For running the backend easily.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/zyztek/sardin-sea-mind.git
cd sardin-sea-mind
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

*Note: The default values work out-of-the-box for local development.*

## Running the Application

### Option A: Full Stack (Recommended)

This runs both the Frontend and the PocketBase backend.

1. **Start Backend**:

    ```bash
    # Windows
    ./pocketbase/pocketbase.exe serve
    
    # Linux/Mac
    ./pocketbase/pocketbase serve
    ```

    *Admin UI will be at `http://127.0.0.1:8090/_/`*

2. **Start Frontend**:
    Open a new terminal:

    ```bash
    npm run dev
    ```

    *App will be at `http://localhost:5173`*

### Option B: Docker

```bash
docker-compose up -d
```

## First Login

Use the default admin credentials (if using the provided dev-data):

- **Email**: `admin@sardin-ai.com`
- **Password**: `password123`

---
*Next Step: Explore the [[Architecture Overview]]*
