<div align="center">
  <h1>🚀 HeyZack Knowledge Hub</h1>
  <p><strong>A Modern, AI-Powered Knowledge Management Dashboard</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
  <p>A comprehensive knowledge management system built for HeyZack's launch campaign strategy, featuring intelligent document indexing, advanced search capabilities, and beautiful data visualization.</p>
</div>

---

## ✨ Features

### 🎯 **Core Functionality**
- **📚 Intelligent Document Management** - Organize and access campaign materials, brand guidelines, and strategic documents
- **🔍 Advanced Search Engine** - Powered by Fuse.js and Lunr for lightning-fast content discovery
- **📊 Interactive Analytics Dashboard** - Real-time insights into campaign performance and document usage
- **🎨 Modern UI/UX** - Built with HeroUI and Tailwind CSS for a premium user experience
- **🌙 Dark/Light Mode** - Seamless theme switching with next-themes

### 🛠️ **Technical Excellence**
- **⚡ Next.js 15** - Latest App Router with Turbopack for blazing-fast development
- **🔥 React 19** - Cutting-edge React features and performance optimizations
- **📝 Markdown Support** - Rich markdown rendering with syntax highlighting and Mermaid diagrams
- **🎭 Framer Motion** - Smooth animations and micro-interactions
- **📱 Responsive Design** - Mobile-first approach ensuring perfect experience across all devices
- **🔒 Type Safety** - Full TypeScript implementation for robust development

### 📋 **Content Categories**
- **Foundation** - Brand identity, personas, and positioning
- **Campaign Core** - Landing pages, video scripts, and campaign strategies
- **Email Marketing** - Automated sequences and template guidelines
- **Advertising** - Ad copy variations and campaign materials
- **Visual Assets** - Design guidelines and production briefs
- **Strategic Analysis** - Business models and market research

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd heyzack-knowledge-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 📁 Project Structure

```
heyzack-knowledge-hub/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router pages
│   │   ├── 📂 analytics/          # Analytics dashboard
│   │   ├── 📂 business-strategy/  # Business strategy docs
│   │   ├── 📂 documents/          # Document management
│   │   └── 📂 search/             # Search functionality
│   ├── 📂 components/             # Reusable React components
│   │   ├── 📂 dashboard/          # Dashboard-specific components
│   │   ├── 📂 documents/          # Document viewer components
│   │   ├── 📂 layout/             # Layout components
│   │   ├── 📂 navigation/         # Navigation components
│   │   ├── 📂 search/             # Search components
│   │   └── 📂 ui/                 # Base UI components
│   ├── 📂 hooks/                  # Custom React hooks
│   ├── 📂 lib/                    # Utility libraries
│   │   ├── document-indexer.ts    # Document indexing logic
│   │   ├── document-service.ts    # Document management service
│   │   ├── search-engine.ts       # Search implementation
│   │   └── markdown-processor.ts  # Markdown processing
│   └── 📂 types/                  # TypeScript type definitions
├── 📂 data-sources/               # Knowledge base content
│   ├── 📂 01_Foundation/          # Brand and positioning docs
│   ├── 📂 02_Campaign_Core/       # Core campaign materials
│   ├── 📂 03_Email_Marketing/     # Email sequences and templates
│   ├── 📂 04_Advertising/         # Ad copy and campaigns
│   ├── 📂 05_Visual_Assets/       # Design guidelines
│   └── 📂 06_Supporting_Materials/ # Additional resources
├── 📂 public/                     # Static assets
└── 📄 Configuration files         # Next.js, TypeScript, Tailwind configs
```

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### **Styling & UI**
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[HeroUI](https://heroui.com/)** - Modern React component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### **Content & Search**
- **[Marked](https://marked.js.org/)** - Markdown parser and compiler
- **[Gray Matter](https://github.com/jonschlinkert/gray-matter)** - Front matter parser
- **[Fuse.js](https://fusejs.io/)** - Fuzzy search library
- **[Lunr](https://lunrjs.com/)** - Full-text search engine
- **[Mermaid](https://mermaid.js.org/)** - Diagram and flowchart rendering

### **State Management & Data**
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Markdown component

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🎨 Key Features in Detail

### 📊 **Analytics Dashboard**
Real-time insights into:
- Document access patterns
- Search query analytics
- User engagement metrics
- Campaign performance indicators

### 🔍 **Advanced Search**
- **Fuzzy Search** - Find content even with typos
- **Full-text Search** - Search within document content
- **Category Filtering** - Filter by document type
- **Tag-based Search** - Organize with custom tags

### 📝 **Document Management**
- **Markdown Support** - Rich text formatting
- **Syntax Highlighting** - Code blocks with highlighting
- **Mermaid Diagrams** - Flowcharts and diagrams
- **PDF Support** - View PDF documents inline
- **Version Control** - Track document changes

### 🎯 **Campaign Strategy Tools**
- **Persona Management** - Target audience profiles
- **Campaign Timeline** - Visual project roadmaps
- **Asset Library** - Centralized media management
- **Template System** - Reusable content templates

---

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect your repository** to [Vercel](https://vercel.com/)
2. **Configure build settings** (auto-detected)
3. **Deploy** with zero configuration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/heyzack-knowledge-hub)

### **Other Platforms**

- **Netlify** - `npm run build && npm run export`
- **AWS Amplify** - Connect repository and deploy
- **Docker** - Use the included Dockerfile

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Style**

- Follow the existing code style
- Run `npm run lint` before committing
- Use meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - For the amazing React framework
- **[Vercel](https://vercel.com/)** - For hosting and deployment platform
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[HeroUI](https://heroui.com/)** - For the beautiful component library

---

<div align="center">
  <p><strong>Built with ❤️ for HeyZack's Launch Campaign</strong></p>
  <p>© 2025 HeyZack Knowledge Hub. All rights reserved.</p>
</div>
