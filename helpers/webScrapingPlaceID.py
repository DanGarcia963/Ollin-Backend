import requests
from bs4 import BeautifulSoup
import os
import re
import json
import time
import random

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ==============================
# HEADERS (ANTI BLOQUEO)
# ==============================
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-MX,es;q=0.9,en;q=0.8"
}

# ==============================
# SESSION CON RETRY
# ==============================
session = requests.Session()
session.headers.update(HEADERS)

retries = Retry(
    total=5,
    backoff_factor=1.5,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET", "POST"]
)

adapter = HTTPAdapter(max_retries=retries)
session.mount("http://", adapter)
session.mount("https://", adapter)

SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co"
SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R"

SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def obtener_museo(nombre):
    url = f"{SUPABASE_URL}/rest/v1/museo?Nombre=eq.{nombre}&select=Informacion_JSON"
    try:
        r = session.get(url, headers=SUPABASE_HEADERS, timeout=10)
        data = r.json()
        return data[0] if data else None
    except:
        return None

def actualizar_museo(nombre, info_json):
    url = f"{SUPABASE_URL}/rest/v1/museo?Nombre=eq.{nombre}"
    try:
        r = session.patch(
            url,
            headers=SUPABASE_HEADERS,
            json={"Informacion_JSON": info_json},
            timeout=10
        )

        if r.status_code in (200, 204):
            print(f"✔ Actualizado: {nombre}")
        else:
            print(f"Error update {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Error update request: {e}")

def insertar_museo(data):
    url = f"{SUPABASE_URL}/rest/v1/museo"
    try:
        r = session.post(url, headers=SUPABASE_HEADERS, json=data, timeout=10)

        if r.status_code in (200, 201):
            print(f"Guardado: {data['Nombre']}")
        elif r.status_code == 409:
            print(f"Ya existe: {data['Nombre']}")
        else:
            print(f"Error {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Error request: {e}")

# ==============================
# GOOGLE MAPS
# ==============================
GOOGLE_API_KEY = 'AIzaSyAsOqTQSOWBmyMoqlSaj71fo2pNgL8del8'

# ==============================
# GOOGLE TRANSLATE
# ==============================
def traducir_texto(texto, target):
    try:
        resp = session.post(
            f"https://translation.googleapis.com/language/translate/v2?key={GOOGLE_API_KEY}",
            json={
                "q": texto,
                "target": target,
                "format": "text"
            },
            timeout=15
        )

        data = resp.json()

        if "data" in data:
            return data["data"]["translations"][0]["translatedText"]
        else:
            print(f"[WARN] Respuesta inesperada: {data}")
            return texto

    except Exception as e:
        print(f"[WARN] Error traducción: {e}")
        return texto

def traducir_secciones(secciones):
    idiomas = ["en", "fr", "it"]
    traducciones = {}

    for lang in idiomas:
        print(f"🌍 Traduciendo a {lang}...")

        traducciones[lang] = {"Secciones": {}}

        for key, texto in secciones.items():
            if not texto:
                continue

            traducido = traducir_texto(texto, lang)
            traducciones[lang]["Secciones"][key] = traducido

            time.sleep(random.uniform(0.3, 0.7))

    return traducciones

# ==============================
# GOOGLE MAPS
# ==============================
PLACE_ID_CACHE = {}

def get_place_data(place_name):
    if place_name in PLACE_ID_CACHE:
        return PLACE_ID_CACHE[place_name]

    try:
        resp = session.get(
            'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
            params={
                'input': f"{place_name}, Ciudad de México, México",
                'inputtype': 'textquery',
                'fields': 'place_id',
                'key': GOOGLE_API_KEY
            },
            timeout=10
        )
        data = resp.json()
        pid = data.get('candidates', [{}])[0].get('place_id')

        if not pid:
            print(f"[WARN] No place_id para {place_name}")
            return None, None, None

        details = session.get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            params={
                'place_id': pid,
                'fields': 'geometry',
                'key': GOOGLE_API_KEY
            },
            timeout=10
        ).json()
        
        location = details.get('result', {}).get('geometry', {}).get('location', {})
        lat = location.get('lat')
        lng = location.get('lng')

        PLACE_ID_CACHE[place_name] = (pid, lat, lng)

        time.sleep(random.uniform(1.2, 2.5))

        return pid, lat, lng

    except Exception as e:
        print(f"[WARN] Google Maps falló: {place_name} -> {e}")
        return None, None, None

