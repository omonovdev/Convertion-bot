import fs from 'fs';
import path from 'path';
import config from '../config/config.js';

/**
 * Papkalarni yaratish
 */
export function createDirectories() {
    const dirs = [
        path.join(process.cwd(), config.tempDir),
        path.join(process.cwd(), config.downloadsDir)
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Papka yaratildi: ${dir}`);
        }
    });
}

/**
 * Faylni yuklab olish
 * @param {Object} ctx - Telegraf context
 * @param {string} fileId - Telegram fayl ID
 * @param {string} fileName - Fayl nomi
 * @returns {Promise<string>} - Yuklab olingan fayl yo'li
 */
export async function downloadFile(ctx, fileId, fileName) {
    try {
        // Fayl hajmini tekshirish (cheklov olib tashlandi - istalgan hajm)
        const file = await ctx.telegram.getFile(fileId);
        // if (file.file_size > config.maxFileSize) {
        //     throw new Error(`Fayl hajmi ${(config.maxFileSize / 1024 / 1024).toFixed(1)}MB dan oshmasligi kerak`);
        // }

        const fileLink = await ctx.telegram.getFileLink(fileId);
        const response = await fetch(fileLink.href);
        const buffer = await response.arrayBuffer();
        const filePath = path.join(process.cwd(), config.downloadsDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        return filePath;
    } catch (error) {
        console.error('Fayl yuklab olishda xatolik:', error);
        throw error;
    }
}

/**
 * Vaqtinchalik fayllarni tozalash
 * @param {Array<string>} filePaths - O'chiriladigan fayllar yo'llari
 */
export function cleanupFiles(filePaths) {
    filePaths.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Fayl o'chirildi: ${path.basename(filePath)}`);
            }
        } catch (error) {
            console.error('Faylni o\'chirishda xatolik:', error);
        }
    });
}

/**
 * Fayl formatini tekshirish
 * @param {string} fileName - Fayl nomi
 * @param {Array<string>} allowedFormats - Ruxsat etilgan formatlar
 * @returns {boolean}
 */
export function isValidFormat(fileName, allowedFormats) {
    const ext = path.extname(fileName).toLowerCase();
    return allowedFormats.includes(ext);
}

/**
 * Unique fayl nomi yaratish
 * @param {string} originalName - Asl fayl nomi
 * @param {string} newExtension - Yangi kengaytma
 * @returns {string}
 */
export function generateFileName(originalName, newExtension) {
    const baseName = path.basename(originalName, path.extname(originalName));
    const timestamp = Date.now();
    return `${baseName}_${timestamp}${newExtension}`;
}

/**
 * Fayl hajmini formatlash
 * @param {number} bytes - Baytlar
 * @returns {string}
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default {
    createDirectories,
    downloadFile,
    cleanupFiles,
    isValidFormat,
    generateFileName,
    formatFileSize
};
