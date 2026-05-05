# 1. Usamos una imagen oficial de Node.js como base
FROM node:20-bullseye

# 2. Instalamos Python3 y pip en el sistema de Linux
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# 3. Configuramos el directorio de trabajo
WORKDIR /app

# 4. Copiamos los archivos de Node y descargamos dependencias
COPY package*.json ./
RUN npm install

# 5. Copiamos el archivo de dependencias de Python
COPY requirements.txt ./

# 6. Creamos un entorno virtual de Python (Buenas prácticas en Linux) y lo activamos
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 7. Instalamos las dependencias de Python
RUN pip install -r requirements.txt

# 8. INSTALAMOS PLAYWRIGHT Y SUS DEPENDENCIAS DE SISTEMA (Chromium)
RUN playwright install chromium
RUN playwright install-deps

# 9. Copiamos el resto de tu código (tu app.js, helpers, etc.)
COPY . .

# 10. Exponemos el puerto
EXPOSE 1234

# 11. Comando para iniciar tu app (Asegúrate de que coincida con el de tu package.json)
CMD ["npm", "start"]