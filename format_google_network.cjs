const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');

code = code.replace(/} catch \(err: any\) \{\n\s*if \(err\.code === 'auth\/popup-blocked'\) \{ setError\('Sign in popup was blocked\. Please open the app in a new tab to sign in\.'\); \} else \{ setError\(err\.message \|\| 'Failed to sign in'\); \}/, `} catch (err: any) {
      if (err.code === 'auth/popup-blocked') { 
        setError('Sign in popup was blocked. Please open the app in a new tab to sign in.'); 
      } else if (err.message && err.message.toLowerCase().includes('offline')) {
        setError('Network error: Unable to connect to the database. Please check your connection.');
      } else { 
        setError(err.message || 'Failed to sign in'); 
      }`);

fs.writeFileSync('src/components/auth/AuthScreen.tsx', code);
