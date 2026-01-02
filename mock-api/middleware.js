module.exports = (req, res, next) => {
  // Add delay to simulate network latency
  setTimeout(() => {
    // Simulate JWT validation
    const authHeader = req.headers.authorization;
    
    // Public endpoints that don't require authentication
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/api/health'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      req.path.startsWith(endpoint)
    );
    
    if (isPublicEndpoint) {
      // Allow public endpoints
      next();
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // Allow request with valid token
      next();
    } else {
      // Return 401 Unauthorized
      res.status(401).json({ 
        success: false, 
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'Authentication required' 
        } 
      });
    }
  }, 500); // 500ms delay
};

