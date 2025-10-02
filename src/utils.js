import fs from 'fs';
import path from 'path';
import config from './config/config.js';

/**
 * Kerakli papkalarni yaratish
 */
export function createDirectories() {
    [config.tempDir, config.downloadsDir].forEach(dir => {
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
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const response = await fetch(fileLink.href);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
    const filePath = path.join(config.downloadsDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(buffer));

        console.log(`📥 Fayl yuklab olindi: ${fileName}`);
        return filePath;
    } catch (error) {
        console.error('Fayl yuklab olishda xatolik:', error);
        throw new Error('Fayl yuklab olishda xatolik yuz berdi');
    }
}

/**
 * Vaqtinchalik fayllarni tozalash
 * @param {Array<string>} filePaths - O'chiriladigan fayllar yo'llari
 */
export function cleanupFiles(filePaths) {
    if (!Array.isArray(filePaths)) {
        filePaths = [filePaths];
    }

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
 * Fayl hajmini tekshirish
 * @param {number} fileSize - Fayl hajmi bytes da
 * @returns {boolean} - Hajm mos kelsa true
 */
export function validateFileSize(fileSize) {
    return fileSize <= config.maxFileSize;
}

/**
 * Fayl formatini tekshirish
 * @param {string} fileName - Fayl nomi
 * @param {Array<string>} allowedFormats - Ruxsat etilgan formatlar
 * @returns {boolean} - Format mos kelsa true
 */
export function validateFileFormat(fileName, allowedFormats) {
    const ext = path.extname(fileName).toLowerCase();
    return allowedFormats.includes(ext);
}

/**
 * Unique fayl nomi yaratish
 * @param {string} prefix - Prefiks
 * @param {string} extension - Fayl kengaytmasi
 * @returns {string} - Unique fayl nomi
 */
export function generateFileName(prefix, extension) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${prefix}_${timestamp}_${random}${extension}`;
}

/**
 * Xatolikni formatlab qaytarish
 * @param {Error} error - Xatolik obyekti
 * @returns {string} - Formatlangas xatolik matni
 */
export function formatError(error) {
    return error.message || 'Noma\'lum xatolik yuz berdi';
}
