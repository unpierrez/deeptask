const fs = require('fs');
const path = require('path');

const processDir = (dir) => {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      // Don't recurse into newly created dirs to avoid infinite loop
    } else if (fullPath.endsWith('.vue') && item !== 'App.vue') {
      const fileName = path.basename(item, '.vue');
      const folderName = fileName;
      const newFolderPath = path.join(dir, folderName);

      if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath);
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      const scriptMatch = content.match(/<script setup lang="ts">([\s\S]*?)<\/script>/);

      if (scriptMatch) {
        let scriptContent = scriptMatch[1].trim();

        // extract imports
        const importRegex = /import\s+.*?\s+from\s+['"].*?['"](;|)/g;
        let imports = [];
        let scriptBody = scriptContent.replace(importRegex, (match) => {
          imports.push(match);
          return '';
        }).trim();

        const newImports = imports.map(i => {
          // adjust relative paths for going one level deeper
          return i.replace(/from\s+['"](\.\/|\.\.\/)(.*?)['"]/, (m, p1, p2) => {
            return 'from "../' + p1 + p2 + '"';
          });
        });

        const hookName = 'use' + fileName;
        const hookPath = path.join(newFolderPath, hookName + '.ts');

        // Extract refs and functions to return
        const constMatches = scriptBody.match(/(?:const|let|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        const returns = Array.from(new Set(constMatches.map(m => m.split(/\s+/)[1])));

        const hookContent = `${newImports.join('\n')}

export function ${hookName}() {
${scriptBody.split('\n').map(l => '  ' + l).join('\n')}

  return {
    ${returns.join(',\n    ')}
  }
}
`;
        fs.writeFileSync(hookPath, hookContent.replace(/\r\n/g, '\n'));

        // new vue file
        const newVueContent = content.replace(scriptMatch[0], `<script setup lang="ts">
${newImports.filter(i => i.includes('.vue') || i.includes('vue-router') || i.includes('vue') || i.includes('icons')).join('\n')}
import { ${hookName} } from './${hookName}'

const { ${returns.join(', ')} } = ${hookName}()
</script>`);
        fs.writeFileSync(path.join(newFolderPath, fileName + '.vue'), newVueContent);
        if (fullPath !== path.join(newFolderPath, fileName + '.vue')) {
          fs.unlinkSync(fullPath);
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'components'));
processDir(path.join(__dirname, 'src', 'components', 'ui'));
processDir(path.join(__dirname, 'src', 'views'));
