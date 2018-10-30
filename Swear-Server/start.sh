git reset --hard
git pull origin HEAD
npm install
pm2 stop swear -f
pm2 start app.js -n swear
