import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

// Vite 설정
export default defineConfig({
  plugins: [
    react(),
    svgrPlugin({
      // 옵션 설정 (필수는 아님)
      svgrOptions: {
        icon: true, // 뷰박스를 설정해주어 아이콘으로 사용 가능하게 설정
      },
    }),
  ],
})