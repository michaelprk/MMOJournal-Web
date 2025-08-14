# MMOJournal Web - Vercel Deployment Notes

## Required Environment Variables

Set these environment variables in Vercel Dashboard → Project Settings → Environment Variables:

### Supabase Configuration
- **VITE_SUPABASE_URL**: Your Supabase project URL
  - Example: `https://rdrchntboahsdqykwngl.supabase.co`
  - Used for: Database connections and authentication

- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous public key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Used for: Client-side Supabase operations

## Deployment Configuration

### Framework Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `build/client`
- **Root Directory**: `.` (project root)

### Build Configuration
- The app is configured as a Single Page Application (SPA)
- React Router is set to client-side rendering (`ssr: false`)
- All routes are handled by the SPA rewrite rule in `vercel.json`

### Static Assets
- Background images and videos are served from `/public/images/backgrounds/`
- Shiny Pokemon sprites are served from `/public/images/shiny-sprites/`
- All static assets are properly configured for CDN delivery

### Backend Services
- The app uses Supabase as the backend (no Node.js server required)
- No serverless functions are deployed with this configuration
- Database operations are handled client-side via Supabase client

## Post-Deployment Checklist

1. ✅ Environment variables are set in Vercel dashboard
2. ✅ Build completes successfully using Vite preset
3. ✅ Site loads and displays correctly
4. ✅ Deep link URLs work (SPA routing functions properly)
5. ✅ Supabase connection works (check browser console for errors)
6. ✅ Background images and assets load correctly
7. ✅ No "Function Runtimes" errors in deployment logs

## Troubleshooting

### Common Issues
- **404 on page refresh**: Check that the SPA rewrite rule is active in `vercel.json`
- **Supabase connection errors**: Verify environment variables are set correctly
- **Asset loading issues**: Ensure all asset paths start with `/` and not relative paths
- **Build failures**: Check that React Router is in SPA mode (`ssr: false`)

### Development vs Production
- Development uses `react-router dev` with local server
- Production builds a static SPA that connects to Supabase directly
- No backend server is deployed to Vercel
