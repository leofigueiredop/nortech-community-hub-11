import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Walk through directory recursively
 */
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && file.endsWith('.json')) {
      callback(filePath);
    }
  });
}

/**
 * Generate a version hash based on content
 */
function generateVersion() {
  const hash = crypto.createHash('md5');
  const sourceDir = path.join(__dirname, '../public/locales');
  
  // Hash all translation files content
  walkDir(sourceDir, (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    hash.update(content);
  });
  
  return hash.digest('hex').slice(0, 8);
}

// Configuration
const config = {
  sourceDir: path.join(__dirname, '../public/locales'),
  outputDir: path.join(__dirname, '../dist/cdn/translations'),
  version: process.env.TRANSLATIONS_VERSION || generateVersion(),
  languages: ['en-US', 'pt-BR'],
  namespaces: ['common', 'forms', 'features', 'auth', 'navigation', 'plurals']
};

/**
 * Process translation files
 */
function processTranslations() {
  // Create output directory structure
  const versionDir = path.join(config.outputDir, config.version);
  fs.mkdirSync(versionDir, { recursive: true });
  
  // Process each language and namespace
  config.languages.forEach(language => {
    const langDir = path.join(versionDir, language);
    fs.mkdirSync(langDir, { recursive: true });
    
    config.namespaces.forEach(namespace => {
      const sourcePath = path.join(config.sourceDir, language, `${namespace}.json`);
      const outputPath = path.join(langDir, `${namespace}.json`);
      
      if (fs.existsSync(sourcePath)) {
        // Read and minify JSON
        const content = fs.readFileSync(sourcePath, 'utf8');
        const minified = JSON.stringify(JSON.parse(content));
        
        // Write to output directory
        fs.writeFileSync(outputPath, minified);
        console.log(`Processed: ${language}/${namespace}`);
      } else {
        console.warn(`Missing translation: ${language}/${namespace}`);
      }
    });
  });
  
  // Generate version manifest
  const manifest = {
    version: config.version,
    timestamp: new Date().toISOString(),
    languages: config.languages,
    namespaces: config.namespaces
  };
  
  fs.writeFileSync(
    path.join(config.outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\nTranslation build complete!');
  console.log(`Version: ${config.version}`);
  console.log(`Output: ${config.outputDir}`);
}

// Run the build process
processTranslations(); 