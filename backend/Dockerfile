FROM node:20-slim

WORKDIR /app

# Install agent deps first (backend imports agent/src/graph.js directly at runtime)
COPY agent/package*.json agent/
RUN npm --prefix agent install --omit=dev

# Install backend deps
COPY backend/package*.json backend/
RUN npm --prefix backend install --omit=dev

# Now copy source
COPY agent agent
COPY backend backend

WORKDIR /app/backend
ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]
