# ProtoPapers - Blueprint Ignition Hub

🚀 **Transform Research Papers into Buildable Products with AI-Powered Multi-Agent System**

ProtoPapers is an innovative web application that converts academic research papers into actionable development blueprints. Using a sophisticated multi-agent system, it analyzes research papers and generates comprehensive implementation guides tailored for different development scenarios.

## 🌟 Key Features

### 📄 **Smart Paper Analysis**
- **PDF Parsing**: Advanced PDF text extraction with OCR support for scanned documents
- **Research Signal Extraction**: Automatically identifies key components like methodology, models, datasets, and evaluation metrics
- **Multi-Format Support**: Works with both selectable text PDFs and image-based scanned papers

### 🤖 **Multi-Agent System**
- **8 Specialized Agents**: Each agent focuses on specific aspects of implementation
- **Real-Time Visualization**: Watch agents collaborate and reason in real-time
- **Intelligent Workflow**: Agents work together to create comprehensive blueprints

### 📚 **Paper History Management**
- **Session-Based Storage**: Automatically saves parsed papers during your session
- **Quick Access**: Load previous papers back into the current session
- **Detailed Extraction Results**: View and manage extracted research signals

### 🎯 **Tailored Blueprints**
- **Beginner Mode**: Step-by-step guidance for newcomers
- **Builder Mode**: Production-ready implementations with best practices
- **Hackathon Mode**: Rapid prototyping with deployment strategies

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PDF Upload    │    │   Demo Papers   │    │  Custom Input   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Research Extraction     │
                    │   (PDF Parser + OCR)      │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Multi-Agent System      │
                    │   (8 Specialized Agents)  │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Blueprint Generation    │
                    │   (Beginner/Builder/      │
                    │    Hackathon Modes)       │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Implementation Guide   │
                    │   (Steps, Tools, Time)    │
                    └───────────────────────────┘
```

## 🛠️ Technology Stack

### **Frontend**
- **React 19** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **TanStack Router** - Modern routing with type-safe navigation
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library

### **PDF Processing**
- **PDF.js (pdfjs-dist)** - PDF text extraction and rendering
- **Tesseract.js** - OCR support for scanned/image-based PDFs
- **Canvas API** - PDF page rendering for OCR processing

### **State Management**
- **React Context** - Global state for research and paper data
- **Session Storage** - Temporary history storage (clears on refresh)

### **Build & Development**
- **Vite** - Fast development server and optimized builds
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript** - Static type checking

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/S0K123/blueprint-ignition-hub.git
   cd blueprint-ignition-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8083
   ```

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 How to Use

### **1. Upload or Select a Research Paper**

**Option A: Upload PDF**
- Click "Upload Research Paper PDF"
- Select a PDF file from your computer
- Wait for parsing and extraction to complete

**Option B: Choose Demo Paper**
- Select from pre-configured demo papers (Attention, Diffusion, RAG, etc.)
- Automatically generates mock extraction data

**Option C: Custom Input**
- Type a custom paper title or concept
- Creates a mock extraction based on your input

### **2. Review Extraction Results**

After parsing, you'll see:
- **Problem Statement** - What the research aims to solve
- **Research Goal** - Key objectives and contributions
- **Methodology** - Approach and techniques used
- **Models & Datasets** - Tools and data sources
- **Evaluation Metrics** - How success is measured
- **Implementation Signals** - Key technical insights

### **3. Launch Blueprint Generation**

Click "Launch Mission Control" to start the multi-agent system:
- Watch 8 agents collaborate in real-time
- See progress through different phases
- Monitor agent network activity

### **4. Get Implementation Blueprint**

Choose your development mode:
- **Beginner**: Learning-focused, step-by-step guidance
- **Builder**: Production-ready, comprehensive implementation
- **Hackathon**: Rapid prototyping with deployment focus

### **5. View Results**

