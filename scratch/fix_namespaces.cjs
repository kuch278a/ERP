const fs = require('fs');

const targetPath = 'C:/Users/X/Documents/Ashara-ERP/routes/api.php';

// Read file or write with double backslashes
let content = fs.readFileSync(targetPath, 'utf8');

// Fix namespaces
content = content.replace('use IlluminateHttpRequest;', 'use Illuminate\\Http\\Request;');
content = content.replace('use IlluminateSupportFacadesRoute;', 'use Illuminate\\Support\\Facades\\Route;');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Fixed namespaces in api.php');
