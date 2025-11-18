# Chat Clippings

A beautiful, modern single-page React application for managing common text phrases and snippets. Built with React, Vite, and Tailwind CSS, featuring a premium glassmorphism UI design with multi-language support (English, Swedish, Norwegian).

## ✨ Features

- 📝 Create and organize phrases into groups
- 🎨 Premium glassmorphism UI with smooth animations
- 🌍 Multi-language support (EN, SE, NO)
- 💾 Local storage persistence (all data stays in your browser)
- 📋 One-click copy to clipboard
- 🎯 Search and filter functionality
- 🌙 Modern dark theme design

## 🐳 Docker Deployment

The easiest way to run Chat Clippings is using Docker. Pre-built multi-architecture images (AMD64 and ARM64) are available on GitHub Container Registry.

### Using Docker Run

```bash
# Pull the latest image
docker pull ghcr.io/esaiaswestberg/chat-clippings:latest

# Run the container
docker run -d \
  --name chat-clippings \
  -p 8080:80 \
  --restart unless-stopped \
  ghcr.io/esaiaswestberg/chat-clippings:latest
```

Then open your browser to http://localhost:8080

### Using Docker Compose

1. Create a `docker-compose.yml` file (or use the one in this repository):

```yaml
services:
  chat-clippings:
    image: ghcr.io/esaiaswestberg/chat-clippings:latest
    container_name: chat-clippings
    ports:
      - "8080:80"
    restart: unless-stopped
```

2. Start the service:

```bash
docker-compose up -d
```

3. Access the application at http://localhost:8080

### Available Tags

- `latest` - Latest stable release
- `v1.0.0` - Specific version tags
- `1.0` - Major.minor version
- `1` - Major version

### Custom Port

To run on a different port, change the host port mapping:

```bash
docker run -d -p 3000:80 ghcr.io/esaiaswestberg/chat-clippings:latest
```

## 🛠️ Local Development

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+

### Using Bun (Recommended)

1. Install dependencies:

```bash
bun install
```

2. Start the development server:

```bash
bun run dev
```

3. Open http://localhost:5173

### Using npm

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Start the development server:

```bash
npm run dev
```

### Build for Production

```bash
# Using Bun
bun run build

# Using npm
npm run build
```

The built files will be in the `dist/` directory.

## 📦 Data Storage

All data is stored in your browser's LocalStorage under the key `chat-clippings-data-v1`. This means:
- ✅ No server required
- ✅ Your data stays private
- ✅ Works offline
- ⚠️ Data is browser-specific

To backup your data, use the browser's developer tools to export LocalStorage, or implement a custom export feature.

## 🏗️ Building from Source with Docker

If you want to build the Docker image yourself:

```bash
docker build -t chat-clippings .
docker run -d -p 8080:80 chat-clippings
```

For multi-architecture builds:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t chat-clippings:latest \
  --push .
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

See [LICENSE](LICENSE) file for details.
