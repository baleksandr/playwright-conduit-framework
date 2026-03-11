import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
    const filePath = path.resolve(process.cwd(), '.delete_slug');

    console.log(filePath);
    
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Видаляємо "сміття" з минулого разу
        console.log('--- Global Setup: Old cleanup data cleared ---');
    }
    console.log(filePath);
    
}
export default globalSetup;
