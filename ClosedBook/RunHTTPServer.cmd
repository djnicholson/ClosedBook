echo off
cls

echo.
echo NOTE: This script requires Python to be installed and available in your PATH.
echo Go to www.python.org to install.
echo.

echo Running a HTTP server in:
cd
echo.

python -m http.server --cgi 8000

echo.
pause