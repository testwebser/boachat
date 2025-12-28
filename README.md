# Discord Roleplay Bot 🎭

Discord bot with AI personality powered by Groq.

## 🚀 Deploy to Railway

1. Fork/Clone this repo to your GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project → Deploy from GitHub repo
4. Add environment variables:
   - `DISCORD_TOKEN` - Your Discord bot token
   - `GROQ_API_KEY` - Your Groq API key
5. Deploy!

## 🔄 Keep Alive with UptimeRobot

1. After deploying, copy your Railway app URL (e.g., `https://your-app.up.railway.app`)
2. Go to [UptimeRobot](https://uptimerobot.com)
3. Add new monitor:
   - Monitor Type: **HTTP(s)**
   - URL: `https://your-app.up.railway.app/health`
   - Monitoring Interval: **5 minutes**

## 📁 Project Structure

```
├── src/
│   ├── index.js    # Entry point + health server
│   ├── bot.js      # Discord client setup
│   ├── groq.js     # Groq AI integration
│   ├── memory.js   # Chat memory
│   └── prompt.js   # AI personality prompt
├── Procfile        # Railway process config
├── railway.json    # Railway settings
└── package.json
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Run bot
npm start
```

## 📝 License

ISC
