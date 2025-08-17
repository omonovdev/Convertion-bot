# 🤖 Professional File Conversion Bot

Telegram bot for converting files between different formats with multi-language support.

## ✨ Features

- **📸 JPG/JPEG → PDF** conversion
- **🖼 PNG → PDF** conversion  
- **📝 Word → TEXT** conversion
- **📄 PDF → Word** conversion
- **🔗 PDF files merging**
- **🌐 Multi-language support** (Uzbek, Russian, English)
- **👥 User management** with statistics
- **🔒 Admin panel** for bot management
- **📊 Broadcasting** messages to users

## 🚀 Setup

### 1. Clone repository
```bash
git clone <repository-url>
cd TGbot-main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
```bash
cp .env.example .env
```

Edit `.env` file with your values:
```env
BOT_TOKEN=your_bot_token_from_botfather
ADMIN_USERNAME=your_telegram_username
ADMIN_ID=your_telegram_user_id
```

### 4. Run the bot
```bash
npm start
```

## 📁 Project Structure

```
TGbot-main/
├── src/
│   ├── config/          # Configuration files
│   ├── converters/      # File conversion logic
│   ├── handlers/        # Command and file handlers
│   ├── keyboards/       # Telegram keyboards
│   ├── messages/        # Multi-language messages
│   └── utils/           # Utility functions
├── bot.js              # Main bot file
├── package.json        # Dependencies
└── .env               # Environment variables
```

## 🌐 Supported Languages

- **🇺🇿 O'zbek tili** (Uzbek)
- **🇷🇺 Русский язык** (Russian)  
- **🇺🇸 English**

## 🔧 Configuration

### Bot Token
Get your bot token from [@BotFather](https://t.me/BotFather) on Telegram.

### Admin Settings
Set your Telegram username and ID in `.env` file for admin access.

### File Size Limits
Default maximum file size is 100MB. Adjust `MAX_FILE_SIZE` in `.env`.

## 📋 Available Commands

- `/start` - Start the bot and select language
- `📸 JPG → PDF` - Convert JPG images to PDF
- `🖼 PNG → PDF` - Convert PNG images to PDF
- `📝 Word → TEXT` - Convert Word documents to text
- `📄 PDF → Word` - Convert PDF to Word format
- `🔗 PDF Birlashtirish` - Merge multiple PDF files
- `ℹ️ Yordam` - Help information
- `🆔 Telegram ID` - Get your Telegram ID
- `🌐 Til / Language` - Change language

## 🛠 Development

### File Structure
- `bot.js` - Main bot logic
- `src/config/` - Configuration management
- `src/converters/` - File conversion implementations
- `src/keyboards/` - Telegram keyboard layouts
- `src/messages/` - Multi-language message templates
- `src/utils/` - Helper functions and utilities

### Adding New Features
1. Add new conversion logic in `src/converters/`
2. Update keyboards in `src/keyboards/`
3. Add messages in all languages in `src/messages/`
4. Implement handlers in `bot.js`

## 🔐 Security

- Bot token and sensitive data are stored in `.env` file
- `.env` file is excluded from git repository
- User data is stored locally in `users.json`
- Admin-only features are protected

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For support and questions, contact the admin or create an issue in the repository.

---

Made with ❤️ for file conversion needs
