start mongod
:: Wait for mongo db server to load
timeout /t 5

start /d "C:\Projects\Todo_Tomatoinator_Mongo\server" npm start

:: TODO: could create separate 'gulp.bat', and use 'call' to wait for that to complete & return value => https://stackoverflow.com/questions/2572176/how-to-make-the-batch-file-wait-until-another-batch-file-completes-execution
start /d "C:\Projects\Todo_Tomatoinator_Mongo\client" gulp

:: Wait for gulp tasks to complete
timeout /t 25
:: TODO: close localhost error popup window

start chrome http://localhost:8080/#/
