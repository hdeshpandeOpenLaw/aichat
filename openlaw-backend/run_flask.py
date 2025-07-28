#!/usr/bin/env python3
"""
Flask Application Startup Script
Legal Document Generation Application
"""

import os
import sys
from app import app

def check_environment():
    """Check if required environment variables are set"""
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ Error: GEMINI_API_KEY environment variable is not set")
        print("Please check your .env file contains: GEMINI_API_KEY='your-api-key-here'")
        return False
    
    if not os.path.exists('attorneys_data.json'):
        print("❌ Error: attorneys_data.json file not found")
        print("Please ensure the attorneys data file is in the current directory")
        return False
    
    print("✅ Environment check passed")
    return True

def main():
    """Main startup function"""
    print("🚀 Starting Legal Document Generation Application (Flask)")
    print("=" * 60)
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    print("📋 Application Features:")
    print("  • Document Generation (Rental Agreements, Contracts, etc.)")
    print("  • File Upload & Analysis (PDF, Word documents)")
    print("  • Lawyer Search & Matching")
    print("  • Chat-based Legal Assistance")
    print("  • .docx Download Functionality")
    print()
    
    print("🌐 Server will be available at: http://localhost:8000")
    print("📁 Frontend: Open landing.html in your browser")
    print("🔄 Auto-reload: Enabled (development mode)")
    print()
    
    try:
        # Start Flask application
        app.run(
            debug=True,
            host='0.0.0.0',
            port=8000,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 