The blueprint includes:
- **Actionable Steps** - Specific tasks to implement
- **Required Tools** - Libraries, frameworks, and dependencies
- **Time Estimates** - Realistic completion timeframes
- **Expected Outcomes** - What you should achieve
- **Common Mistakes** - Pitfalls to avoid
- **Difficulty Levels** - Easy, Medium, Hard indicators

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── AgentGraph.tsx    # Multi-agent visualization
│   ├── ExtractionPreview.tsx  # Research results display
│   ├── Nav.tsx           # Navigation component
│   ├── PaperHistory.tsx  # History management UI
│   ├── RealVsSimulated.tsx  # Transparency indicators (removed)
│   └── ResearchParsePanel.tsx  # PDF upload and parsing
├── lib/                  # Core logic and utilities
│   ├── paper-context.ts  # Paper state management
│   ├── paper-history.ts  # History storage system
│   ├── pdf-parser.ts     # PDF parsing with OCR
│   ├── protopapers-engine.ts  # Core engine logic
│   ├── research-context.ts    # Research state management
│   ├── research-extractor.ts  # Signal extraction
│   ├── research-types.ts     # TypeScript definitions
│   └── run-context.ts    # Run state management
└── routes/               # Page components
    ├── history.tsx       # History page
    ├── index.tsx         # Home page
    ├── mission.tsx       # Mission control page
    └── results.tsx       # Results page
```

## 🔧 Core Components

### **PDF Parser (`src/lib/pdf-parser.ts`)**
- Handles PDF text extraction using PDF.js
- Implements OCR fallback with Tesseract.js
- Supports both selectable text and scanned PDFs
- Provides comprehensive error handling

### **Research Extractor (`src/lib/research-extractor.ts`)**
- Extracts structured information from raw text
- Identifies research signals and patterns
- Organizes content into meaningful sections
- Calculates confidence scores

### **Paper History (`src/lib/paper-history.ts`)**
- Session-based storage for parsed papers
- Automatic saving of successful extractions
- Quick access to previous papers
- Clean interface for history management

### **Multi-Agent System**
- 8 specialized agents with different roles
- Real-time collaboration visualization
- Intelligent workflow orchestration
- Progress tracking and status updates

## 🎯 Use Cases

### **For Researchers**
- Transform papers into implementation guides
- Share research with development teams
- Bridge the gap between theory and practice

### **For Developers**
- Understand research papers without deep academic background
- Get step-by-step implementation guidance
- Learn best practices for specific domains

### **For Students**
- Learn how to implement research concepts
- Understand real-world applications
- Get structured learning paths

### **For Teams**
- Standardize research implementation processes
- Reduce onboarding time for new technologies
- Create shared understanding of research goals

## 🔍 Advanced Features

### **OCR Support**
- Automatically detects image-based PDFs
- Uses Tesseract.js for text recognition
- Handles multi-page documents
- Provides progress feedback during processing

### **Smart Error Handling**
- Detailed error messages for different failure modes
- Guidance for common PDF issues
- Graceful fallbacks for problematic documents
- User-friendly error reporting

### **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Optimized for different screen sizes
- Touch-friendly interface elements
- Consistent experience across devices

## 🐛 Troubleshooting

### **Common Issues**

**PDF Upload Fails**
- Check if PDF is password-protected
- Ensure file size is reasonable (<50MB)
- Try saving PDF as "Text" from source application
- Use higher quality scans for OCR

**OCR Takes Too Long**
- OCR processing can take time for large documents
- Consider using PDFs with selectable text
- Ensure good image quality for better OCR results

**History Not Showing**
- History is session-based and clears on refresh
- Ensure PDF parsing completed successfully
- Check browser console for error messages

**Performance Issues**
- Large PDFs may take longer to process
- OCR is computationally intensive
- Consider closing other browser tabs

### **Browser Compatibility**
- Chrome 90+: Full support
- Firefox 88+: Full support  
- Safari 14+: Full support
- Edge 90+: Full support

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Add appropriate error handling
- Test on multiple browsers
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PDF.js** - For PDF parsing and rendering capabilities
- **Tesseract.js** - For OCR support
- **TanStack Router** - For modern routing solution
- **shadcn/ui** - For beautiful UI components
- **TailwindCSS** - For utility-first styling

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Include browser console logs** if applicable
5. **Provide sample PDFs** if reproducible

---

**Built with ❤️ by [S0K123](https://github.com/S0K123)**

*Transforming research into reality, one paper at a time.*
