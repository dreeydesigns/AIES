const fs = require('fs');
let code = fs.readFileSync('src/pages/teacher/TeacherRoster.tsx', 'utf8');

code = code.replace(/<th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Streak<\/th>/, `<th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Streak</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Linked Guardian</th>`);

code = code.replace(/<td className="px-6 py-4 text-neutral-600">\{student.streak \|\| 0\} days<\/td>/, `<td className="px-6 py-4 text-neutral-600">{student.streak || 0} days</td>
                    <td className="px-6 py-4 text-neutral-600 text-sm">
                      {student.parentIds && student.parentIds.length > 0 ? (
                        (() => {
                          const parent = users.find(u => u.id === student.parentIds?.[0]);
                          return parent ? parent.name : 'Unknown Parent';
                        })()
                      ) : (
                        <span className="text-neutral-400 italic">Not linked yet</span>
                      )}
                    </td>`);

code = code.replace(/View Report\n                      <\/button>/, `View Report
                      </button>
                      {student.parentIds && student.parentIds.length > 0 && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(\`/teacher/messages?contactId=\${student.parentIds[0]}\`);
                          }}
                          className="ml-4 text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          Message Parent
                        </button>
                      )}`);

fs.writeFileSync('src/pages/teacher/TeacherRoster.tsx', code);
