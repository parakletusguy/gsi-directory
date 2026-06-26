# Use an official, lightweight Python runtime
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Prevent Python from writing .pyc files and ensure logs emit immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy only the requirements file first to optimize Docker layer caching
COPY requirements.txt .

# Install dependencies listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files from your local directory into the container
COPY . .

# Explicitly create the output directory for the database and logs
RUN mkdir -p output

# Cloud Run injects a dynamic port via the PORT env variable (usually 8080)
# Your updated server.py will automatically pick this up
EXPOSE 8080

# Command to run the monolithic Python server
CMD ["python", "server.py"]
