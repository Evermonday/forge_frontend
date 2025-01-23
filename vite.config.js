import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',
    plugins: [react()],
    server: {    
        // port: 3000, 
    },
})
