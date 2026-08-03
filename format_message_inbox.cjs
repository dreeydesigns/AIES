const fs = require('fs');
let code = fs.readFileSync('src/components/MessageInbox.tsx', 'utf8');

code = code.replace(/import React, \{ useState \} from 'react';/, `import React, { useState, useEffect } from 'react';\nimport { useSearchParams } from 'react-router-dom';`);

code = code.replace(/export default function MessageInbox\(\{ currentUser, contacts \}: MessageInboxProps\) \{/, `export default function MessageInbox({ currentUser, contacts }: MessageInboxProps) {
  const [searchParams] = useSearchParams();
  const initialContactId = searchParams.get('contactId');`);

code = code.replace(/const \[selectedContact, setSelectedContact\] = useState<any \| null>\(null\);/, `const [selectedContact, setSelectedContact] = useState<any | null>(null);

  useEffect(() => {
    if (initialContactId && contacts.length > 0 && !selectedContact) {
      const contact = contacts.find(c => c.id === initialContactId);
      if (contact) setSelectedContact(contact);
    }
  }, [initialContactId, contacts, selectedContact]);`);

fs.writeFileSync('src/components/MessageInbox.tsx', code);
