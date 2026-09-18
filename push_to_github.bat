@echo off
title Push Nikhil AI Studio to GitHub
echo ========================================================
echo   Pushing Nikhil AI Studio to GitHub (@N7539865)
echo ========================================================
cd /d "C:\Users\deves\OneDrive\Desktop\nikhil-ai-studio"
set "PATH=%PATH%;C:\Users\deves\AppData\Local\Programs\MinGit\cmd"
git add .
git commit -m "update: sync studio changes to github"
echo Pushing to https://github.com/N7539865/nikhil-ai-studio ...
git push -u origin main
echo ========================================================
echo Done! Press any key to exit.
pause
