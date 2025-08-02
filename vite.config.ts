import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MathSolverPro/', // 🔥 Ye line add karni hai
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
