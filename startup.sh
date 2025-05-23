#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Check for Python 3 and pip3, attempt to install if not found.
# This is a basic check for Debian/Ubuntu-based systems.
# For other systems or containerized environments, this section might need adjustment.
if ! command -v python3 &> /dev/null
then
    echo "Python 3 could not be found. Attempting to install..."
    # Ensure sudo is available or script is run as root for apt-get
    if command -v sudo &> /dev/null; then sudo apt-get update && sudo apt-get install -y python3; else apt-get update && apt-get install -y python3; fi
fi

if ! command -v pip3 &> /dev/null
then
    echo "pip3 could not be found. Attempting to install..."
    if command -v sudo &> /dev/null; then sudo apt-get update && sudo apt-get install -y python3-pip; else apt-get update && apt-get install -y python3-pip; fi
fi

# Install Python dependencies from requirements.txt
echo "Installing application dependencies..."
pip3 install -r requirements.txt

# Set Flask environment variables for development
export FLASK_APP=app.py
export FLASK_ENV=development # Change to 'production' for live deployments

# Run the Flask application
echo "Starting Cyberpunk Game Hub on http://0.0.0.0:9000"
python3 -m flask run --host=0.0.0.0 --port=9000
