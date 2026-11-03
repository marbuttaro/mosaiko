import { defineConfig } from '@playwright/test'
const remoteBaseURL=process.env.SMOKE_BASE_URL
export default defineConfig({
  testDir:'./tests/e2e',outputDir:'./test-results/e2e',fullyParallel:false,workers:1,timeout:60000,
  use:{baseURL:remoteBaseURL||'http://127.0.0.1:3100',trace:'retain-on-failure'},
  ...(remoteBaseURL?{grep:/all seeded articles|all migration redirects|robots, RSS|public smoke/}:{}),
  reporter:[['list'],['html',{open:'never'}]],
  webServer:remoteBaseURL?undefined:[
    {command:'node tests/mock-supabase.mjs',url:'http://127.0.0.1:54329/health',reuseExistingServer:false},
    {command:'npm run dev -- --port 3100',url:'http://127.0.0.1:3100',timeout:120000,reuseExistingServer:false,env:{NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_ANON_KEY:'test-anon-key'}},
  ],
})
