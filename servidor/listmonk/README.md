# Listmonk — cómo se instala lo de esta carpeta

Tres piezas, y **solo una es un archivo que haya que copiar al servidor**. Las
otras dos se pegan en el panel. Conviene saberlo antes de empezar, porque la
diferencia decide si hay que reiniciar el contenedor o no.

| Pieza | Dónde vive | Cómo se instala | ¿Reinicia? |
|---|---|---|---|
| `custom.css` | ajuste del panel | se **pega** en Apariencia | no |
| `plantilla-campana.html` | base de datos | se **pega** en Plantillas | no |
| `email-templates/subscriber-optin.html` | **archivo en disco** | `scp` + `docker-compose.yml` | **sí** |

> ⚠️ **Nada de esta carpeta lo sirve la web.** Vive en el repositorio para
> tenerlo versionado y poder revisarlo en un PR. Y **no puede llevar ni un
> secreto**: el repositorio es público y GitHub Pages sirve la raíz, así que
> todo esto es descargable en `/servidor/listmonk/…`.

---

## 1. El CSS de las páginas públicas — solo panel

Viste el formulario público, la pantalla de confirmación, la de baja y la de
gestionar la suscripción.

1. Entra en `https://listas.elderechoescrito.es/admin`.
2. **Ajustes → Apariencia → Público**.
3. Pega el contenido entero de `custom.css` en «CSS personalizado».
4. Guarda.

No hace falta reiniciar: Listmonk lo sirve en `/public/custom.css` al momento.

> **El logo no está en el CSS**: es otro ajuste, en esa misma pantalla.
> Hoy apunta al `apple-touch-icon.png` de la web. Desde el CSS solo se le da
> tamaño.

**Para comprobarlo**, abre `https://listas.elderechoescrito.es/subscription/form`
y mira que salga en Cormorant, con el verdigrís y la caja blanca sobre gris.

---

## 2. La plantilla de campaña — solo panel

1. **Campañas → Plantillas → Nueva**.
2. Nombre: `El Derecho Escrito — artículo`.
3. Tipo: **Campaña**.
4. Pega el contenido de `plantilla-campana.html`.
5. Guarda y márcala como **predeterminada**.

> ⚠️ **Lo de «predeterminada» no es opcional.** `scripts/newsletter.mjs` **no
> manda `template_id`** a propósito: fijar un número en el repositorio lo ataría
> a un id de la base de datos del servidor, que cambia si la plantilla se borra
> y se vuelve a crear, y desde el repositorio no hay forma de comprobarlo. Al no
> mandarlo, Listmonk usa la predeterminada. Si ninguna lo es, las campañas
> saldrán con la plantilla de fábrica y **nadie avisará**.

---

## 3. El correo de confirmación — archivo, y es el único

Este sí necesita disco, y conviene entender por qué antes de pelearse con él:
en Listmonk 6.2 las plantillas **de sistema** —el correo de opt-in y las
páginas públicas— están empotradas en el binario y la única forma de
sustituirlas es `--static-dir`. No hay pantalla en el panel para esto.

> ✅ **Pero NO hay que clonar el directorio estático entero.** Verificado en el
> código de `initFS()`: Listmonk **fusiona** el directorio que se le pasa sobre
> los archivos empotrados y solo se queda con lo que exista de verdad en él.
> Lo que no esté, cae al de fábrica. O sea: basta con este archivo.

### Los pasos

```sh
# 1. Crear la carpeta en el servidor, con la estructura que Listmonk espera.
#    ⚠️ El subdirectorio TIENE que llamarse email-templates: la ruta la compone
#    Listmonk como <static-dir>/email-templates/… y si no coincide, no falla:
#    se queda con la plantilla de fábrica y el correo sale en inglés genérico.
ssh TU_USUARIO@listas.elderechoescrito.es \
    'mkdir -p /opt/newsletters/elderechoescrito/static/email-templates'

# 2. Subir el archivo
scp servidor/listmonk/email-templates/subscriber-optin.html \
    TU_USUARIO@listas.elderechoescrito.es:/opt/newsletters/elderechoescrito/static/email-templates/
```

En `/opt/newsletters/elderechoescrito/docker-compose.yml`, en el servicio de
Listmonk:

