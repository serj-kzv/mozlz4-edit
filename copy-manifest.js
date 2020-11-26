const fs = require('fs-extra');

async function copyFiles () {
    try {
        await fs.copy('./manifest.json', './dist/manifest.json');
        console.log('manifest.json is copied successfully!');
    } catch (err) {
        console.error(err);
    }
}

copyFiles();
