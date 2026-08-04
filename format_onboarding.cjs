const fs = require('fs');
let code = fs.readFileSync('src/components/auth/Onboarding.tsx', 'utf8');

code = code.replace(/import \{ doc, updateDoc, collection, query, where, getDocs, arrayUnion \} from 'firebase\/firestore';/, `import { doc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';\nimport { linkChildByCode } from '../../lib/linkUtils';`);

code = code.replace(/try \{\n\s*\/\/ Find the student with this link code[\s\S]*?setCurrentUser\(\{ \.\.\.currentUser, childIds: newChildIds \}\);\n\s*setLinkCodeInput\(''\);\n\s*\/\/ Optionally we could add a success message or just navigate\n\s*navigate\(\`\/\$\{currentUser.role\}\`\);\n\s*\} catch \(err: any\) \{/, `try {
      const studentId = await linkChildByCode(currentUser.id, linkCodeInput);
      const newChildIds = [...(currentUser.childIds || []), studentId];
      setCurrentUser({ ...currentUser, childIds: newChildIds });
      
      setLinkCodeInput('');
      navigate(\`/\${currentUser.role}\`);
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred while linking. Please try again.');
      }`);

fs.writeFileSync('src/components/auth/Onboarding.tsx', code);
