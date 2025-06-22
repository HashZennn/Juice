# 🧃 JUICE - JSON UI Converter Engine

**JUICE** is a powerful web application that helps developers visualize and **edit** JSON objects through beautiful and interactive UI components. Transform complex JSON data into intuitive visual representations with multiple viewing modes and real-time editing capabilities.

## ✨ Features

### 🎯 Multiple Visualization Modes

1. **🌳 Tree View** - Hierarchical representation with expandable/collapsible nodes
2. **🃏 Card View** - Clean card-based layout with gradient backgrounds and type indicators
3. **📊 Table View** - **Interactive table with editable cells** - click to modify values and types
4. **📝 Form View** - **Complete form editor** with real-time JSON editing and two-way data binding

### 🚀 Core Capabilities

- **Real-time JSON Validation** - Instant feedback on JSON syntax errors
- **Two-way Data Binding** - Changes in Form/Table views update JSON input instantly
- **Interactive Editing** - Click to edit values, change types, and modify structure
- **Live JSON Preview** - See changes reflected across all visualization modes
- **Type-aware Rendering** - Different visual indicators for strings, numbers, booleans, objects, and arrays
- **Path Visualization** - Clear indication of property paths and nesting levels
- **Copy to Clipboard** - Easy export of JSON data with one-click copying
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Mode Support** - Beautiful dark theme for better developer experience

### 🎨 Visual Indicators

- 📦 Objects (with expandable fields)
- 📋 Arrays (with indexed items)
- 📝 Strings (editable text inputs)
- 🔢 Numbers (numeric inputs with validation)
- ✅/❌ Booleans (dropdown selectors)
- ⭕ Null values

### ⚡ Interactive Features

- **Table View**: Click any value cell to edit in-place
- **Form View**: Full CRUD operations with dropdowns for type selection
- **Real-time Sync**: All changes propagate instantly to the JSON input
- **Type Conversion**: Change data types with automatic value conversion
- **Export Controls**: Copy modified JSON or reset to original data

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js with Turbo
- **Language**: TypeScript for type safety

## 🎮 Usage

1. **Enter JSON Data**: Use the left panel to input your JSON data or click "Load Example"
2. **Choose Visualization Mode**: Select from Tree, Card, Table, or Form view using the mode buttons
3. **Explore & Edit**: 
   - **Table View**: Click on any value cell to edit directly
   - **Form View**: Use form controls to modify values, change types, and edit structure
   - **Tree/Card Views**: Explore data structure with visual navigation
4. **Real-time Sync**: Watch as changes in Form/Table views update the JSON input automatically
5. **Export**: Copy your modified JSON data to clipboard or reset to original

### Interactive Editing

- **Form View**: Complete editing environment with type dropdowns and value inputs
- **Table View**: Spreadsheet-like editing with click-to-edit cells
- **Two-way Binding**: Changes sync instantly between visualization and JSON input
- **Type Safety**: Automatic type conversion and validation

### Example JSON

The app comes with a sample JSON structure featuring:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": {
      "age": 30,
      "city": "New York",
      "interests": ["coding", "music", "travel"],
      "isActive": true
    }
  },
  "posts": [
    {
      "id": 1,
      "title": "Hello World",
      "content": "This is my first post",
      "tags": ["introduction", "hello"]
    }
  ]
}
```

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Use Cases

- **API Response Visualization & Editing** - Understand and modify complex API responses
- **Configuration File Management** - Visually edit config files and schemas
- **Data Structure Exploration** - Navigate and modify large JSON datasets
- **Debugging & Testing** - Identify and fix data structure issues quickly
- **Documentation** - Create visual documentation of JSON schemas
- **Teaching & Learning** - Help others understand JSON structure and editing
- **Rapid Prototyping** - Quick JSON data creation and modification
- **Form Generation** - Use JSON data to create interactive forms

## 🔮 Future Enhancements

- [ ] **Property Name Editing** - Change object property names in Form view
- [ ] **Add/Remove Properties** - Dynamic structure modification
- [ ] JSON Schema validation and generation
- [ ] Export to different formats (CSV, XML, YAML)
- [ ] Search and filter functionality across large datasets
- [ ] Custom visualization themes and color schemes
- [ ] Diff comparison between JSON objects
- [ ] Save/load favorite JSON snippets and templates
- [ ] Real-time collaboration features
- [ ] Plugin system for custom visualizers and editors
- [ ] Undo/Redo functionality for editing operations
- [ ] Import from various data sources (APIs, files, databases)

## 👥 Contributors

We'd like to thank the following contributors who helped make JUICE possible:

- **Echoinbyte** - Core development and architecture
- **Hashzennn** - UI/UX design and feature implementation  
- **AI (Claude Sonnet 4)** - Development assistance and code optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for developers who love clean, visual JSON exploration.
