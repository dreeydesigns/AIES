const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');

code = code.replace(/user = await emailSignUp\(email, password\);\n\s*const newUser = await handleCreateNewUserDoc\(user\.uid, null, null, selectedRole\);\n\s*setCurrentUser\(\{ \.\.\.newUser, id: user\.uid \} as any\);/, `const signupResult = await emailSignUp(email, password, selectedRole, generateLinkCode());
        setCurrentUser({ ...signupResult.userData, id: signupResult.user.uid } as any);`);

fs.writeFileSync('src/components/auth/AuthScreen.tsx', code);
