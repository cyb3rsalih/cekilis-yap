# Vite React TypeScript Project

This project is a modern web application built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker (optional, for containerized deployment)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies using Yarn:
   ```bash
   yarn install
   ```

### Development

Run the development server:

```bash
yarn dev
```

This will start the development server at `http://localhost:5173`.

### Building for Production

Build the project for production:

```bash
yarn build
```

This will generate optimized production files in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
yarn preview
```

## Docker Deployment

This project includes Docker configuration for easy deployment.

### Building the Docker Image

```bash
docker build -t vite-react-app .
```

### Running the Docker Container

```bash
docker run -p 5173:5173 vite-react-app
```

This will start the application in a Docker container, accessible at `http://localhost:5173`.

### Docker Compose (Alternative)

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "5173:5173"
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Project Structure

- `src/` - Source code directory
  - `components/` - React components
  - `utils/` - Utility functions
  - `types/` - TypeScript type definitions
- `public/` - Static assets
- `dist/` - Production build output

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS

## License

[MIT](LICENSE) 