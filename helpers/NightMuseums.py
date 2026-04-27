import os
import re
import time
import random
import html as html_lib
from datetime import datetime, date, timedelta

import requests
from bs4 import BeautifulSoup
from rapidfuzz import fuzz, process

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    raise SystemExit(
        "Falta instalar Playwright.\n"
        "Ejecuta:\n"
        "pip install playwright\n"
        "playwright install chromium"
    )

# =========================================================
# CONFIGURACIÓN
# =========================================================
BASE_URL = "https://mexicocity.cdmx.gob.mx/tag/museum-night/?lang=es"
BASE_URL_PAGE = "https://mexicocity.cdmx.gob.mx/tag/museum-night/page/{}/?lang=es"

SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co"
SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R"

SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

DESCRIPCION_HTML_EVENTO = """
<p style="text-align: left;"><strong>La Noche de Museos de la Ciudad de México </strong>significa que unos 45 de los principales museos de la ciudad permanecen abiertos hasta tarde y ofrecen entradas gratuitas o con descuento.</p>
<p style="text-align: left;">Si tienes la suerte de estar aquí para este evento, se lleva a cabo durante la tarde-noche del último miércoles de cada mes.</p>
<p style="text-align: left;">La programación incluye conciertos, proyecciones de películas, visitas guiadas y algunos talleres prácticos. Es una excelente manera de salir y ver algo completamente nuevo en donde seguramente recibirás una gran bienvenida, incluso si es tu primera vez allí.</p>
<p style="text-align: left;">Si bien los listados a continuación están sujetos a cambios de un mes a otro, la mayoría de los meses incluyen todos los siguientes establecimientos participantes. Recuerda, la programación está prevista para esa noche únicamente de 18 a 22 horas.</p>
"""

session = requests.Session()
session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://mexicocity.cdmx.gob.mx/"
})

# =========================================================
# UTILIDADES FECHA
# =========================================================
def ultimo_miercoles(year: int, month: int) -> date:
    if month == 12:
        siguiente_mes = date(year + 1, 1, 1)
    else:
        siguiente_mes = date(year, month + 1, 1)

    d = siguiente_mes - timedelta(days=1)
    while d.weekday() != 2:  # miércoles
        d -= timedelta(days=1)
    return d


def siguiente_evento_noche_museos(hora_inicio="18:00:00", hora_fin="22:00:00"):
    hoy = date.today()
    cand = ultimo_miercoles(hoy.year, hoy.month)

    if cand < hoy:
        if hoy.month == 12:
            year = hoy.year + 1
            month = 1
        else:
            year = hoy.year
            month = hoy.month + 1
        cand = ultimo_miercoles(year, month)

    fecha_inicio = datetime.fromisoformat(f"{cand.isoformat()}T{hora_inicio}")
    fecha_limite = datetime.fromisoformat(f"{cand.isoformat()}T{hora_fin}")
    return fecha_inicio, fecha_limite

