# Deployment Guide - Cloudflare Workers

This application is deployed using Cloudflare Workers with static asset serving.

## Architecture

### Cloudflare Worker
The application uses a custom Worker script (`worker.js`) that:

1. **Serves Static Assets**: All Angular build artifacts (JS, CSS, images, fonts)
2. **SPA Routing**: Redirects non-file requests to `index.html` for client-side routing
3. **Security Headers**: Adds security headers to all responses
4. **Caching Strategy**: 
   - Static assets (JS/CSS/images): 1 year cache with immutable flag
   - HTML files: No cache, must revalidate

### Configuration

The `wrangler.toml` file configures:
- Worker name: `holiday-tree-app`
- Main script: `worker.js`
- Assets directory: `dist/holiday-tree-app/browser`
- Assets binding: `ASSETS` (accessible in Worker as `env.ASSETS`)

## Deployment Process

### Prerequisites
1. Cloudflare account
2. Wrangler CLI installed (included in dev dependencies)
3. Authenticated with Wrangler: `npx wrangler login`

### Deploy to Production

```bash
# Build and deploy in one command
npm run deploy

# Or step by step
npm run build:prod
npx wrangler deploy
```

### Deploy to Preview

```bash
npx wrangler deploy --dry-run
```

### View Deployment

After deployment, your app will be available at:
- Production: `https://holiday-tree-app.<your-subdomain>.workers.dev`
- Custom domain: Configure in Cloudflare dashboard

## Environment Variables

Set environment variables in `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
```

For secrets (not in version control):
```bash
npx wrangler secret put SECRET_NAME
```

## Monitoring

- View logs: `npx wrangler tail`
- Dashboard: https://dash.cloudflare.com/

## Troubleshooting

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Deployment fails
- Verify authentication: `npx wrangler whoami`
- Check wrangler.toml syntax
- Ensure assets directory exists after build

### Worker errors
- Check worker logs: `npx wrangler tail`
- Test locally: `npx wrangler dev` (after implementing local dev support)

## Migration from Cloudflare Pages

This app was migrated from Cloudflare Pages to Workers for:
- More control over caching and headers
- Better performance with edge computing
- Custom routing logic
- Unified deployment with Workers infrastructure

The migration involved:
1. Creating `worker.js` to handle requests
2. Updating `wrangler.toml` from Pages to Workers configuration
3. Changing deploy command from `wrangler pages deploy` to `wrangler deploy`
