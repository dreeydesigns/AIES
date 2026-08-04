const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');

const regex = /\} catch \(err: any\) \{[\s\S]*?finally \{[\s\S]*?\n\s*\};\n/m;
code = code.replace(regex, `} catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please select "Back to Login" and sign in instead.');
      } else if (err.message && err.message.toLowerCase().includes('offline')) {
        setError('Network error: Unable to connect to the server. Please check your internet connection.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error: Failed to connect to authentication server.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };\n`);

fs.writeFileSync('src/components/auth/AuthScreen.tsx', code);