# ==============================
# CONFIGURACIÓN SCRAPING
# ==============================
base_url = 'https://sic.cultura.gob.mx'

# ==============================
# DÍAS DE LA SEMANA (CANÓNICOS)
# ==============================
DAYS_ORDER = [
    'Lunes', 'Martes', 'Miércoles',
    'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

# ==============================
# REGEX FLEXIBLE PARA DÍAS
# ==============================
DAYS_REGEX = {
    "Lunes": r"lunes",
    "Martes": r"martes",
    "Miércoles": r"mi[eé]rcoles",
    "Jueves": r"jueves",
    "Viernes": r"viernes",
    "Sábado": r"s[aá]bado",
    "Domingo": r"domingo"
}

# Construcción dinámica del patrón de días
DAYS_PATTERN = r'(' + '|'.join([f"{v}s?" for v in DAYS_REGEX.values()]) + r')'

# ==============================
# COSTOS
# ==============================
COST_LABELS = [
    'Entrada general', 'Entrada libre',
    'Entrada gratuita', 'gratuita', 'libre', 'Admisión general'
]

# ==============================
# HORARIOS (MEJORADO)
# ==============================
schedule_pattern = re.compile(
    rf'{DAYS_PATTERN}.*?\d{{1,2}}(:\d{{2}})?\s*(?:h|hr|hrs)?\s*(a|-)\s*\d{{1,2}}(:\d{{2}})?\s*(?:h|hr|hrs)?',
    re.IGNORECASE
)

# ==============================
# RANGO DE HORAS
# ==============================
time_range_pattern = re.compile(
    r'(\d{1,2}(?::\d{2})?)\s*(?:h|hr|hrs)?\s*(?:a|-)\s*(\d{1,2}(?::\d{2})?)\s*(?:h|hr|hrs)?',
    re.IGNORECASE
)

# ==============================
# FUNCIÓN RANGO DE DÍAS
# ==============================
def expand_day_range(text):
    time_match = time_range_pattern.search(text)
    if not time_match:
        return [], None

    horario_in = time_match.group(1)
    horario_out = time_match.group(2)

    horario_obj = {
        "HorarioIn": horario_in,
        "HorarioOut": horario_out
    }

    text_lower = text.lower()

    # ==============================
    # 1. DETECTAR RANGO (lunes a domingo, lunes a domingos, etc.)
    # ==============================
    for start_day, start_pattern in DAYS_REGEX.items():
        for end_day, end_pattern in DAYS_REGEX.items():

            range_pattern = re.compile(
                rf'({start_pattern}s?)\s*(?:a|-)\s*({end_pattern}s?)',
                re.IGNORECASE
            )

            match = range_pattern.search(text_lower)

            if match:
                i1 = DAYS_ORDER.index(start_day)
                i2 = DAYS_ORDER.index(end_day)

                # Manejo por si el rango cruza semana (ej: viernes a lunes)
                if i1 <= i2:
                    return DAYS_ORDER[i1:i2 + 1], horario_obj
                else:
                    return DAYS_ORDER[i1:] + DAYS_ORDER[:i2 + 1], horario_obj

    # ==============================
    # 2. DETECTAR DÍAS SUELTOS
    # ==============================
    detected_days = []

    for day, pattern in DAYS_REGEX.items():
        regex = re.compile(rf'{pattern}s?', re.IGNORECASE)
        if regex.search(text_lower):
            detected_days.append(day)

    if detected_days:
        return detected_days, horario_obj

    return [], None

# ==============================
# LISTA PRINCIPAL
# ==============================
main_url = f'{base_url}/lista.php?table=museo&estado_id=9'
resp = session.get(main_url, timeout=15)
time.sleep(random.uniform(2, 4))
soup = BeautifulSoup(resp.text, 'html.parser')
municipios = soup.find_all('div', class_='resultado')

# ==============================
# ITERACIÓN
# ==============================
for elem in municipios:
    link = elem.find('a')
    if not link:
        continue

    municipio = link.text.strip()
    print(f"\nMunicipio: {municipio}")

    mun_resp = session.get(base_url + '/' + link['href'], timeout=15)
    time.sleep(random.uniform(2, 4))
    msoup = BeautifulSoup(mun_resp.text, 'html.parser')
    museos = msoup.select('div.contlist div.textolist')

    for m in museos:
        try:
            tag = m.find('span', class_='nombrelist')
            if not tag:
                continue

            nombre = tag.text.strip()

            ficha_url = base_url + tag.find('a')['href']
            ficha_resp = session.get(ficha_url, timeout=15)
            time.sleep(random.uniform(2, 4))
            ficha = BeautifulSoup(ficha_resp.text, 'html.parser')

            horarios_by_day = {d: [] for d in DAYS_ORDER}
            horarios_otros = []

            for p in ficha.find_all('p'):
                text = BeautifulSoup(
                    re.sub(r'<br\s*/?>', '.', str(p)),
                    'html.parser'
                ).get_text()

                for seg in [s.strip() for s in text.split('.') if s.strip()]:
                    if schedule_pattern.search(seg):
                        days, horario = expand_day_range(seg)
                        if days:
                            for d in days:
                                horarios_by_day[d].append(horario)
                        else:
                            horarios_otros.append(seg)

            precios_by_label = {lbl: [] for lbl in COST_LABELS}
            precios_otros = []

            for p in ficha.find_all('p'):
                text = p.get_text(separator='\n')
                for line in text.split('\n'):
                    if schedule_pattern.search(line):
                        continue
                    for lbl in COST_LABELS:
                        if lbl.lower() in line.lower():
                            precios_by_label[lbl].append(line.strip())
                            break

            secciones = {}
            for sec in ficha.find_all('div', class_='subtemas'):
                t = sec.find('span', class_='subtemas_titulo')
                c = sec.find('div', class_='item_ficha')
                if t and c:
                    secciones[t.text.strip()] = c.text.strip()

            info = {
                'Municipio': municipio,
                'URL': ficha_url,
                'HorariosByDay': horarios_by_day,
                'HorariosOtros': horarios_otros,
                'CostosByLabel': precios_by_label,
                'CostosOtros': precios_otros,
                'Secciones': secciones
            }

            # ==============================
            # CONSULTAR EN SUPABASE
            # ==============================
            museo_db = obtener_museo(nombre)

            # ==============================
            # CASO 1: YA EXISTE
            # ==============================
            if museo_db:
                db_info = museo_db.get("Informacion_JSON", {})

                traducciones_db = db_info.get("Traducciones", {})
                idiomas_requeridos = ["en", "fr", "it"]

                faltan_idiomas = any(lang not in traducciones_db for lang in idiomas_requeridos)
                if db_info.get("HorariosByDay") != info.get("HorariosByDay"):
                    print(f"STATUS|horarios_cambiaron|{nombre}")

                    nuevo_info = db_info.copy()
                    nuevo_info["HorariosByDay"] = horarios_by_day
                    actualizar_museo(nombre, nuevo_info)
                if db_info.get("Secciones") != info.get("Secciones") or not traducciones_db or faltan_idiomas:
                    print(f"STATUS|actualizado|{nombre}")

                    # traducir
                    traducciones_nuevas = traducir_secciones(secciones)

                    # combinar con existentes
                    traducciones_existentes = db_info.get("Traducciones", {})
                    traducciones_existentes.update(traducciones_nuevas)

                    nuevo_info = db_info.copy()

                    nuevo_info["Municipio"] = municipio
                    nuevo_info["URL"] = ficha_url
                    nuevo_info["HorariosByDay"] = horarios_by_day
                    nuevo_info["HorariosOtros"] = horarios_otros
                    nuevo_info["CostosByLabel"] = precios_by_label
                    nuevo_info["CostosOtros"] = precios_otros
                    nuevo_info["Secciones"] = secciones
                    nuevo_info["Traducciones"] = traducciones_existentes

                    actualizar_museo(nombre, nuevo_info)

                else:
                    print(f"STATUS|sin_cambios|{nombre}")

            # ==============================
            # CASO 2: NUEVO
            # ==============================
            else:
                pid, lat, lng = get_place_data(nombre)

                try:
                    if lat is not None:
                        lat = float(lat)
                    if lng is not None:
                        lng = float(lng)
                except Exception as e:
                    print(f"[ERROR] Conversión coords: {e}")
                    lat = None
                    lng = None

                print(f"STATUS|nuevo|{nombre}")

                # agregar traducciones correctamente
                info["Traducciones"] = traducir_secciones(secciones)

                data = {
                    "id_Museo": pid,
                    "Nombre": nombre,
                    "Informacion_JSON": info,
                    "Latitud": lat,
                    "Longitud": lng
                }

                insertar_museo(data)

        except Exception as e:
            print(f"[ERROR] Museo fallido: {e}")
            continue
