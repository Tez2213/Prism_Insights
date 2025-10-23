@echo off

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Run the server
echo Starting MSP Data Simulator...
echo Server will be available at http://localhost:8000
echo API docs at http://localhost:8000/docs
echo.

python main.py
