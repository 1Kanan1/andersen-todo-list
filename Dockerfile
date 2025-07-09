# Pull the image
FROM python:3.13-alpine

# Set up environment variables
ENV PATH="/root/.local/bin:${PATH}"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN apk update
RUN apk add --no-cache curl

# Set the working directory
WORKDIR /app

# Copy the rest of the project (exlcuding the ones in .dockerignore)
COPY . .

RUN pip install -r requirements.txt
