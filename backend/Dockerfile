FROM python:3.13-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Railway will override with $PORT)
EXPOSE 8000

# Start command using Railway's PORT variable
CMD ["sh", "start.sh"]
