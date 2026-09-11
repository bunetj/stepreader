@echo off
title stepreader server
color 09
cd /d "%~dp0"
start "" http://localhost:51337
python server.py
pause
