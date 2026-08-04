const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');

code = code.replace(/} catch \(err: any\) \{\n\s*setError\(err\.message \|\| 'Authentication failed'\);\n\s*\}/, `} catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please select "Back to Login" and sign in instead.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    }`);

fs.writeFileSync('src/components/auth/AuthScreen.tsx', code);
