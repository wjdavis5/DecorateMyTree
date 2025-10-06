/**
 * Cloudflare Worker for Holiday Tree Decorator
 * Serves the Angular SPA with proper routing support
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      // Handle API requests if needed (future extension)
      if (pathname.startsWith('/api/')) {
        return new Response('API endpoint', { status: 404 });
      }

      // Get the asset from KV or R2 bucket
      // For static files, try to fetch directly
      let response = await env.ASSETS.fetch(request);
      
      // If not found and it's not a file extension, serve index.html for SPA routing
      if (response.status === 404 && !pathname.includes('.')) {
        response = await env.ASSETS.fetch(new URL('/index.html', request.url));
      }

      // Add security headers
      const headers = new Headers(response.headers);
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-XSS-Protection', '1; mode=block');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Add cache headers for static assets
      if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (pathname === '/index.html' || pathname === '/') {
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
    } catch (error) {
      return new Response('Internal Server Error', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
