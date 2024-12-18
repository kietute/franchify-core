const lib = require('ts-morph');
const fs = require('fs');
const path = require('path');

async function main() {
  const project = new lib.Project();
  const entitiesFolder = './src/entities';
  const destFilePath = './src/types/model.d.ts';

  // Ensure the entities folder exists
  if (!fs.existsSync(entitiesFolder)) {
    console.error(`Entities folder not found: ${entitiesFolder}`);
    return;
  }

  // Get all .entity.ts files in the entities folder
  const files = fs
    .readdirSync(entitiesFolder)
    .filter((file) => file.endsWith('.entity.ts'));

  if (files.length === 0) {
    console.error(`No entity files found in folder: ${entitiesFolder}`);
    return;
  }

  // Create or overwrite the destination file
  const destFile = project.createSourceFile(destFilePath, '', {
    overwrite: true,
  });

  files.forEach((file) => {
    const sourceFilePath = path.join(entitiesFolder, file);

    const sourceFile = project.addSourceFileAtPath(sourceFilePath);

    // Update to handle hyphenated files like cart-detail.entity.ts
    const className = file
      .replace('.entity.ts', '')
      .replace(/(?:^|\-)(\w)/g, (_, match) => match.toUpperCase()); // Match after hyphens and convert to uppercase
    const classDecl = sourceFile.getClass(className);

    if (classDecl) {
      // Add the interface with an export statement
      destFile.addStatements((writer) => {
        writer.writeLine(`export interface I${classDecl.getName()} {`);
        classDecl.getProperties().forEach((prop) => {
          const propName = prop.getName();
          const propType = cleanType(prop.getType().getText(sourceFile));
          writer.writeLine(`  ${propName}: ${propType};`);
        });
        writer.writeLine(`}`);
      });
    }
  });

  console.log('Generated Interface File:', destFile.getText());

  // Save the destination file
  await project.save();
}

/**
 * Cleans the type text to rename any non-JS primitive or non-String/Number types with an 'I' prefix.
 */
function cleanType(typeText) {
  const jsPrimitives = [
    'string',
    'number',
    'boolean',
    'null',
    'undefined',
    'void',
  ];

  if (jsPrimitives.includes(typeText.toLowerCase())) {
    return typeText;
  }

  if (typeText.startsWith('Array<')) {
    return typeText.replace('Array<', 'I').replace('>', '');
  }

  if (typeText.startsWith('{')) {
    return typeText;
  }

  // Otherwise, add 'I' prefix to the type
  if (typeText && !typeText.startsWith('I')) {
    return `I${typeText}`;
  }

  return typeText;
}

main().catch(console.error);
