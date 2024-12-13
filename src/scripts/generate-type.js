const fs = require('fs');
const path = require('path');

function generateTypeFile(dirPath, destDir, destFileName) {
  const files = fs.readdirSync(dirPath);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const outputFilePath = path.join(destDir, destFileName);
  let combinedInterfaces = '';

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      generateTypeFile(filePath, destDir);
    } else if (
      stats.isFile() &&
      (file.endsWith('.entity.ts') || file.endsWith('.dto.ts'))
    ) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const interfaces = generateInterface(content);
      if (interfaces) {
        combinedInterfaces += `\n\n${interfaces}`;
      }
    }
  });

  if (combinedInterfaces) {
    fs.writeFileSync(outputFilePath, combinedInterfaces.trim(), 'utf-8');
    console.log(`Generated types at: ${outputFilePath}`);
  }
}

function generateInterface(content) {
  const interfaces = [];

  // Tìm các interface đã được khai báo sẵn
  const predefinedInterfaces = content.match(
    /export interface \w+ \{[^\}]+\}/g,
  );
  if (predefinedInterfaces) {
    interfaces.push(...predefinedInterfaces);
  }

  const classNameMatch = content.match(/export class (\w+)/);

  if (!classNameMatch) {
    console.error('Cannot find class name');
    return interfaces.join('\n\n');
  }

  const className = classNameMatch[1];
  const properties = [];

  const propertyMatches = content.matchAll(
    /@(PrimaryGeneratedColumn|Column|ManyToOne|OneToMany|CreateDateColumn|UpdateDateColumn|JoinColumn|Expose|Type|IsOptional|IsNumber|IsObject|IsString).*(\n\s+)([\w?]+): (\w+|\w+\[\]);/g,
  );

  for (const match of propertyMatches) {
    const [, decorator, , name, type] = match;
    const mappedType = mapType(type.replace(/\[\]/g, '[]'));
    properties.push(`${name}: ${mappedType};`);
  }

  // Tạo interface từ class
  const interfaceName = `I${className}`;
  const interfaceContent = `export interface ${interfaceName} {
    ${properties.join('\n  ')}
  }`;

  interfaces.push(interfaceContent);

  return interfaces.join('\n\n');
}

// Hàm để chuyển đổi từ kiểu TypeScript sang kiểu trong interface
function mapType(type) {
  switch (type) {
    case 'number':
      return 'number';
    case 'Date':
      return 'string';
    case 'any':
      return 'any';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'string[]':
      return 'string[]';
    case 'number[]':
      return 'number[]';
    case 'boolean[]':
      return 'boolean[]';

    default:
      return `I${type}`;
  }
}
// Example usage
const rootDir = __dirname;

const entityDir = path.join(rootDir, '../../src/entities');
const modalDestDir = path.join(rootDir, '../../src/types');

const dtoDir = path.join(rootDir, '../../src/dtos');
const dtoDestDir = path.join(rootDir, '../../src/types');

generateTypeFile(entityDir, modalDestDir, 'model.d.ts');
generateTypeFile(dtoDir, dtoDestDir, 'payload.d.ts');
