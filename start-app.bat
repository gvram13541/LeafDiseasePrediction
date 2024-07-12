@echo off

:: Start the Python app in the backend folder
start cmd /k "cd leaf_disease_prediction && python manage.py runserver"

:: Start the npm server in the frontend folder
start cmd /k "cd frontend && npm start"

:: Keep the window open
pause