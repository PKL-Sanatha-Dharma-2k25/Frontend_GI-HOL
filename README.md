# React + Vite Template

<p align="center">
  <img src="./Login.png" width="400" alt="Login Page">
</p>

## About

Template project berbasis React + Vite dengan setup minimal dan HMR (Hot Module Replacement) yang cepat. Template ini sudah terintegrasi dengan beberapa library populer untuk development yang lebih produktif.

### Teknologi & Library

- **React** - UI library
- **Vite** - Build tool dan development server yang super cepat
- **ESLint** - Code quality dan best practices
- **Tailwind CSS** - Utility-first CSS framework (opsional)
- **DataTable** - Table management library
- **SweetAlert2** - Beautiful alert/modal dialogs
- **Select2** - Enhanced select dropdowns

## Installation

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn

### Steps

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd nama-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment (jika diperlukan)**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build untuk production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
project-root/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── styles/         # CSS files
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server dengan HMR |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint untuk check code quality |

## Features

- ⚡ **Vite** - Ultra-fast build dan development
- 🔄 **HMR** - Hot Module Replacement untuk instant updates
- 📦 **Lightweight** - Minimal dan optimized setup
- 🎨 **UI Libraries** - DataTable, SweetAlert2, Select2 terintegrasi
- ✅ **ESLint** - Code quality pre-configured

## React Compiler

React Compiler tidak diaktifkan secara default karena dampaknya terhadap performance dev & build. Untuk mengaktifkannya, lihat [React Compiler Installation Guide](https://react.dev/learn/react-compiler/installation).

## TypeScript Support

Untuk production applications, recommend menggunakan TypeScript. Lihat [Vite TS Template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) untuk setup instructions.

## Official Plugins

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** - Menggunakan Babel untuk Fast Refresh
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react)** - Menggunakan SWC untuk kompilasi lebih cepat

## Tips Development

- Gunakan `.env` file untuk environment variables
- Import CSS langsung di component untuk scoped styling
- Manfaatkan HMR untuk real-time development
- Run `npm run lint` sebelum commit untuk ensure code quality

## Troubleshooting

**Port sudah terpakai?**
```bash
npm run dev -- --port 3000
```

**Build gagal?**
```bash
rm -rf node_modules
npm install
npm run build
```

## Learn More

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [ESLint Guide](https://eslint.org)