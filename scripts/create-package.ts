import fs from 'node:fs';
import path from 'node:path';

(async () => {
  const sourcePath = path.resolve('./');
  const fromPath = path.resolve('./dist');

  // copy package.json to build out
  const originalPackage = fs.readFileSync(
    path.join(sourcePath, 'package.json'),
  );
  const packageParsed = JSON.parse(originalPackage.toString());

  delete packageParsed.scripts;
  delete packageParsed.devDependencies;
  delete packageParsed.commitlint;
  delete packageParsed.config;

  const newPackage = JSON.stringify(packageParsed, null, 2);

  fs.writeFileSync(path.join(fromPath, 'package.json'), newPackage);
  console.info('package.json copied to build out');
})();
