import commandLineArgs from 'command-line-args';
import fs from 'fs';
import path from 'path';

// take in command-line arguments
const optionDefinitions = [
    { name: 'name', alias: 'n', type: String },
    { name: 'type', alias: 'y', type: String },
    { name: 'template', alias: 't', defaultValue: 'default', type: String },
    { name: 'help', alias: 'h', type: Boolean },
];
const options = commandLineArgs(optionDefinitions, { partial: true });

// check for help flag
if (options.help) {
    console.log('Usage: createNew [name] -- -t [template]');
    console.log('Options:');
    console.log('  -n, --name     Name of new file');
    console.log('  -t, --template Template to use for new file (default / minimal)');
    console.log('  -h, --help     Display this message');
    process.exit(0);
}

// check for required arguments
if (!options.name) {
    console.error('Error: Missing required argument: name');
    console.log('Usage: npm run new:person <name> -- --t [template]');
    process.exit(1);
}

// check that file doesn't exist
const filePath = path.join(__dirname, '..', options.type, options.name + '.ts');
const shortFilePath = path.relative(process.cwd(), filePath);
if (fs.existsSync(filePath)) {
    console.error(`Error: File ${shortFilePath} already exists`);
    process.exit(1);
}

// copy file
const templatePath = path.join(__dirname, '..', 'templates', options.template + options.type + '.ts');
const template = fs.readFileSync(templatePath, 'utf8');
fs.writeFileSync(filePath, template);
console.log(`Created file ${shortFilePath}! Now you can edit it to add your information.`);
