import fs from 'fs';
import archiver from 'archiver';
import path from 'path';

/**
 * Zip one or multiple files into a single archive
 * @param {string[]} filePaths - Array of absolute file paths to zip
 * @param {string} outputZipPath - Absolute path for the output zip file
 * @returns {Promise<string>} - Resolves with output zip path
 */
export function zipFiles(filePaths, outputZipPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(outputZipPath));
        archive.on('error', err => reject(err));

        archive.pipe(output);
        filePaths.forEach(file => {
            archive.file(file, { name: path.basename(file) });
        });
        archive.finalize();
    });
}