const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(/allow update: if \(isOwner\(userId\) && request\.resource\.data\.role == resource\.data\.role\)/, `allow update: if (isOwner(userId) && request.resource.data.role == resource.data.role)`);

// Wait, the current rules are:
// allow update: if (isOwner(userId) && request.resource.data.role == resource.data.role)
// || (
//   isSignedIn() 
//   && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['parentIds'])
//   // Ensure they are only adding their own uid
//   && request.resource.data.parentIds.hasAll([request.auth.uid])
// );

// Does this satisfy "the 'role' field is only settable during document creation and is immutable by the client thereafter, and restrict updates to own-user documents"?
// If not, let's write it explicitly using diff:

code = code.replace(/allow update: if \(isOwner\(userId\) && request\.resource\.data\.role == resource\.data\.role\)[\s\S]*?\);\n/g, `allow update: if (isOwner(userId) && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])))
                    || (
                      isSignedIn() 
                      && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['parentIds'])
                      && request.resource.data.parentIds.hasAll([request.auth.uid])
                    );
`);

fs.writeFileSync('firestore.rules', code);
