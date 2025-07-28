# Use the official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Copy the requirements_flask.txt first to install dependencies
COPY requirements.txt .

# Install dependencies and gunicorn in one layer to optimize Docker caching
RUN pip install --upgrade pip && pip install -r requirements.txt && pip install gunicorn

# Copy the rest of the project files
COPY . .

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Use gunicorn to run the Flask application
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
