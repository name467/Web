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
 * - URL rewriting for internal links
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server'

// List of domains that should use minimal proxy (game sites, SPAs, etc.)
const MINIMAL_PROXY_DOMAINS = [
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
  // Get the URL from query parameters
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')
  const minimalMode = searchParams.get('minimal') === 'true'

  // Validate that a URL was provided
  if (!targetUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Parse the target URL to validate it
    const parsedUrl = new URL(targetUrl)
    
    // Check if this domain should use minimal proxy mode
    const useMinimalProxy = minimalMode || MINIMAL_PROXY_DOMAINS.some(domain => 
      parsedUrl.hostname.includes(domain)
    )

    // Fetch the external content
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      redirect: 'follow',
    })

    // Get the content type
    const contentType = response.headers.get('content-type') || 'text/html'
    
    // For HTML content, we need to rewrite URLs
    if (contentType.includes('text/html')) {
      let html = await response.text()
      
      // Get the base URL for rewriting
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`
      
      // MINIMAL PROXY MODE: For game sites and SPAs
      // Only add base tag and minimal script, don't rewrite URLs aggressively
      if (useMinimalProxy) {
        // Add base tag to help resolve relative URLs naturally
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
        }

        // Inject minimal script to handle navigation only when user clicks links
        const minimalScript = `
          <script>
            (function() {
              // Only intercept actual navigation clicks, not programmatic ones
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href) {
                  const href = link.getAttribute('href');
                  // Skip javascript:, #, and already proxied links
                  if (!href || href.startsWith('javascript:') || href.startsWith('#') || href.includes('/api/proxy')) {
                    return;
                  }
                  // Only intercept if it would navigate away
                  try {
                    const url = new URL(link.href);
                    if (url.origin !== '${baseUrl}') {
                      // External link - proxy it
                      e.preventDefault();
                      window.location.href = '/api/proxy?url=' + encodeURIComponent(link.href) + '&minimal=true';
                    }
                  } catch (err) {
                    // Invalid URL, let browser handle it
                  }
                }
              }, false);
            })();
          </script>
        `

        // Insert script at end of body or document
        if (html.includes('</body>')) {
          html = html.replace('</body>', `${minimalScript}</body>`)
        } else {
          html += minimalScript
        }

        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Frame-Options': 'SAMEORIGIN',
            'Cache-Control': 'no-store',
          },
        })
      }
      
      // FULL PROXY MODE: For regular websites
      
      // Rewrite relative URLs in href and src attributes to go through our proxy
      // Match href="..." or src="..." but not absolute URLs, data:, javascript:, or #
      html = html.replace(
        /(href|src|action)=["'](?!http|\/\/|data:|javascript:|#|mailto:)([^"']+)["']/gi, 
        (match, attr, path) => {
          // Handle paths that start with / vs relative paths
          const fullUrl = path.startsWith('/') 
            ? `${baseUrl}${path}` 
            : `${baseUrl}/${path}`
          return `${attr}="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )
      
      // Rewrite absolute URLs for links that start with http/https
      // This makes all links go through our proxy
      html = html.replace(
        /(href|src|action)=["'](https?:\/\/[^"']+)["']/gi,
        (match, attr, url) => {
          // Don't proxy data: or javascript: URLs
          if (url.startsWith('data:') || url.startsWith('javascript:')) {
            return match
          }
          return `${attr}="/api/proxy?url=${encodeURIComponent(url)}"`
        }
      )

      // Fix form actions to go through proxy
      html = html.replace(
        /<form([^>]*?)action=["']([^"']+)["']/gi,
        (match, attrs, action) => {
          if (action.startsWith('javascript:') || action.startsWith('#')) {
            return match
          }
          const fullUrl = action.startsWith('http') 
            ? action 
            : action.startsWith('/') 
              ? `${baseUrl}${action}` 
              : `${baseUrl}/${action}`
          return `<form${attrs}action="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )

      // Add base tag and inject a script to handle link clicks
      const injectedScript = `
        <script>
          // Intercept all link clicks to go through proxy
          document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
              // If it's not already a proxy URL, make it one
              if (!link.href.includes('/api/proxy')) {
                e.preventDefault();
                const proxyUrl = '/api/proxy?url=' + encodeURIComponent(link.href);
                window.location.href = proxyUrl;
              }
            }
          }, true);
          
          // Intercept form submissions
          document.addEventListener('submit', function(e) {
            const form = e.target;
            if (form.action && !form.action.includes('/api/proxy')) {
              e.preventDefault();
              const formData = new FormData(form);
              const params = new URLSearchParams(formData).toString();
              const url = form.action + (form.action.includes('?') ? '&' : '?') + params;
              window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
            }
          }, true);
        </script>
      `

      // Insert script before </body> or at the end
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${injectedScript}</body>`)
      } else {
        html += injectedScript
      }

      // Add base tag for remaining relative resources
      if (html.includes('<head>')) {
        html = html.replace(
          '<head>',
          `<head><base href="${baseUrl}/" target="_self">`
        )
      }

      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
          'Cache-Control': 'no-store',
        },
      })
    }

    // For CSS, rewrite url() references
    if (contentType.includes('text/css')) {
      let css = await response.text()
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`
      
      // Rewrite url() in CSS
      css = css.replace(
        /url\(["']?(?!data:|http)([^"')]+)["']?\)/gi,
        (match, path) => {
          const fullUrl = path.startsWith('/') 
            ? `${baseUrl}${path}` 
            : `${baseUrl}/${path}`
          return `url("/api/proxy?url=${encodeURIComponent(fullUrl)}")`
        }
      )

      return new NextResponse(css, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
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
      },
    })

  } catch (error) {
    console.error('Proxy error:', error)
    
    // Return a friendly error page
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
            .error-container {
              max-width: 500px;
              padding: 2rem;
            }
            h1 { color: #ff6b6b; margin-bottom: 1rem; }
            p { color: #888; margin-bottom: 1.5rem; }
            a {
              color: #00d4ff;
              text-decoration: none;
            }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>Failed to Load Page</h1>
            <p>The requested page could not be loaded. This might be due to network issues or the site blocking proxy requests.</p>
            <a href="/browser">Go back to browser</a>
          </div>
        </body>
      </html>
    `
    
    return new NextResponse(errorHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  }
}

/**
 * Handle POST requests (for form submissions)
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
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
      
      // Same URL rewriting as GET
      html = html.replace(
        /(href|src|action)=["'](?!http|\/\/|data:|javascript:|#)([^"']+)["']/gi, 
        (match, attr, path) => {
          const fullUrl = path.startsWith('/') 
            ? `${baseUrl}${path}` 
            : `${baseUrl}/${path}`
          return `${attr}="/api/proxy?url=${encodeURIComponent(fullUrl)}"`
        }
      )

      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }

    const buffer = await response.arrayBuffer()
    return new NextResponse(buffer, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    })

  } catch (error) {
    console.error('Proxy POST error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch the requested URL' },
      { status: 500 }
    )
  }
}
