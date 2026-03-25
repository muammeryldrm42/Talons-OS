FROM node:22-alpine
WORKDIR /app
COPY . .
CMD ["sh", "-c", "echo Build the ingest target here"]
