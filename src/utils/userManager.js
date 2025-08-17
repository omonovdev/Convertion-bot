import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'users.json');

/**
 * Foydalanuvchilar bazasini yuklash
 */
export function loadUsers() {
    try {
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            return JSON.parse(data);
        }
        return {};
    } catch (error) {
        console.error('Foydalanuvchilar bazasini yuklashda xatolik:', error);
        return {};
    }
}

/**
 * Foydalanuvchilar bazasini saqlash
 */
export function saveUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Foydalanuvchilar bazasini saqlashda xatolik:', error);
        return false;
    }
}

/**
 * Yangi foydalanuvchini qo'shish
 */
export function addUser(userId, userData) {
    const users = loadUsers();
    users[userId] = {
        id: userId,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        ...userData
    };
    saveUsers(users);
    return users[userId];
}

/**
 * Foydalanuvchini yangilash
 */
export function updateUser(userId, userData) {
    const users = loadUsers();
    if (users[userId]) {
        users[userId] = {
            ...users[userId],
            ...userData,
            lastSeen: new Date().toISOString()
        };
        saveUsers(users);
        return users[userId];
    }
    return null;
}

/**
 * Foydalanuvchini olish
 */
export function getUser(userId) {
    const users = loadUsers();
    return users[userId] || null;
}

/**
 * Barcha foydalanuvchilarni olish
 */
export function getAllUsers() {
    return loadUsers();
}

/**
 * Foydalanuvchilar sonini hisoblash
 */
export function getUsersCount() {
    const users = loadUsers();
    return Object.keys(users).length;
}

/**
 * Online foydalanuvchilar sonini hisoblash (oxirgi 5 daqiqada active bo'lganlar)
 */
export function getOnlineUsersCount() {
    const users = loadUsers();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    return Object.values(users).filter(user => {
        const lastSeen = new Date(user.lastSeen);
        return lastSeen > fiveMinutesAgo;
    }).length;
}

/**
 * Foydalanuvchi aktivligini yangilash
 */
export function updateUserActivity(userId) {
    updateUser(userId, { lastSeen: new Date().toISOString() });
}

/**
 * Foydalanuvchining kanal a'zoligini belgilash
 */
export function setChannelMembership(userId, isMember) {
    updateUser(userId, {
        isChannelMember: isMember,
        membershipCheckedAt: new Date().toISOString()
    });
}

/**
 * Foydalanuvchining kanal a'zoligini tekshirish
 */
export function getChannelMembership(userId) {
    const user = getUser(userId);
    return user?.isChannelMember || false;
}

/**
 * Foydalanuvchi reytingini saqlash
 */
export function saveUserRating(userId, rating) {
    updateUser(userId, {
        rating: rating,
        ratedAt: new Date().toISOString()
    });
}

/**
 * Barcha reytinglar statistikasini olish
 */
export function getRatingStats() {
    const users = loadUsers();
    const ratings = [];

    Object.values(users).forEach(user => {
        if (user.rating && user.rating >= 1 && user.rating <= 5) {
            ratings.push(user.rating);
        }
    });

    if (ratings.length === 0) {
        return {
            totalRatings: 0,
            averageRating: 0,
            ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
        ratingCounts[rating]++;
    });

    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    const averageRating = sum / totalRatings;

    return {
        totalRatings,
        averageRating: Math.round(averageRating * 100) / 100, // 2 kasr
        ratingCounts
    };
}

/**
 * Foydalanuvchi tilini saqlash
 */
export function setUserLanguage(userId, language) {
    const users = loadUsers();
    if (users[userId]) {
        users[userId].language = language;
        users[userId].lastSeen = new Date().toISOString();
        saveUsers(users);
        return true;
    }
    return false;
}

/**
 * Foydalanuvchi tilini olish
 */
export function getUserLanguage(userId) {
    const users = loadUsers();
    return users[userId]?.language || null; // Til tanlanmaguncha null
}

export default {
    loadUsers,
    saveUsers,
    addUser,
    updateUser,
    getUser,
    getAllUsers,
    getUsersCount,
    getOnlineUsersCount,
    updateUserActivity,
    setChannelMembership,
    getChannelMembership,
    saveUserRating,
    getRatingStats,
    setUserLanguage,
    getUserLanguage
};
