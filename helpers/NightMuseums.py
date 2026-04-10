import requests
from bs4 import BeautifulSoup
import os
import re
import json
import pymysql
from rapidfuzz import fuzz, process
import time

# URL base
base_url = "https://mexicocity.cdmx.gob.mx/tag/museum-night/page/{}/?lang=es"

conn = pymysql.connect(
    host='localhost', user='root', password='',
    database='ollin', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor
)
cursor = conn.cursor()

# Carpeta donde se guardará el archivo
carpeta = "museos"
os.makedirs(carpeta, exist_ok=True)

# Archivo de salida
archivo_salida = os.path.join(carpeta, "lista_museos.txt")
archivo_salida1 = os.path.join(carpeta, "lista_noche_museos_registrados.txt")

# Lista para almacenar los nombres de los museos
nombres_museos = []

# Iterar sobre las tres páginas
for i in range(1, 4):
    url = base_url.format(i)
    response = requests.get(url)
    response.raise_for_status()  # Verifica errores en la petición

    # Parsear el HTML con BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")

    # Buscar todos los títulos de museos dentro del div con clase "grid-archive"
    museos = soup.select("div.grid-archive-new h3.card-title a")

    # Extraer solo el texto (nombre del museo) y agregarlo a la lista
    for museo in museos:
        nombre = museo.get_text(strip=True)
        if nombre not in nombres_museos:  # Evitar duplicados
            nombres_museos.append(nombre)

cursor.execute("SELECT Nombre_Museo FROM museo")
museos_bd = [row["Nombre_Museo"] for row in cursor.fetchall()]

museos_guardados = []

for nombre_web in nombres_museos:
    # Buscar el mejor match en la BD con similitud de texto
    mejor_match = process.extractOne(nombre_web, museos_bd, scorer=fuzz.token_sort_ratio)
    if mejor_match and mejor_match[1] >= 80:  # umbral de similitud (0-100)
        nombre_bd = mejor_match[0]
        if nombre_bd not in museos_guardados:
            museos_guardados.append(nombre_bd)
            with open(archivo_salida1, "a", encoding="utf-8") as f:
                f.write(nombre_bd + "\n")


conn.commit()
# Guardar en archivo de texto
with open(archivo_salida, "w", encoding="utf-8") as f:
    for nombre in nombres_museos:
        f.write(nombre + "\n")

print(f"Se guardaron {len(nombres_museos)} museos en {archivo_salida}")

conn.close()