```yaml
    volumes:
      # ⚠️ La ruta de la IZQUIERDA es la del host; la de la DERECHA, la de
      #    dentro del contenedor. La del flag de abajo es la de la derecha.
      - ./static:/listmonk/static

    command: ["./listmonk", "--static-dir=/listmonk/static"]
```

```sh
docker compose up -d
```

### Comprobar que lo ha cogido

```sh
docker compose logs | grep 'loading static files'
```

Tiene que decir `loading static files from: /listmonk/static`. **Si esa línea
no aparece, el flag no está llegando** y Listmonk sigue con su plantilla: el
correo se envía igualmente y lo único que falla es el aspecto, así que no hay
error que lo delate.

> ⚠️ **Si el servicio ya traía un `command:`, no se añade otro: se edita el que
> hay.** Dos `command:` en el mismo servicio no es un error de YAML —el segundo
> gana en silencio— así que es fácil dejar el contenedor arrancando con el
> anterior y no enterarse.

### La prueba de verdad

Date de alta con una dirección tuya en
`https://listas.elderechoescrito.es/subscription/form` y mira el correo que
llega. Tiene que venir con el logo, el botón verde y la línea de «si no lo has
pedido, ignora este correo».

Después, bórrate desde **Suscriptores** para no dejar una dirección de prueba
en la lista.

---

## Lo que hay que crear en el panel para que el workflow funcione

Un **usuario de API**, en **Admin → Usuarios**:

- Tipo: **API**.
- Permisos mínimos: `campaigns:get`, `campaigns:manage`, `lists:get`.
- Al crearlo enseña el **token una sola vez**. Hay que copiarlo en ese momento.

Ese usuario y ese token son los que van a los secretos del repositorio, con
estos nombres exactos:

| Secreto | Valor |
|---|---|
| `LISTMONK_URL` | `https://listas.elderechoescrito.es` |
| `LISTMONK_USUARIO` | el nombre del usuario de API |
| `LISTMONK_TOKEN` | el token que enseñó al crearlo |

---

## CORS: qué hay que autorizar en Caddy

El formulario de la web envía por `fetch` desde **otro dominio**, así que el
navegador exige que Listmonk lo autorice. Listmonk no tiene ajuste de CORS, de
modo que lo pone Caddy delante.

| | |
|---|---|
| **Ruta** | `/api/public/subscription` |
| **Métodos** | `POST`, `OPTIONS` |
| **Cabeceras de petición** | `Content-Type` |
| **Orígenes** | `https://duowave-web.github.io` y `https://elderechoescrito.es` |

> ⚠️ **El origen es solo el esquema y el host, sin la ruta.** Para GitHub Pages
> es `https://duowave-web.github.io`, **no** `…/el-derecho-escrito`: el
> navegador manda el origen sin el subdirectorio y un valor con ruta no casa
> nunca. Es el fallo más fácil de cometer aquí, y se manifiesta como un error de
> red sin más explicación.

```caddyfile
listas.elderechoescrito.es {
    @suscripcion {
        path /api/public/subscription
        header_regexp Origin ^https://(duowave-web\.github\.io|elderechoescrito\.es)$
    }

    header @suscripcion {
        Access-Control-Allow-Origin "{http.request.header.Origin}"
        Access-Control-Allow-Methods "POST, OPTIONS"
        Access-Control-Allow-Headers "Content-Type"
        Vary "Origin"
    }

    # El navegador manda un OPTIONS antes del POST y hay que contestarlo sin
    # pasárselo a Listmonk, que no sabe responderlo.
    @preflight {
        method OPTIONS
        path /api/public/subscription
    }
    respond @preflight 204

    reverse_proxy listmonk:9000
}
```

> **No se abre la API entera**, solo esa ruta. El resto —incluida `/api/…` de
> administración— sigue sin cabeceras de CORS, así que ningún navegador de
> ningún otro sitio puede llamarla.

> **`Vary: Origin` no es decorativo**: sin él, un intermediario que cachee la
> respuesta puede servirle a un origen la cabecera calculada para el otro.

### Si no se autoriza

El formulario **no se rompe del todo**, y conviene saberlo: el `fetch` falla, el
JavaScript enseña «No hemos podido conectar ahora mismo» y el camino sin
JavaScript —el envío normal del `<form>`— **sigue funcionando**, porque un envío
de formulario no está sujeto a CORS. O sea que el peor caso es que la
suscripción deje de ser silenciosa y navegue a la página de Listmonk.
