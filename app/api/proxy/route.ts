/**
 * ============================================
 * PROXY API ROUTE
 * ============================================
 * 
 * This API route acts as a proxy server to fetch external websites.
 * It helps bypass CORS restrictions when loading external sites.
 * 
 * HOW IT WORKS:
 * 1. Client sends a request with a URL parameter
 * 2. Server fetches the external content
 * 3. Server returns the content with modified headers
 * 4. Client can display the content in an iframe
 * 
 * FEATURES:
 * - DuckDuckGo search integration
 * - General web browsing through proxy
 * - Special handling for game sites (minimal rewriting)
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server'

// List of domains that need special game-site handling
const GAME_SITE_DOMAINS = [
  'gn-math.dev',
  'mathsspot.com',
  'coolmathgames.com',
  'poki.com',
  'crazygames.com',
  'y8.com',
  'kizi.com',
  'miniclip.com',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    const parsedUrl = new URL(targetUrl)
    
    // Check if this is a game site that needs special handling
    const isGameSite = GAME_SITE_DOMAINS.some(domain => 
      parsedUrl.hostname.includes(domain)
    )

    // Fetch the external content
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      redirect: 'follow',
    })

    const contentType = response.headers.get('content-type') || 'text/html'
    
    // For HTML content
    if (contentType.includes('text/html')) {
      let html = await response.text()
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`
      
      // For game sites: minimal intervention - just add base tag
      // This allows the game's JavaScript to work properly
      if (isGameSite) {
        // Add base tag to resolve relative URLs
        if (html.includes('<head>')) {
          html = html.replace(
            '<head>',
            `<head><base href="${baseUrl}/">`
          )
        } else if (html.includes('<html')) {
          html = html.replace(
            /(<html[^>]*>)/i,
            `$1<head><base href="${baseUrl}/"></head>`
          )
        } else {
          html = `<base href="${baseUrl}/">` + html
        }

        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
      
      // For regular websites: full URL rewriting
      
      // Rewrite relative URLs
      html = html.replace(
        /(href|src|action)=["'](?!http|\/\/|data:|javascript:|#|mailto:)([^"']+)["']/gi, 
        (match, attr, path) => {
          const fullUrl = path.startsWith('/') 
            ? `${baseUrl}${path}` 
            : `${baseUrl}/${path}`
          return `${attr}="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )
      
      // Rewrite absolute URLs
      html = html.replace(
        /(href|src|action)=["'](https?:\/\/[^"']+)["']/gi,
        (match, attr, url) => {
          if (url.startsWith('data:') || url.startsWith('javascript:')) {
            return match
          }
          return `${attr}="/api/proxy?url=${encodeURIComponent(url)}"`
        }
      )

      // Inject script to handle link clicks
      const injectedScript = `
        <script>
          document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
              if (!link.href.includes('/api/proxy')) {
                e.preventDefault();
                window.location.href = '/api/proxy?url=' + encodeURIComponent(link.href);
              }
            }
          }, true);
        </script>
      `

      if (html.includes('</body>')) {
        html = html.replace('</body>', `${injectedScript}</body>`)
      } else {
        html += injectedScript
      }

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head><base href="${baseUrl}/" target="_self">`)
      }

      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    // For CSS - pass through as-is for game sites, rewrite for regular sites
    if (contentType.includes('text/css')) {
      const css = await response.text()
      return new NextResponse(css, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // For other content types (JS, images, etc.), pass through
    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('Proxy error:', error)
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error Loading Page</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: #0a0a0a;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              text-align: center;
            }
            .error-container { max-width: 500px; padding: 2rem; }
            h1 { color: #ff6b6b; margin-bottom: 1rem; }
            p { color: #888; margin-bottom: 1.5rem; }
            a { color: #00d4ff; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>Failed to Load Page</h1>
            <p>The requested page could not be loaded.</p>
            <a href="/browser">Go back to browser</a>
          </div>
        </body>
      </html>
    `
    
    return new NextResponse(errorHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const body = await request.text()
    const parsedUrl = new URL(targetUrl)

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': request.headers.get('content-type') || 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      body: body,
      redirect: 'follow',
    })

    const contentType = response.headers.get('content-type') || 'text/html'
    
    if (contentType.includes('text/html')) {
      let html = await response.text()
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`
      
      html = html.replace(
        /(href|src|action)=["'](?!http|\/\/|data:|javascript:|#)([^"']+)["']/gi, 
        (match, attr, path) => {
          const fullUrl = path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`
          return `${attr}="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )

      return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const buffer = await response.arrayBuffer()
    return new NextResponse(buffer, {
      status: response.status,
      headers: { 'Content-Type': contentType },
    })

  } catch (error) {
    console.error('Proxy POST error:', error)
    return NextResponse.json({ error: 'Failed to fetch the requested URL' }, { status: 500 })
  }
}