# =========================================================
# SUPABASE - CONSULTAS
# =========================================================
def supabase_get(path, params=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    r = session.get(url, headers=SUPABASE_HEADERS, params=params, timeout=20)
    r.raise_for_status()
    return r.json()


def supabase_post(path, payload):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    r = session.post(url, headers=SUPABASE_HEADERS, json=payload, timeout=20)
    r.raise_for_status()
    return r.json()


def obtener_museos_bd():
    resultados = []
    offset = 0
    limit = 1000

    while True:
        data = supabase_get(
            "museo",
            params={
                "select": "id_Museo,Nombre",
                "limit": limit,
                "offset": offset
            }
        )
        if not data:
            break

        resultados.extend(data)
        if len(data) < limit:
            break

        offset += limit

    return resultados


def obtener_evento_existente(fecha_inicio_iso):
    data = supabase_get(
        "evento_nightmuseums",
        params={
            "select": "id_Evento,Descripcion,Fecha_Inicio,Fecha_Limite",
            "Fecha_Inicio": f"eq.{fecha_inicio_iso}",
            "limit": 1
        }
    )
    return data[0] if data else None


def crear_evento_nightmuseums(descripcion, fecha_inicio, fecha_limite):
    payload = {
        "Descripcion": descripcion,
        "Fecha_Inicio": fecha_inicio.isoformat(sep=" "),
        "Fecha_Limite": fecha_limite.isoformat(sep=" ")
    }
    data = supabase_post("evento_nightmuseums", payload)
    return data[0] if isinstance(data, list) and data else data


def obtener_relacion_evento_museo(id_evento, id_museo):
    data = supabase_get(
        "evento_museo",
        params={
            "select": "id_Evento_Museo,id_Evento,id_Museo",
            "id_Evento": f"eq.{id_evento}",
            "id_Museo": f"eq.{id_museo}",
            "limit": 1
        }
    )
    return data[0] if data else None


def crear_relacion_evento_museo(id_evento, id_museo):
    payload = {
        "id_Evento": id_evento,
        "id_Museo": id_museo
    }
    return supabase_post("evento_museo", payload)

# =========================================================
# SCRAPING
# =========================================================
def normalizar(texto):
    texto = texto.lower().strip()
    texto = re.sub(r"\s+", " ", texto)
    texto = texto.replace("–", "-").replace("—", "-")
    return texto


def limpiar_texto_html(texto):
    texto = html_lib.unescape(texto)
    texto = re.sub(r"<[^>]+>", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


def extraer_titulo_post(post):
    """
    Saca el título desde distintos formatos posibles:
    - post["title"]
    - post["title"]["rendered"]
    - strings con HTML escapado
    """
    titulo = post.get("title")

    if isinstance(titulo, dict):
        titulo = titulo.get("rendered") or titulo.get("text")

    if isinstance(titulo, str):
        titulo = limpiar_texto_html(titulo)
        return titulo.strip()

    return None


def extraer_posts_de_objeto(obj):
    """
    Busca recursivamente objetos tipo post dentro de una estructura JSON.
    """
    encontrados = []

    if isinstance(obj, dict):
        keys = {k.lower() for k in obj.keys()}

        # Heurística: un post normalmente trae title/link/image/address/cat_name
        if "title" in keys and ("link" in keys or "address" in keys or "image" in keys or "cat_name" in keys):
            encontrados.append(obj)

        for valor in obj.values():
            encontrados.extend(extraer_posts_de_objeto(valor))

    elif isinstance(obj, list):
        for item in obj:
            encontrados.extend(extraer_posts_de_objeto(item))

    return encontrados


def capturar_posts_json(url):
    """
    Usa Playwright para cargar la página y capturar respuestas JSON
    que probablemente contengan el arreglo 'posts'.
    """
    json_capturados = []

    def on_response(response):
        try:
            ctype = response.headers.get("content-type", "").lower()
            u = response.url.lower()

            if (
                response.request.resource_type in ("xhr", "fetch")
                or "application/json" in ctype
                or "text/json" in ctype
                or "wp-json" in u
                or "ajax" in u
                or "api" in u
            ):
                data = response.json()
                json_capturados.append(data)
        except:
            pass

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            viewport={"width": 1440, "height": 2200},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            locale="es-MX"
        )

        page.on("response", on_response)
        page.goto(url, wait_until="domcontentloaded", timeout=60000)

        try:
            page.wait_for_selector("#posts-grid", timeout=15000)
        except:
            pass

        # Darle tiempo a que cargue el JS y las peticiones
        for _ in range(8):
            page.mouse.wheel(0, 1200)
            time.sleep(0.8)

        page.wait_for_timeout(3000)
        browser.close()

    return json_capturados


def extraer_nombres_desde_json_respuestas(respuestas_json):
    nombres = []

    for data in respuestas_json:
        posts = extraer_posts_de_objeto(data)

        for post in posts:
            titulo = extraer_titulo_post(post)
            if not titulo:
                continue

            nombre_norm = normalizar(titulo)
            if nombre_norm in {
                "museum night",
                "noche de museos en la ciudad de mexico",
                "noche de museos en la ciudad de méxico",
                "ultimo miércoles de cada mes",
                "último miércoles de cada mes",
            }:
                continue

            if titulo not in nombres:
                nombres.append(titulo)
                print("MUSEO:", titulo)

    return nombres


def extraer_nombres_desde_html_renderizado(html):
    nombres = []
    soup = BeautifulSoup(html, "html.parser")

    # Buscar el contenedor real
    contenedores = soup.select("#posts-grid, .grid-archive-new")
    if not contenedores:
        contenedores = [soup]

    for cont in contenedores:
        titulos = cont.select("h5.card-title, h3.card-title, h4.card-title, .card-title")
        for titulo in titulos:
            nombre = titulo.get_text(" ", strip=True)
            if not nombre:
                continue

            nombre_norm = normalizar(nombre)
            if nombre_norm in {
                "museum night",
                "noche de museos en la ciudad de mexico",
                "noche de museos en la ciudad de méxico",
                "ultimo miércoles de cada mes",
                "último miércoles de cada mes",
            }:
                continue

            if nombre not in nombres:
                nombres.append(nombre)
                print("MUSEO:", nombre)

    return nombres


def extraer_descripcion_evento_desde_html(html):
    soup = BeautifulSoup(html, "html.parser")
    parrafos = []

    for p in soup.find_all("p"):
        texto = p.get_text(" ", strip=True)
        texto = re.sub(r"\s+", " ", texto).strip()
        if texto:
            parrafos.append(texto)

    return "\n\n".join(parrafos)


def scrapear_nombres_museos():
    nombres = []
    urls = [
        BASE_URL,
        BASE_URL_PAGE.format(2),
        BASE_URL_PAGE.format(3),
    ]

    last_html = ""

    for url in urls:
        print(f"Probando URL: {url}")

        # 1) Intentar capturar JSON de las respuestas JS
        respuestas_json = capturar_posts_json(url)
        nuevos = extraer_nombres_desde_json_respuestas(respuestas_json)

        # 2) Si no hubo nada, intentar con el DOM renderizado
        if not nuevos:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page(
                    viewport={"width": 1440, "height": 2200},
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36"
                    ),
                    locale="es-MX"
                )
                page.goto(url, wait_until="networkidle", timeout=60000)

                try:
                    page.wait_for_selector("#posts-grid .card", timeout=15000)
                except:
                    pass

                page.mouse.wheel(0, 2500)
                page.wait_for_timeout(3000)

                html = page.content()
                last_html = html
                browser.close()

            print("¿Contiene posts-grid?:", "posts-grid" in last_html)
            print("¿Contiene card-title?:", "card-title" in last_html)

            nuevos = extraer_nombres_desde_html_renderizado(last_html)

        for n in nuevos:
            if n not in nombres:
                nombres.append(n)

        time.sleep(random.uniform(0.8, 1.6))

    if not nombres and last_html:
        with open("debug_nightmuseums.html", "w", encoding="utf-8") as f:
            f.write(last_html)
        print("No se encontraron museos. Se guardó debug_nightmuseums.html")

    return nombres

