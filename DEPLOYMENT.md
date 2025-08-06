# Netlify Deployment Guide

## Quick Deploy
1. Connect your GitHub repo to Netlify
2. Netlify will auto-deploy on every push to main

## Manual Deploy
```bash
npm install -g netlify-cli
netlify login
npm run deploy
```

## Environment Variables
Add these in Netlify Dashboard:
- Any VITE_ prefixed variables your app needs

## Troubleshooting
- Build hanging? Check that build command doesn't have `exit 0`
- Routes not working? Verify _redirects file exists in public folder
- Clear cache: Netlify Dashboard > "Clear cache and deploy site"