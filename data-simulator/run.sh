#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the server
echo "Starting MSP Data Simulator..."
echo "Server will be available at http://localhost:8000"
echo "API docs at http://localhost:8000/docs"
echo ""

python main.py