# =========================================================
# PROCESO PRINCIPAL
# =========================================================
def main():
    print("Scrapeando museos de Noche de Museos...")
    nombres_web = scrapear_nombres_museos()
    print(f"Encontrados en web: {len(nombres_web)}")

    if not nombres_web:
        print("No se pudo extraer ningún museo. Revisa debug_nightmuseums.html")
        return

    print("Leyendo museos desde Supabase...")
    museos_bd = obtener_museos_bd()
    print(f"Museos en BD: {len(museos_bd)}")

    nombres_bd = [m["Nombre"] for m in museos_bd if m.get("Nombre")]

    ids_museos_matched = []
    nombres_matched = []

    for nombre_web in nombres_web:
        mejor = process.extractOne(
            nombre_web,
            nombres_bd,
            scorer=fuzz.token_sort_ratio
        )

        if mejor and mejor[1] >= 80:
            nombre_bd = mejor[0]

            if nombre_bd not in nombres_matched:
                nombres_matched.append(nombre_bd)

                museo_obj = next((m for m in museos_bd if m["Nombre"] == nombre_bd), None)
                if museo_obj and museo_obj.get("id_Museo") is not None:
                    ids_museos_matched.append(museo_obj["id_Museo"])

                print(f"Match: {nombre_web} -> {nombre_bd} ({mejor[1]}%)")
        else:
            print(f"Sin match: {nombre_web}")

        time.sleep(random.uniform(0.2, 0.5))

    fecha_inicio, fecha_limite = siguiente_evento_noche_museos()
    fecha_inicio_iso = fecha_inicio.isoformat(sep=" ")

    evento = obtener_evento_existente(fecha_inicio_iso)

    if evento:
        id_evento = evento["id_Evento"]
        print(f"Evento existente reutilizado: {id_evento}")
    else:
        descripcion_evento = extraer_descripcion_evento_desde_html(DESCRIPCION_HTML_EVENTO)
        evento = crear_evento_nightmuseums(
            descripcion=descripcion_evento,
            fecha_inicio=fecha_inicio,
            fecha_limite=fecha_limite
        )
        id_evento = evento["id_Evento"]
        print(f"Evento creado: {id_evento}")

    creadas = 0
    omitidas = 0

    for id_museo in ids_museos_matched:
        rel = obtener_relacion_evento_museo(id_evento, id_museo)
        if rel:
            omitidas += 1
            continue

        crear_relacion_evento_museo(id_evento, id_museo)
        creadas += 1
        time.sleep(random.uniform(0.1, 0.3))

    print("\nProceso finalizado")
    print(f"Museos relacionados nuevos: {creadas}")
    print(f"Relaciones ya existentes: {omitidas}")
    print(f"Evento ID: {id_evento}")


if __name__ == "__main__":
    main()