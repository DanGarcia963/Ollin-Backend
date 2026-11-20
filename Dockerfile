FROM node:22-bookworm

WORKDIR /app

# Dependencias de Python para los scripts de actualización de museos y eventos.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# API de Ollin (el repositorio actual no contiene package-lock.json).
COPY package*.json ./
RUN npm install --omit=dev

# Dependencias Python aisladas del sistema.
COPY requirements.txt ./
RUN python3 -m venv /opt/venv
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . .

# Los scripts requieren Chromium y sus librerías en Linux.
RUN python -m playwright install --with-deps chromium

EXPOSE 1234
CMD ["npm", "start"]
