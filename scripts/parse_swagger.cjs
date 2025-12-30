const fs = require('fs');

const files = [
    'api-specs/2.4.8/swagger-paas.json',
    'api-specs/2.4.8/swagger-saas.json'
];

files.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log(`File not found: ${file}`);
        return;
    }

    console.log(`\n--- Parsing ${file} ---\n`);
    const content = fs.readFileSync(file, 'utf8');
    const swagger = JSON.parse(content);

    const paths = swagger.paths || {};
    const endpoints = [];

    Object.keys(paths).forEach(path => {
        Object.keys(paths[path]).forEach(method => {
            const operation = paths[path][method];
            endpoints.push({
                method: method.toUpperCase(),
                path: path,
                summary: operation.summary || '',
                operationId: operation.operationId || ''
            });
        });
    });

    console.log(`Total endpoints: ${endpoints.length}`);

    // List endpoints for important groups
    const importantGroups = ['company', 'companyCredits'];

    console.log('\n--- Company Endpoints ---\n');
    importantGroups.forEach(group => {
        console.log(`\n### ${group.toUpperCase()} ###`);
        const groupEndpoints = endpoints.filter(ep => {
            const parts = ep.path.split('/').filter(p => p);
            return parts.length > 0 && (parts[0] === group || (parts[0] === 'V1' && parts[1] === group));
        });

        groupEndpoints.forEach(ep => {
            console.log(`- ${ep.method} ${ep.path} : ${ep.summary}`);
        });
    });
});
