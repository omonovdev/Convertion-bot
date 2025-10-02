// PDF fayl nomini tekshirish
export function isValidPdfFormat(fileName) {
    return fileName.toLowerCase().endsWith('.pdf');
}
// PDF dan textga o'girish stub
export async function pdfToText(pdfPaths, outputPath) {
    // TODO: PDF dan textga o'girish logikasi
    return outputPath;
}
import PDFMerger from 'pdf-merger-js';
import fs from 'fs';
import path from 'path';
import config from '../config/config.js';

/**
 * PDF fayllarni birlashtirish (cheklovsiz)
 * @param {Array<string>} pdfPaths - PDF fayllar yo'llari
 * @param {string} outputPath - Chiqish fayl yo'li
 * @param {string} customName - Custom fayl nomi
 */
export async function mergePdfs(pdfPaths, outputPath, customName = null) {
    try {
        if (pdfPaths.length < 2) {
            throw new Error('Kamida 2 ta PDF fayl kerak');
        }

        const merger = new PDFMerger();

        // Fayllarni tartib bo'yicha qo'shish (cheklovsiz - istalgancha fayl)
        for (const pdfPath of pdfPaths) {
            if (!fs.existsSync(pdfPath)) {
                throw new Error(`Fayl topilmadi: ${path.basename(pdfPath)}`);
            }
            await merger.add(pdfPath);
            console.log(`📄 PDF qo'shildi: ${path.basename(pdfPath)}`);
        }

        // Custom nom bilan saqlash
        let finalOutputPath = outputPath;
        if (customName) {
            const dir = path.dirname(outputPath);
            finalOutputPath = path.join(dir, `${customName}.pdf`);
        }

        await merger.save(finalOutputPath);
        console.log(`✅ ${pdfPaths.length} ta PDF fayl birlashtirildi: ${path.basename(finalOutputPath)}`);
        return finalOutputPath;

    } catch (error) {
        console.error('PDF merge error:', error);
        throw new Error('PDF fayllarni birlashtirish muvaffaqiyatsiz: ' + error.message);
    }
}

/**
 * PDF fayl meta ma'lumotlarini olish
 * @param {string} pdfPath - PDF fayl yo'li
 * @returns {Object} - Fayl ma'lumotlari
 */
export function getPdfInfo(pdfPath) {
    try {
        const stats = fs.statSync(pdfPath);
        const fileName = path.basename(pdfPath);

        return {
            name: fileName,
            size: stats.size,
            sizeFormatted: formatFileSize(stats.size),
            created: stats.birthtime,
            modified: stats.mtime
        };
    } catch (error) {
        console.error('PDF info error:', error);
        return null;
    }
}

/**
 * Fayl hajmini formatlash
 * @param {number} bytes - Baytlar
 * @returns {string}
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * PDF fayllarni validatsiya qilish (minimal tekshiruv)
 * @param {Array<string>} pdfPaths - PDF fayl yo'llari
 * @returns {Object} - Validatsiya natijasi
 */
export function validatePdfFiles(pdfPaths) {
    const validFiles = [];
    const invalidFiles = [];
    let totalSize = 0;

    for (const pdfPath of pdfPaths) {
        try {
            if (!fs.existsSync(pdfPath)) {
                invalidFiles.push({ path: pdfPath, error: 'Fayl topilmadi' });
                continue;
            }

            const stats = fs.statSync(pdfPath);
            const ext = path.extname(pdfPath).toLowerCase();

            if (ext !== '.pdf') {
                invalidFiles.push({ path: pdfPath, error: 'PDF fayl emas' });
                continue;
            }

            totalSize += stats.size;
            validFiles.push({
                path: pdfPath,
                name: path.basename(pdfPath),
                size: stats.size,
                sizeFormatted: formatFileSize(stats.size)
            });

        } catch (error) {
            invalidFiles.push({ path: pdfPath, error: error.message });
        }
    }

    return {
        valid: validFiles,
        invalid: invalidFiles,
        totalSize,
        totalSizeFormatted: formatFileSize(totalSize),
        canProcess: validFiles.length >= 2
    };
}

