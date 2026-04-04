<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Force HTTPS Middleware
 * 
 * Redirects all HTTP requests to HTTPS in production
 * Ensures secure communication and prevents MITM attacks
 */
class ForceHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only enforce HTTPS in production environment
        if (app()->environment('production') && !$request->secure()) {
            // Redirect to HTTPS version with 301 (permanent redirect)
            return redirect()->secure($request->getRequestUri(), 301);
        }

        return $next($request);
    }
}
