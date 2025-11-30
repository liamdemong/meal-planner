# Multi-stage build for backend deployment
# Stage 1: Builder - Install dependencies and build TypeScript
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.6.10

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy all workspace packages
COPY lib/ ./lib/
COPY backend/ ./backend/

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Build all packages
# First build the lib packages that backend depends on
RUN pnpm --filter @full-stack/types run build
RUN pnpm --filter @full-stack/common run build
# Then build the backend
RUN pnpm --filter backend run build

# Stage 2: Production - Create minimal runtime image
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8.6.10

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy package.json files for all required packages
COPY lib/types/package.json ./lib/types/
COPY lib/common/package.json ./lib/common/
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder stage
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/lib/types/dist ./lib/types/dist
COPY --from=builder /app/lib/common/dist ./lib/common/dist

# Copy source files for lib packages
COPY lib/types/index.ts ./lib/types/
COPY lib/common/*.ts ./lib/common/

# Copy .env file to backend directory
COPY backend/.env ./backend/.env

# Set working directory to backend
WORKDIR /app/backend

# Expose port (Cloud Run uses PORT env var, defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Run the compiled server
CMD ["node", "dist/server.js"]
