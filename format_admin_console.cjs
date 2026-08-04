const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AdminConsole.tsx', 'utf8');

if (!code.includes('useEffect')) {
  code = code.replace(/import React, \{ useState \} from 'react';/, `import React, { useState, useEffect } from 'react';`);
}

code = code.replace(/const \[error, setError\] = useState\(''\);/, `const [error, setError] = useState('');
  
  const { currentUser } = useAppContext();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        import('../../lib/firebase').then(m => m.logout());
        setCurrentUser(null);
        setError('This account does not have admin access. You have been signed out.');
      }
    }
  }, [currentUser, navigate, setCurrentUser]);`);

fs.writeFileSync('src/components/auth/AdminConsole.tsx', code);
