/*!
 * InvocandoJS v1.0.0
 * (c) 2025 Uriel Olivares
 * https://github.com/ororok-labs/invocandojs
 * Licencia MIT
 */
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _Validador_instances, configuracion_fn, ejecutarOpcionesAdicionales_fn, definirTipoSalida_fn, validarInput_fn, actualizarInputEstado_fn, renderizarClasesValidadorasParaSobrinos_fn, obtenerInputSobrinos_fn, evitarValidarInputDePadreNoSeleccionado_fn, renderizarClasesValidadoras_fn, obtenerOpcionSeleccionada_fn, obtenerInputVinculado_fn, visualizarONoError_fn, colocarAsteriscos_fn, inyectarEstiloAsterisco_fn;
function getElemento(selector2) {
  if (typeof selector2 === "string") {
    const nameNormalArray = selector2.endsWith("]") && !selector2.includes("[name=");
    if (!nameNormalArray) {
      let el = document.querySelector(selector2);
      if (el) return el;
    }
    if (!selector2.startsWith("#") && !selector2.startsWith(".")) {
      const group2 = document.getElementsByName(selector2);
      if (group2.length > 0) return group2[0];
    }
  }
  if (selector2 instanceof HTMLElement) return selector2;
  throw new Error("No se pudo obtener el elemento: " + selector2);
}
function getElementoPorId(id) {
  if (typeof id === "string") {
    const limpio = id.startsWith("#") ? id.slice(1) : id;
    const el = document.getElementById(limpio);
    if (!el) throw new Error("No se encontró un elemento con ID: " + limpio);
    return el;
  }
  if (id instanceof HTMLElement && id.id) {
    return id;
  }
  throw new Error("El parámetro debe ser un ID string o un elemento con ID");
}
function getElementosPorName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("El parámetro debe ser un string válido con el atributo name");
  }
  const elementos = document.getElementsByName(name);
  if (!elementos || elementos.length === 0) {
    throw new Error("No se encontró ningún elemento con name: " + name);
  }
  return elementos;
}
function getElementoPorNameOSelector(param) {
  let elementos;
  if (typeof param === "string") {
    if (param.startsWith("[name=")) {
      elementos = document.querySelectorAll(param);
    } else {
      elementos = document.getElementsByName(param);
    }
  }
  if (!elementos || elementos.length === 0) {
    throw new Error("No se encontraron elementos con ese name o selector.");
  }
  return elementos;
}
function getElementosPorNameSelectorOElemento(param) {
  if (typeof param === "string") {
    if (param.startsWith("[name=")) {
      const elementos = document.querySelectorAll(param);
      if (!elementos || elementos.length === 0) {
        throw new Error("No se encontraron elementos con ese selector CSS: " + param);
      }
      return elementos;
    } else {
      const elementos = document.getElementsByName(param);
      if (!elementos || elementos.length === 0) {
        throw new Error("No se encontraron elementos con ese name: " + param);
      }
      return elementos;
    }
  } else if (param instanceof HTMLElement) {
    return [param];
  } else if (param instanceof NodeList || Array.isArray(param)) {
    return [...param];
  }
  throw new Error("El parámetro debe ser un name string, un selector CSS, un elemento HTML o una lista de elementos.");
}
function getElementoGrupal(selector2) {
  if (selector2 instanceof HTMLElement) {
    return [...getElementosPorNameSelectorOElemento(selector2.name)];
  } else if (typeof selector2 === "string") {
    if (selector2.startsWith("#")) {
      const selectorName = getElemento(selector2).name;
      return [...getElementosPorName(selectorName)];
    } else {
      return [...getElementoPorNameOSelector(selector2)];
    }
  }
  throw new Error("No se encontró ningún elemento.");
}
function normalizarSelectores(selectores) {
  let elementos = [];
  if (typeof selectores === "string") {
    elementos = [...document.querySelectorAll(selectores)];
  } else if (Array.isArray(selectores)) {
    elementos = selectors.flatMap((sel) => {
      if (typeof sel === "string") {
        return [...document.querySelectorAll(sel)];
      }
      if (sel instanceof Element) {
        return [sel];
      }
      if (sel instanceof NodeList || Array.isArray(sel)) {
        return [...sel];
      }
      return [];
    });
  } else if (selectores instanceof Element) {
    elementos = [selectores];
  } else if (selectores instanceof NodeList) {
    elementos = [...selectores];
  }
  const set = /* @__PURE__ */ new Set();
  return elementos.filter((el) => {
    if (set.has(el)) return false;
    set.add(el);
    return true;
  });
}
const Selectores = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getElemento,
  getElementoGrupal,
  getElementoPorId,
  getElementoPorNameOSelector,
  getElementosPorName,
  getElementosPorNameSelectorOElemento,
  normalizarSelectores
}, Symbol.toStringTag, { value: "Module" }));
function opcionOtroMarcadaYTextoLleno(_, opcionEl, campoTextoEl, valorEsperado = "otro") {
  const opcion = getElemento(opcionEl);
  const campo = getElemento(campoTextoEl);
  if (!opcion || !campo) return false;
  const tipo = opcion.type;
  const valor2 = opcion.value;
  const estaSeleccionado = tipo === "checkbox" || tipo === "radio" ? opcion.checked : opcion.tagName === "SELECT" ? valor2 === valorEsperado : false;
  if (!estaSeleccionado) return true;
  return campo.value.trim().length > 0;
}
function marcarGrupoSiTextoVacio(campoTextoEl, opcionVinculado, claseError = "is-invalid", claseExito = "is-valid") {
  const campo = getElemento(campoTextoEl);
  const opcionVinculada = getElementoPorId(opcionVinculado);
  const grupo = getElementosPorName(opcionVinculada.getAttribute("name"));
  const valorTexto = campo.value.trim();
  let marcar = false;
  if (!grupo || grupo.length === 0) return;
  if (inputDeOpcionMarcado(opcionVinculada) && valorTexto === "") {
    marcar = true;
  } else if (inputDeOpcionMarcado(opcionVinculada) && valorTexto !== "") {
    marcar = false;
  } else if (algunaOpcionDeGrupoMarcada(grupo)) {
    marcar = false;
  } else {
    marcar = true;
  }
  grupo.forEach((input) => {
    if (input.tagName === "SELECT") {
      if (marcar) {
        input.classList.add(claseError);
        input.classList.remove(claseExito);
      } else {
        input.classList.remove(claseError);
        input.classList.add(claseExito);
      }
    } else if (input.type === "radio" || input.type === "checkbox") {
      if (marcar) {
        input.classList.add(claseError);
        input.classList.remove(claseExito);
      } else {
        input.classList.remove(claseError);
        input.classList.add(claseExito);
      }
    }
  });
  if (marcar) {
    campo.classList.add(claseError);
    return false;
  } else {
    campo.classList.remove(claseError);
    return true;
  }
}
function inputDeOpcionMarcado(input) {
  if ((input.type === "checkbox" || input.type === "radio") && input.checked || (input.tagName === "SELECT" && input.multiple ? Array.from(input.selectedOptions).length > 0 : input.tagName === "SELECT" && input.selectedIndex > -1 && input.value !== "")) {
    return true;
  } else {
    return false;
  }
}
function algunaOpcionDeGrupoMarcada(grupo) {
  return Array.from(grupo).some(
    (input) => input.type === "checkbox" || input.type === "radio" ? input.checked : input.tagName === "SELECT" && input.multiple ? Array.from(input.selectedOptions).length > 0 : input.tagName === "SELECT" ? input.selectedIndex > -1 && input.value !== "" : false
  );
}
const group = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  algunaOpcionDeGrupoMarcada,
  inputDeOpcionMarcado,
  marcarGrupoSiTextoVacio,
  opcionOtroMarcadaYTextoLleno
}, Symbol.toStringTag, { value: "Module" }));
function cambiarDisplay(selector2, tipo) {
  const el = getElemento(selector2);
  if (el) el.style.display = tipo;
}
function agregarClases(selector2, ...clases) {
  const el = getElemento(selector2);
  if (el) el.classList.add(...clases);
}
function quitarClases(selector2, ...clases) {
  const el = getElemento(selector2);
  if (el) el.classList.remove(...clases);
}
function alternarClases(selector2, ...clases) {
  const el = getElemento(selector2);
  if (el) clases.forEach((clase) => el.classList.toggle(clase));
}
function ocultar(selector2) {
  cambiarDisplay(selector2, "none");
}
function mostrar(selector2, tipoDisplay = "block") {
  cambiarDisplay(selector2, tipoDisplay);
}
function ocultarConClases(selector2, ...clases) {
  agregarClases(selector2, ...clases);
}
function mostrarQuitandoClases(selector2, tipoDisplay = "block", ...clases) {
  quitarClases(selector2, ...clases);
  cambiarDisplay(selector2, tipoDisplay);
}
function ocultarConHidden(selector2) {
  const el = getElemento(selector2);
  if (el) el.hidden = true;
}
function mostrarQuitandoHidden(selector2) {
  const el = getElemento(selector2);
  if (el) el.hidden = false;
}
function mostrarConAnimacion(selector2, tipoDisplay = "flex", duracion = 300) {
  const el = getElemento(selector2);
  if (el) {
    el.style.opacity = 0;
    el.style.display = tipoDisplay;
    el.style.transition = `opacity ${duracion}ms`;
    requestAnimationFrame(() => {
      el.style.opacity = 1;
    });
  }
}
function ocultarConAnimacion(selector2, duracion = 300) {
  const el = getElemento(selector2);
  if (el) {
    el.style.transition = `opacity ${duracion}ms`;
    el.style.opacity = 1;
    requestAnimationFrame(() => {
      el.style.opacity = 0;
      setTimeout(() => {
        el.style.display = "none";
      }, duracion);
    });
  }
}
function ocultarGrupo(selectores) {
  selectores.forEach((sel) => ocultar(sel));
}
function mostrarGrupo(selectores, tipoDisplay = "block") {
  selectores.forEach((sel) => mostrar(sel, tipoDisplay));
}
function fetchHTML(url, {
  elementoContenedor,
  elementoBuscado,
  callback = false
}) {
  fetch(url).then((response) => response.text()).then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const section = doc.querySelector("#" + elementoBuscado);
    if (section) {
      document.getElementById(elementoContenedor).innerHTML = section.innerHTML;
      if (callback) callback();
    } else {
      console.error(`El elemento ${elementoBuscado} no se encontró en el archivo.`);
    }
  }).catch((error) => console.error("Error al cargar el archivo:", error));
}
function reemplazarTextosHTML(contenedor, reemplazos) {
  getElemento(selector);
  reemplazos.forEach(({ buscar, reemplazar }) => {
    contenedor.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.innerHTML = el.innerHTML.replace(new RegExp(buscar, "g"), reemplazar);
      }
    });
  });
}
const Visualizacion = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  agregarClases,
  alternarClases,
  cambiarDisplay,
  fetchHTML,
  mostrar,
  mostrarConAnimacion,
  mostrarGrupo,
  mostrarQuitandoClases,
  mostrarQuitandoHidden,
  ocultar,
  ocultarConAnimacion,
  ocultarConClases,
  ocultarConHidden,
  ocultarGrupo,
  quitarClases,
  reemplazarTextosHTML
}, Symbol.toStringTag, { value: "Module" }));
function alternarHabilitadoDeInputs(selectores, bloquear = true) {
  const lista = normalizarSelectores(selectores);
  lista.forEach((el) => {
    el.querySelectorAll("input, select, textarea").forEach((input) => input.disabled = bloquear);
  });
}
function bloquearContenedor(selectores) {
  alternarHabilitadoDeInputs(selectores, true);
}
function desbloquearContenedor(selectores) {
  alternarHabilitadoDeInputs(selectores, false);
}
function bloquearInputs(selectores, tipo = "disabled") {
  normalizarSelectores(selectores).forEach((el) => el.setAttribute(tipo, true));
}
function desbloquearInputs(selectores, tipo = "disabled") {
  normalizarSelectores(selectores).forEach((el) => el.removeAttribute(tipo));
}
function requerirInputs(selectores) {
  normalizarSelectores(selectores).forEach((el) => el.required = true);
}
function desrequerirInputs(selectores) {
  normalizarSelectores(selectores).forEach((el) => el.required = false);
}
const Accesibilidad = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bloquearContenedor,
  bloquearInputs,
  desbloquearContenedor,
  desbloquearInputs,
  desrequerirInputs,
  requerirInputs
}, Symbol.toStringTag, { value: "Module" }));
function extraerValor(entrada) {
  var _a;
  try {
    const el = getElemento(entrada);
    return ((_a = el == null ? void 0 : el.val) == null ? void 0 : _a.call(el)) ?? String((el == null ? void 0 : el.value) ?? "").trim();
  } catch {
    return String(entrada ?? "").trim();
  }
}
function detectarEventos(eventos, selector2, callback) {
  if (eventos.trim().length === 0 || typeof callback !== "function") {
    throw new Error("Debes ingresar al menos un evento válido y un callback como función.");
  }
  eventos = eventos.split(",").map((e) => e.trim()).filter((e) => e.length > 0);
  const elemento = getElemento(selector2);
  const esContenedor = elemento.querySelectorAll("input, textarea, select, datalist").length > 0;
  const elementos = esContenedor ? elemento.querySelectorAll("input, textarea, select, datalist") : [elemento];
  elementos.forEach((campo) => {
    eventos.forEach((evento) => {
      try {
        campo.addEventListener(evento, (e) => callback(campo, e));
      } catch (err) {
        throw new Error("Ingresaste un evento que no es válido.");
      }
    });
  });
}
function requerido$1(el) {
  const valor2 = extraerValor(el);
  return valor2.trim().length > 0;
}
function agregarData(selector2, atributo, valor2) {
  modificarData(selector2, atributo, valor2);
}
function modificarData(selector2, atributo, valor2) {
  const el = getElemento(selector2);
  el.dataset[atributo] = valor2;
}
function quitarData(selector2, atributo) {
  const el = getElemento(selector2);
  if (el && el.dataset.hasOwnProperty(atributo)) {
    delete el.dataset[atributo];
  }
}
const InputBase = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Grupo: group,
  agregarClases,
  agregarData,
  alternarClases,
  bloquear: bloquearInputs,
  cambiarDisplay,
  desbloquear: desbloquearInputs,
  desrequerir: desrequerirInputs,
  detectarEventos,
  extraerValor,
  modificarData,
  mostrar,
  mostrarConAnimacion,
  mostrarQuitandoClases,
  mostrarQuitandoHidden,
  ocultar,
  ocultarConAnimacion,
  ocultarConClases,
  ocultarConHidden,
  quitarClases,
  quitarData,
  requerido: requerido$1,
  requerir: requerirInputs
}, Symbol.toStringTag, { value: "Module" }));
function esVerdadero(entrada) {
  const valor2 = extraerValor(entrada);
  return /^(true|1|y|yes|s|si|sí)$/i.test(valor2);
}
function esFalso(entrada) {
  const valor2 = extraerValor(entrada);
  return /^(false|0|n|no)$/i.test(valor2);
}
const Booleano = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  esFalso,
  esVerdadero
}, Symbol.toStringTag, { value: "Module" }));
function expresion(entrada, regexp2) {
  const valor2 = extraerValor(entrada);
  return regexp2.test(valor2);
}
const Custom = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  expresion
}, Symbol.toStringTag, { value: "Module" }));
function generico(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor2);
}
function dominio(entrada, dominio2) {
  const valor2 = extraerValor(entrada);
  const regex = new RegExp(`^[^\\s@]+@${dominio2.replace(".", "\\.")}$$`, "i");
  return regex.test(valor2);
}
function repetido$1(entrada, otra) {
  const valor2 = extraerValor(entrada);
  const valorOtra = extraerValor(otra);
  return valor2 === valorOtra;
}
const Email$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dominio,
  generico,
  repetido: repetido$1
}, Symbol.toStringTag, { value: "Module" }));
function valida$1(entrada) {
  const valor2 = extraerValor(entrada);
  return !isNaN(Date.parse(valor2));
}
function minima(entrada, min) {
  const valor2 = new Date(extraerValor(entrada));
  return valor2 >= new Date(min);
}
function maxima(entrada, max) {
  const valor2 = new Date(extraerValor(entrada));
  return valor2 <= new Date(max);
}
function entre(entrada, min, max) {
  const valor2 = new Date(extraerValor(entrada));
  const fechaMin = new Date(min);
  const fechaMax = new Date(max);
  if (isNaN(valor2) || isNaN(fechaMin) || isNaN(fechaMax)) return false;
  return valor2 >= fechaMin && valor2 <= fechaMax;
}
function formato(entrada, formato2 = "YYYY-MM-DD") {
  const valor2 = extraerValor(entrada);
  const alias = {
    dia: "YYYY-MM-DD",
    hora: "YYYY-MM-DD HH",
    minuto: "YYYY-MM-DD HH:MM",
    segundo: "YYYY-MM-DD HH:MM:SS"
  };
  const formatos = {
    "YYYY-MM-DD": /^\d{4}-\d{2}-\d{2}$/,
    "YYYY/MM/DD": /^\d{4}\/\d{2}\/\d{2}$/,
    "DD-MM-YYYY": /^\d{2}-\d{2}-\d{4}$/,
    "DD/MM/YYYY": /^\d{2}\/\d{2}\/\d{4}$/,
    "YYYY-MM-DD HH:MM:SS": /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    "YYYY-MM-DD HH:MM": /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
    "YYYY/MM/DD HH:MM:SS": /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/,
    "YYYY/MM/DD HH:MM": /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/,
    "DD-MM-YYYY HH:MM:SS": /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/,
    "DD-MM-YYYY HH:MM": /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
    "DD/MM/YYYY HH:MM:SS": /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/,
    "DD/MM/YYYY HH:MM": /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/
  };
  if (alias[formato2]) formato2 = alias[formato2];
  const regex = formato2 instanceof RegExp ? formato2 : formatos[formato2];
  if (!regex) return false;
  return regex.test(valor2);
}
const Fecha$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  entre,
  formato,
  maxima,
  minima,
  valida: valida$1
}, Symbol.toStringTag, { value: "Module" }));
function requerido(entrada) {
  return extraerValor(entrada).trim().length > 0;
}
function largoMinimo$1(entrada, min) {
  const valor2 = extraerValor(entrada);
  return valor2.trim().length >= min;
}
function largoMaximo(entrada, max) {
  const valor2 = extraerValor(entrada);
  return valor2.length <= max;
}
function largoExacto(entrada, n) {
  const valor2 = extraerValor(entrada);
  return valor2.length === n;
}
function soloLetras(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[A-Za-z]+$/.test(valor2);
}
function soloLetrasYEspacios(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[A-Za-z\s]+$/.test(valor2);
}
function alfanumerico$1(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[A-Za-z0-9]+$/.test(valor2);
}
function contiene(entrada, sub) {
  const valor2 = extraerValor(entrada);
  return valor2.includes(sub);
}
function noEspacios(entrada) {
  const valor2 = extraerValor(entrada);
  return !/\s/.test(valor2);
}
function noCaracteresEspeciales(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[A-Za-z0-9\s]+$/.test(valor2);
}
function palabrasMinimas(entrada, min) {
  const valor2 = extraerValor(entrada);
  return valor2.trim().split(/\s+/).length >= min;
}
function trimText(entrada) {
  const valor2 = extraerValor(entrada);
  return valor2.trim();
}
function enLista(entrada, lista) {
  const valor2 = extraerValor(entrada);
  return lista.includes(valor2);
}
function aMayusculas(entrada) {
  let valor2 = extraerValor(entrada);
  return valor2 = valor2.toUpperCase();
}
function aMinusculas(entrada) {
  let valor2 = extraerValor(entrada);
  return valor2 = valor2.toLowerCase();
}
function capitalizarInicial(entrada) {
  const valor2 = extraerValor(entrada);
  return valor2.charAt(0).toUpperCase() + valor2.slice(1);
}
function capitalizarPalabras(entrada) {
  const valor2 = extraerValor(entrada);
  return valor2.split(" ").map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(" ");
}
function capitalizarPalabrasExcepto(entrada, excepciones = ["de", "la", "van", "von", "di", "le"]) {
  const partes = extraerValor(entrada).trim().toLowerCase().split(/\s+/);
  return partes.map(
    (p, i) => i > 0 && excepciones.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)
  ).join(" ");
}
function esJSON(entrada) {
  const valor2 = extraerValor(entrada);
  try {
    JSON.parse(valor2);
    return true;
  } catch {
    return false;
  }
}
function stringAJson(cadena, separadores = { elemento: ";", atributo: ",", claveValor: "=" }) {
  const { elemento, atributo, claveValor } = separadores;
  return cadena.split(elemento).filter(Boolean).map((elemento2) => {
    const atributos = elemento2.split(atributo).reduce((obj, atributo2) => {
      const [clave, valor2] = atributo2.split(claveValor).map((v) => v == null ? void 0 : v.trim());
      if ((valor2 == null ? void 0 : valor2.startsWith("{")) && valor2.endsWith("}")) {
        obj[clave] = transformarAJsonAvanzado(
          valor2.slice(1, -1),
          // Remover las llaves `{}` del valor
          { elemento: ",", atributo: ":", claveValor: ":" }
          // Separadores internos
        );
      } else {
        obj[clave] = valor2 || null;
      }
      return obj;
    }, {});
    return atributos;
  });
}
const Texto$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  aMayusculas,
  aMinusculas,
  alfanumerico: alfanumerico$1,
  capitalizarInicial,
  capitalizarPalabras,
  capitalizarPalabrasExcepto,
  contiene,
  enLista,
  esJSON,
  largoExacto,
  largoMaximo,
  largoMinimo: largoMinimo$1,
  noCaracteresEspeciales,
  noEspacios,
  palabrasMinimas,
  requerido,
  soloLetras,
  soloLetrasYEspacios,
  stringAJson,
  trimText
}, Symbol.toStringTag, { value: "Module" }));
const excepcionesEs = [
  "de",
  "del",
  "la",
  "las",
  "los",
  "y",
  "van",
  "von"
];
const excepcionesEn = [
  "of",
  "and",
  "the"
];
const excepcionesFr = [
  "de",
  "du",
  "des",
  "la",
  "le",
  "les",
  "et",
  "à",
  "au",
  "aux",
  "d'",
  "l'"
];
const excepcionesPt = [
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "ao",
  "aos",
  "na",
  "nos"
];
const excepcionesIt = [
  "di",
  "del",
  "della",
  "dei",
  "degli",
  "e",
  "la",
  "le",
  "in",
  "al",
  "allo"
];
const excepcionesDe = [
  "von",
  "zu",
  "zum",
  "zur",
  "am",
  "im",
  "der",
  "die",
  "das",
  "und",
  "bei"
];
const excepcionesNl = [
  "van",
  "de",
  "der",
  "den",
  "het",
  "en",
  "te",
  "op",
  "aan"
];
const excepcionesGa = [
  "O'",
  "Mac",
  "Mc",
  "Ní",
  "Nic"
];
const excepcionesTodas = [.../* @__PURE__ */ new Set([
  ...excepcionesEs,
  ...excepcionesEn,
  ...excepcionesFr,
  ...excepcionesPt,
  ...excepcionesIt,
  ...excepcionesDe,
  ...excepcionesNl,
  ...excepcionesGa
])];
function titleCase(entrada, excepciones = excepcionesTodas) {
  return capitalizarPalabrasExcepto(entrada, excepciones);
}
const Nombre = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  titleCase
}, Symbol.toStringTag, { value: "Module" }));
function entero(entrada) {
  const valor2 = extraerValor(entrada);
  const n = Number(valor2);
  return Number.isInteger(n);
}
function decimal(entrada) {
  const valor2 = extraerValor(entrada);
  const n = Number(valor2);
  return !isNaN(n) && valor2.toString().includes(".");
}
function minimo(entrada, min) {
  const valor2 = Number(extraerValor(entrada));
  return valor2 >= min;
}
function maximo(entrada, max) {
  const valor2 = Number(extraerValor(entrada));
  return valor2 <= max;
}
function rango(entrada, min, max) {
  const n = Number(extraerValor(entrada));
  return n >= min && n <= max;
}
const Numero$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decimal,
  entero,
  maximo,
  minimo,
  rango
}, Symbol.toStringTag, { value: "Module" }));
function regexp(entrada, regexp2) {
  const valor2 = extraerValor(entrada);
  return regexp2.test(valor2);
}
function largoMinimo(entrada, min) {
  const valor2 = extraerValor(entrada);
  return valor2.length >= min;
}
function alfanumerico(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[A-Za-z0-9]+$/.test(valor2);
}
function numerosLetrasEspecial(entrada) {
  const valor2 = extraerValor(entrada);
  return /[A-Za-z]/.test(valor2) && /[0-9]/.test(valor2) && /[^A-Za-z0-9]/.test(valor2);
}
function fuerte(entrada, min = 8) {
  const valor2 = extraerValor(entrada);
  return valor2.length >= min && /[a-z]/.test(valor2) && /[A-Z]/.test(valor2) && /[0-9]/.test(valor2) && /[^A-Za-z0-9]/.test(valor2);
}
function repetido(entrada, otra) {
  const valor1 = extraerValor(entrada);
  const valor2 = extraerValor(otra);
  return valor1 === valor2;
}
function mostrarOcultar(elementoPassword, elementoIcono, iconos = ["fa-eye-slash", "fa-eye"]) {
  let pwdEl = elementoPassword;
  let iconEl = elementoIcono;
  const [iconHide, iconShow] = iconos;
  if (typeof elementoPassword === "string") {
    if (!elementoPassword.startsWith("#")) {
      throw new TypeError('ID de elementoPassword debe empezar con "#".');
    }
    pwdEl = document.getElementById(elementoPassword.slice(1));
    if (!pwdEl) throw new TypeError("No se encontró elementoPassword con el ID dado.");
  }
  if (typeof elementoIcono === "string") {
    if (!elementoIcono.startsWith("#")) {
      throw new TypeError('ID de elementoIcono debe empezar con "#".');
    }
    iconEl = document.getElementById(elementoIcono.slice(1));
    if (!iconEl) throw new TypeError("No se encontró elementoIcono con el ID dado.");
  }
  if (!(pwdEl instanceof HTMLElement) || !(iconEl instanceof HTMLElement)) {
    throw new TypeError("elementoPassword y elementoIcono deben ser HTMLElement o IDs válidos.");
  }
  if (elementoPassword.getAttribute("type") === "password") {
    elementoIcono.classList.remove(iconHide);
    elementoIcono.classList.add(iconShow);
    elementoPassword.setAttribute("type", "text");
  } else {
    elementoIcono.classList.remove(iconShow);
    elementoIcono.classList.add(iconHide);
    elementoPassword.setAttribute("type", "password");
  }
}
const Password$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  alfanumerico,
  fuerte,
  largoMinimo,
  mostrarOcultar,
  numerosLetrasEspecial,
  regexp,
  repetido
}, Symbol.toStringTag, { value: "Module" }));
function valida(elemento) {
  const valor2 = extraerValor(elemento);
  return /^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(valor2);
}
function esHttps(elemento) {
  const valor2 = extraerValor(elemento);
  return /^https:\/\//.test(valor2);
}
const Url$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  esHttps,
  valida
}, Symbol.toStringTag, { value: "Module" }));
function runSoloNumeros(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[0-9]{7,8}$/.test(valor2);
}
function runNumerosVerificados(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[0-9]{7,8}[0-9kK]$/.test(valor2);
}
function runNumerosVerificadosConGuion(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[0-9]{7,8}-[0-9kK]$/.test(valor2);
}
function runCompleto(entrada) {
  const valor2 = extraerValor(entrada);
  return /^(\d{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK])$/.test(valor2);
}
const DNIChile = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  runCompleto,
  runNumerosVerificados,
  runNumerosVerificadosConGuion,
  runSoloNumeros
}, Symbol.toStringTag, { value: "Module" }));
function numero(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[0-9]{7,15}$/.test(valor2);
}
function numeroConCodigoPais(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+\d{1,3}[0-9]{7,15}$/.test(valor2);
}
const FonoGenerico = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  numero,
  numeroConCodigoPais
}, Symbol.toStringTag, { value: "Module" }));
function celular$6(entrada) {
  const valor2 = extraerValor(entrada);
  return /^11\d{8}$/.test(valor2);
}
function fijo$6(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[23]\d{9}$/.test(valor2);
}
function celularConCodigoPais$6(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+54911\d{8}$/.test(valor2);
}
function fijoConCodigoPais$6(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+54[23]\d{9}$/.test(valor2);
}
const FonoArgentina = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular: celular$6,
  celularConCodigoPais: celularConCodigoPais$6,
  fijo: fijo$6,
  fijoConCodigoPais: fijoConCodigoPais$6
}, Symbol.toStringTag, { value: "Module" }));
function celular$5(entrada) {
  const valor2 = extraerValor(entrada);
  return /^9\d{8}$/.test(valor2);
}
function fijo$5(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[2-8]\d{8}$/.test(valor2);
}
function celularConCodigoPais$5(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+569\d{8}$/.test(valor2);
}
function fijoConCodigoPais$5(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+56[2-8]\d{7}$/.test(valor2);
}
const FonoChile = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular: celular$5,
  celularConCodigoPais: celularConCodigoPais$5,
  fijo: fijo$5,
  fijoConCodigoPais: fijoConCodigoPais$5
}, Symbol.toStringTag, { value: "Module" }));
function celular$4(entrada) {
  const valor2 = extraerValor(entrada);
  return /^3\d{9}$/.test(valor2);
}
function fijo$4(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[2-8]\d{6}$/.test(valor2);
}
function celularConCodigoPais$4(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+573\d{9}$/.test(valor2);
}
function fijoConCodigoPais$4(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+57[1-8]\d{7}$/.test(valor2);
}
const FonoColombia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular: celular$4,
  celularConCodigoPais: celularConCodigoPais$4,
  fijo: fijo$4,
  fijoConCodigoPais: fijoConCodigoPais$4
}, Symbol.toStringTag, { value: "Module" }));
function celular$3(entrada) {
  const valor2 = extraerValor(entrada);
  return /^3\d{7}$/.test(valor2);
}
function fijo$3(entrada) {
  const valor2 = extraerValor(entrada);
  return /^2\d{7}$/.test(valor2);
}
function celularConCodigoPais$3(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+5093\d{7}$/.test(valor2);
}
function fijoConCodigoPais$3(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+5092\d{7}$/.test(valor2);
}
const FonoHaiti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular: celular$3,
  celularConCodigoPais: celularConCodigoPais$3,
  fijo: fijo$3,
  fijoConCodigoPais: fijoConCodigoPais$3
}, Symbol.toStringTag, { value: "Module" }));
function celular$2(entrada) {
  const valor2 = extraerValor(entrada);
  return /^55\d{8}$/.test(valor2);
}
function fijo$2(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[2-9]\d{9}$/.test(valor2);
}
function celularConCodigoPais$2(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+5255\d{8}$/.test(valor2);
}
function fijoConCodigoPais$2(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+52[2-9]\d{9}$/.test(valor2);
}
const FonoMexico = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular: celular$2,
  celularConCodigoPais: celularConCodigoPais$2,
  fijo: fijo$2,
  fijoConCodigoPais: fijoConCodigoPais$2
}, Symbol.toStringTag, { value: "Module" }));
function celular$1(entrada) {
  const valor2 = extraerValor(entrada);
  return /^9\d{8}$/.test(valor2);
}
function fijo$1(entrada) {
  const valor2 = extraerValor(entrada);
  return /^[1-8]\d{6,7}$/.test(valor2);
}
function celularConCodigoPais$1(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+519\d{8}$/.test(valor2);
}
function fijoConCodigoPais$1(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+51[1-8]\d{6,7}$/.test(valor2);
}
const FonoPeru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular: celular$1,
  celularConCodigoPais: celularConCodigoPais$1,
  fijo: fijo$1,
  fijoConCodigoPais: fijoConCodigoPais$1
}, Symbol.toStringTag, { value: "Module" }));
function celular(entrada) {
  const valor2 = extraerValor(entrada);
  return /^(0412|0414|0416|0424|0426)\d{7}$/.test(valor2);
}
function fijo(entrada) {
  const valor2 = extraerValor(entrada);
  return /^(0212|02[4-7]\d)\d{7}$/.test(valor2);
}
function celularConCodigoPais(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+58(412|414|416|424|426)\d{7}$/.test(valor2);
}
function fijoConCodigoPais(entrada) {
  const valor2 = extraerValor(entrada);
  return /^\+58(212|2[4-7]\d)\d{7}$/.test(valor2);
}
const FonoVenezuela = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  celular,
  celularConCodigoPais,
  fijo,
  fijoConCodigoPais
}, Symbol.toStringTag, { value: "Module" }));
const Persona = {
  chile: DNIChile
};
const Fono$1 = {
  generico: FonoGenerico,
  argentina: FonoArgentina,
  chile: FonoChile,
  colombia: FonoColombia,
  haiti: FonoHaiti,
  mexico: FonoMexico,
  peru: FonoPeru,
  venezuela: FonoVenezuela
};
const Funciones = {
  booleano: Booleano,
  custom: Custom,
  email: Email$1,
  fecha: Fecha$1,
  nombre: Nombre,
  numero: Numero$1,
  password: Password$1,
  texto: Texto$1,
  url: Url$1,
  persona: Persona,
  fono: Fono$1
};
function valores$1(selector2) {
  return getElementoGrupal(selector2).filter((chk) => chk.checked).map((chk) => chk.value);
}
function marcado$1(elemento) {
  return getElemento(elemento).checked;
}
function algunoMarcado$1(elemento) {
  const grupo = getElementoGrupal(elemento);
  return Array.from(grupo).some((c) => c.checked);
}
function cantidadMarcados(selector2, cantidad, exacto = false) {
  const grupo = getElementoGrupal(selector2);
  const marcados = Array.from(grupo).filter((c) => c.checked).length;
  return exacto ? marcados === cantidad : marcados >= cantidad;
}
const inputCheckbox = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  algunoMarcado: algunoMarcado$1,
  cantidadMarcados,
  marcado: marcado$1,
  valores: valores$1
}, Symbol.toStringTag, { value: "Module" }));
const Fecha = {
  ...Funciones.fecha
};
const Email = {
  ...Funciones.email
};
function seleccionado(elemento) {
  var _a;
  const nodo = getElemento(elemento);
  return ((_a = nodo == null ? void 0 : nodo.files) == null ? void 0 : _a.length) > 0;
}
function extensionValida(elemento, extensiones) {
  const nodo = getElemento(elemento);
  const nombre2 = (nodo == null ? void 0 : nodo.value) || "";
  const ext = "." + nombre2.split(".").pop().toLowerCase();
  return extensiones.includes(ext);
}
function tipoMimeValido(elemento, tipos) {
  var _a;
  const nodo = getElemento(elemento);
  const archivo = (_a = nodo == null ? void 0 : nodo.files) == null ? void 0 : _a[0];
  if (!archivo) return true;
  return tipos.includes(archivo.type);
}
function tamanioMaximo(elemento, max, unidad = "B") {
  var _a;
  const nodo = getElemento(elemento);
  const archivo = (_a = nodo == null ? void 0 : nodo.files) == null ? void 0 : _a[0];
  const unidades = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
  const maxBytes = max * (unidades[unidad] || 1);
  return archivo ? archivo.size <= maxBytes : false;
}
const inputFile = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extensionValida,
  seleccionado,
  tamanioMaximo,
  tipoMimeValido
}, Symbol.toStringTag, { value: "Module" }));
const Numero = {
  ...Funciones.numero
};
const Password = {
  ...Funciones.password
};
function valor(selector2) {
  var _a;
  return ((_a = [...getElementoGrupal(selector2)].find((r) => r.checked)) == null ? void 0 : _a.value) ?? null;
}
function marcado(elemento) {
  return getElemento(elemento).checked;
}
function algunoMarcado(elemento) {
  const grupo = getElementoGrupal(elemento);
  return Array.from(grupo).some((c) => c.checked);
}
const inputRadio = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  algunoMarcado,
  marcado,
  valor
}, Symbol.toStringTag, { value: "Module" }));
({
  ...Funciones.numero
});
const Fono = {
  ...Funciones.fono
};
const Texto = {
  ...Funciones.texto
};
const Url = {
  ...Funciones.url
};
const inputUrl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Url
}, Symbol.toStringTag, { value: "Module" }));
function valido(elemento, invalido = "0") {
  return getElemento(elemento).value !== invalido;
}
function valores(selector2) {
  const elemento = getElemento(selector2);
  if (!elemento.multiple) throw new Error(`El select no tiene el atributo 'multiple'`);
  return [...elemento.options].filter((opt) => opt.selected).map((opt) => opt.value);
}
function algunoSeleccionado(selector2, invalido = "0") {
  const elemento = getElemento(selector2);
  if (!elemento.multiple) throw new Error(`El select no tiene el atributo 'multiple'`);
  return Array.from(elemento.selectedOptions).filter((opt) => opt.value !== invalido).length > 0;
}
function cantidadSeleccionados(selector2, invalido = "0", cantidad = 1, exacto = false) {
  const elemento = getElemento(selector2);
  if (!elemento.multiple) throw new Error(`El select no tiene el atributo 'multiple'`);
  const seleccionadosValidos = Array.from(elemento.selectedOptions).filter((opt) => opt.value !== invalido).length;
  return exacto ? seleccionadosValidos === cantidad : seleccionadosValidos >= cantidad;
}
const inputSelect = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  algunoSeleccionado,
  cantidadSeleccionados,
  valido,
  valores
}, Symbol.toStringTag, { value: "Module" }));
const Input = {
  ...InputBase,
  ...group,
  "checkbox": inputCheckbox,
  "date": Fecha,
  "datetime": Fecha,
  "email": Email,
  "file": inputFile,
  "number": Numero,
  "password": Password,
  "radio": inputRadio,
  "tel": Fono,
  "text": Texto,
  "url": inputUrl,
  "select": inputSelect
};
function agregarValoresAInputs(selector2, valoresInputs) {
  if (valoresInputs.length > 0) {
    valoresInputs.forEach((input) => {
      const elInput = selector2.matches(`[name="${input.name}"]`) ? selector2 : selector2.querySelector(`[name="${input.name}"]`);
      if (elInput) {
        if (elInput.tagName === "SELECT" && elInput.multiple) {
          const valores2 = Array.isArray(input.value) ? input.value : [input.value];
          Array.from(elInput.options).forEach((option) => {
            option.selected = valores2.includes(option.value);
          });
        } else if (elInput.tagName === "DATALIST") {
          const inputAsociado = selector2.querySelector(`input[list="${elInput.id}"]`);
          if (inputAsociado) {
            inputAsociado.value = input.value || "";
          }
        } else {
          elInput.value = input.value || "";
          elInput.required = input.required || false;
          if (input.type === "checkbox") {
            elInput.checked = input.checked || false;
          }
          if (input.data) {
            Object.entries(input.data).forEach(([key, value]) => {
              elInput.setAttribute(`data-${key}`, value);
            });
          }
          Object.entries(input).forEach(([key, value]) => {
            if (!["name", "value", "required", "checked", "data", "type"].includes(key)) {
              if (key in elInput) {
                elInput[key] = value;
              } else {
                elInput.setAttribute(key, value);
              }
            }
          });
        }
      }
    });
  }
}
const invocandoValoresIniciales = [];
function iniciarValores(selector2, valoresInputs = []) {
  const form = getElementoPorId(selector2);
  agregarValoresAInputs(form, valoresInputs);
  invocandoValoresIniciales[form.id] = obtenerValores(form, "string");
}
function actualizarValores(selector2) {
  const form = getElementoPorId(selector2);
  invocandoValoresIniciales[form.id] = obtenerValores(form, "string");
  return invocandoValoresIniciales[form.id];
}
function obtenerValores(contenedor, formato2 = "json", caracteresSaneados = false, incluirData = false) {
  const elemento = getElementoPorId(contenedor);
  const elementos = elemento.querySelectorAll("input, select, textarea, datalist");
  const sanear = (valor2) => {
    if (!caracteresSaneados || typeof valor2 !== "string") return valor2;
    return valor2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  const resultado = Array.from(elementos).map((el) => {
    const datos = {
      id: el.id || null,
      name: el.name || null,
      value: sanear(el.value || ""),
      type: el.type || null,
      required: el.required || false,
      disabled: el.disabled || false,
      placeholder: sanear(el.placeholder || null)
    };
    if (incluirData) {
      datos.data = {};
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          datos.data[attr.name] = sanear(attr.value);
        }
      });
    }
    return datos;
  });
  switch (formato2) {
    case "array":
      return resultado;
    case "json":
      return JSON.stringify(resultado, null, 2);
    case "string":
      return resultado.map((dato) => {
        const atributos = [
          `id=${dato.id}`,
          `name=${dato.name}`,
          `value=${dato.value}`,
          `type=${dato.type}`,
          `required=${dato.required}`,
          `disabled=${dato.disabled}`,
          `placeholder=${dato.placeholder}`
        ];
        if (incluirData && dato.data) {
          Object.entries(dato.data).forEach(([key, value]) => {
            atributos.push(`${key}=${value}`);
          });
        }
        return atributos.join(",");
      }).join(";");
    default:
      throw new Error(`Formato no soportado: ${formato2}`);
  }
}
function validaCambios(selector2) {
  const form = getElementoPorId(selector2);
  const valoresActuales = obtenerValores(form, "string");
  return valoresActuales !== invocandoValoresIniciales[form.id];
}
function saliendoSinGuardar(selector2) {
  const form = getElementoPorId(selector2);
  window.addEventListener("beforeunload", (e) => {
    if (validaCambios(form)) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}
function resetearValores(selector2) {
  const form = getElementoPorId(selector2);
  if (invocandoValoresIniciales[form.id]) {
    const valores2 = JSON.parse(invocandoValoresIniciales[form.id]);
    valores2.forEach((valor2) => {
      const input = form.querySelector(`[name="${valor2.name}"]`);
      if (input) {
        input.value = valor2.value;
        input.checked = valor2.type === "checkbox" ? valor2.value : input.checked;
      }
    });
  }
}
function completado(form, selector2 = ".requerido, [required]") {
  const elForm = getElementoPorId(form);
  const campos = elForm.querySelectorAll(selector2);
  return Array.from(campos).every((el) => el.value && el.value.toString().trim() !== "");
}
function limpiar(selector2, presionandoCheckboxs = false, valorRadioButtonsPorDefecto = 0) {
  const form = getElementoPorId(selector2);
  if (!form || form.tagName !== "FORM") {
    throw new Error("El elemento no es un formulario válido o no existe.");
  }
  limpiarInputsDeContenedor(form, presionandoCheckboxs, valorRadioButtonsPorDefecto);
}
function limpiarInputsDeContenedor(selector2, presionandoCheckboxs = false, valorRadioButtonsPorDefecto = false) {
  const contenedor = getElementoPorId(selector2);
  contenedor.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea").forEach((el) => el.value = "");
  contenedor.querySelectorAll("select").forEach((select) => {
    const firstOption = select.querySelector("option");
    select.value = (firstOption == null ? void 0 : firstOption.value) || "";
  });
  contenedor.querySelectorAll("input[type=radio]").forEach((r) => r.checked = false);
  const radiosAgrupados = /* @__PURE__ */ new Set();
  contenedor.querySelectorAll("input[type=radio]").forEach((r) => {
    if (r.name) radiosAgrupados.add(r.name);
  });
  if (valorRadioButtonsPorDefecto != false) {
    radiosAgrupados.forEach((name) => {
      var _a;
      const radios = contenedor.querySelectorAll(`input[name='${name}'][type=radio]`);
      const match = Array.from(radios).find((r) => r.value == valorRadioButtonsPorDefecto);
      (_a = match || radios[0]) == null ? void 0 : _a.click();
    });
  }
  contenedor.querySelectorAll("input[type=checkbox]").forEach((chk) => {
    if (presionandoCheckboxs && chk.checked) chk.click();
    else chk.checked = false;
  });
  contenedor.querySelectorAll("datalist").forEach((datalist) => {
    const inputAsociado = contenedor.querySelector(`input[list="${datalist.id}"]`);
    if (inputAsociado) {
      inputAsociado.value = "";
    }
  });
}
function ocultarCampos(selector2, {
  ocultandoConDisplay = ["data-invocando-ocultarConDisplay", true],
  ocultandoConHidden = ["data-invocando-ocultarConHidden", true],
  ocultandoConClass = ["data-invocando-ocultarConClass", "invocando-ocultar"]
}) {
  const grupoActual = getElementoPorId(selector2);
  const atributosOcultables = [
    {
      atributo: ocultandoConDisplay,
      accion: ocultar
    },
    {
      atributo: ocultandoConHidden,
      accion: ocultarConHidden
    },
    {
      atributo: ocultandoConClass,
      accion: (elemento) => {
        const clases = ocultandoConClass[1].split(" ");
        clases.forEach((clase) => ocultarConClases(elemento, clase));
      }
    }
  ];
  atributosOcultables.forEach(({
    atributo,
    accion
  }) => {
    const elementos = grupoActual.querySelectorAll(`#${grupoActual.id} [${atributo[0]}="${atributo[1]}"]`);
    elementos.forEach((elemento) => accion(elemento));
  });
}
function resetearClasesYErrores(selector2, clasesAEliminar = null, clasesAAgregar = null, dataError = "data-invocando-error") {
  const elemento = getElementoPorId(selector2);
  const inputs = [...elemento.matches("input, textarea, select") ? [elemento] : [], ...elemento.querySelectorAll("input, textarea, select")];
  const dataErrores = elemento.querySelectorAll(`[${dataError}]`);
  if (clasesAEliminar === null) clasesAEliminar = [];
  if (clasesAAgregar === null) clasesAAgregar = [];
  inputs.forEach((campo) => {
    clasesAEliminar.forEach((clase) => campo.classList.remove(clase));
    clasesAAgregar.forEach((clase) => campo.classList.add(clase));
  });
  dataErrores.forEach((el) => {
    const idError = el.getAttribute(dataError);
    const elementoRelacionado = document.getElementById(idError);
    if (elementoRelacionado) {
      elementoRelacionado.innerHTML = "";
      elementoRelacionado.style.display = "none";
    }
  });
}
const FormularioBase = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  actualizarValores,
  agregarValoresAInputs,
  bloquearContenedor,
  bloquearInputs,
  completado,
  desbloquearContenedor,
  desbloquearInputs,
  desrequerirInputs,
  detectarEventos,
  iniciarValores,
  limpiar,
  limpiarInputsDeContenedor,
  obtenerValores,
  ocultarCampos,
  requerirInputs,
  resetearClasesYErrores,
  resetearValores,
  saliendoSinGuardar,
  validaCambios
}, Symbol.toStringTag, { value: "Module" }));
const Formulario = {
  ...FormularioBase
};
function esMovil$1() {
  return /Mobi|Android/i.test(navigator.userAgent);
}
function esEscritorio() {
  return !/Mobi|Android/i.test(navigator.userAgent);
}
function esTouch() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
function sistemaOperativo() {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os x/i.test(ua)) return "MacOS";
  if (/linux/i.test(ua)) return "Linux";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  return "Otro";
}
const Dispositivo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  esEscritorio,
  esMovil: esMovil$1,
  esTouch,
  sistemaOperativo
}, Symbol.toStringTag, { value: "Module" }));
function nombre() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("opr gx")) return "Opera GX";
  if (ua.includes("opr") || ua.includes("opera")) return "Opera";
  if (ua.includes("samsungbrowser")) return "Samsung Internet";
  if (ua.includes("vivaldi")) return "Vivaldi";
  if (ua.includes("duckduckgo")) return "DuckDuckGo";
  if (ua.includes("palemoon")) return "Pale Moon";
  if (ua.includes("waterfox")) return "Waterfox";
  if (ua.includes("librewolf")) return "LibreWolf";
  if (ua.includes("torbrowser") || ua.includes("tor")) return "Tor";
  if (ua.includes("brave")) return "Brave";
  if ((ua.includes("chrome") || ua.includes("crios") || ua.includes("crmo")) && !ua.includes("edg") && !ua.includes("opr") && !ua.includes("samsung") && !ua.includes("vivaldi") && !ua.includes("brave")) return "Chrome";
  if (ua.includes("firefox") || ua.includes("fxios")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")) return "Safari";
  return "Otro";
}
function version() {
  const ua = navigator.userAgent;
  const matchers = [
    { name: "Edge", regex: /Edg\/([\d.]+)/ },
    { name: "Opera GX", regex: /OPRGX\/([\d.]+)/ },
    { name: "Opera", regex: /OPR\/([\d.]+)/ },
    { name: "Samsung Internet", regex: /SamsungBrowser\/([\d.]+)/ },
    { name: "Vivaldi", regex: /Vivaldi\/([\d.]+)/ },
    { name: "DuckDuckGo", regex: /DuckDuckGo\/([\d.]+)/ },
    { name: "Pale Moon", regex: /PaleMoon\/([\d.]+)/ },
    { name: "Waterfox", regex: /Waterfox\/([\d.]+)/ },
    { name: "LibreWolf", regex: /LibreWolf\/([\d.]+)/ },
    { name: "Tor", regex: /TorBrowser\/([\d.]+)/ },
    { name: "Brave", regex: /Brave\/([\d.]+)/ },
    { name: "Chrome", regex: /Chrome\/([\d.]+)/ },
    { name: "Firefox", regex: /Firefox\/([\d.]+)/ },
    { name: "Safari", regex: /Version\/([\d.]+).*Safari/ }
  ];
  for (const { regex } of matchers) {
    const match = ua.match(regex);
    if (match) return match[1];
  }
  return "desconocida";
}
function esMovil() {
  return /Mobi|Android/i.test(navigator.userAgent);
}
const Navegador = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  esMovil,
  nombre,
  version
}, Symbol.toStringTag, { value: "Module" }));
function obtenerAlto() {
  return window.screen.height;
}
function altoMinimo(min) {
  return window.screen.height >= min;
}
function altoMaximo(max) {
  return window.screen.height <= max;
}
function obtenerAncho() {
  return window.screen.width;
}
function anchoMinimo(min) {
  return window.screen.width >= min;
}
function anchoMaximo(max) {
  return window.screen.width <= max;
}
const Pantalla = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  altoMaximo,
  altoMinimo,
  anchoMaximo,
  anchoMinimo,
  obtenerAlto,
  obtenerAncho
}, Symbol.toStringTag, { value: "Module" }));
const UI = {
  accesibilidad: Accesibilidad,
  dispositivo: Dispositivo,
  navegador: Navegador,
  pantalla: Pantalla,
  visualizacion: Visualizacion
};
function validaString(valor2, throwError = true) {
  var _a;
  if (typeof valor2 !== "string" || valor2.trim() === "") {
    console.error("[validaParametroTexto] Se esperaba un string no vacío pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un string válido o el string está vacío.");
    return false;
  }
  return true;
}
function validaInt(valor2, throwError = true) {
  var _a;
  const num = typeof valor2 === "number" ? valor2 : Number(valor2);
  if (!Number.isInteger(num)) {
    console.error("[validaInt] Se esperaba un entero pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un entero válido.");
    return false;
  }
  return true;
}
function validaDouble(valor2, throwError = true) {
  var _a;
  const num = typeof valor2 === "number" ? valor2 : Number(valor2);
  if (Number.isNaN(num) || !isFinite(num)) {
    console.error("[validaDouble] Se esperaba un número (double) pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un número válido.");
    return false;
  }
  return true;
}
function validaDate(valor2, throwError = true) {
  var _a;
  if (!(valor2 instanceof Date && !isNaN(valor2.valueOf())) && !(typeof valor2 === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor2) && !isNaN(Date.parse(valor2)))) {
    console.error("[validaDate] Se esperaba una fecha (Date o string YYYY-MM-DD) pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió una fecha válida.");
    return false;
  }
  return true;
}
function validaDateTime(valor2, throwError = true) {
  var _a;
  if (!(valor2 instanceof Date && !isNaN(valor2.valueOf())) && !(typeof valor2 === "string" && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(valor2) && !isNaN(Date.parse(valor2)))) {
    console.error("[validaDateTime] Se esperaba un datetime (Date o string ISO) pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un datetime válido.");
    return false;
  }
  return true;
}
function validaBoolean(valor2, throwError = true) {
  var _a;
  if (typeof valor2 !== "boolean") {
    console.error("[validaBoolean] Se esperaba un booleano pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un booleano válido.");
    return false;
  }
  return true;
}
function validaArray(valor2, throwError = true) {
  var _a;
  if (!Array.isArray(valor2)) {
    console.error("[validaArray] Se esperaba un array pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un array válido.");
    return false;
  }
  return true;
}
function validaObject(valor2, throwError = true) {
  var _a;
  if (typeof valor2 !== "object" || valor2 === null || Array.isArray(valor2)) {
    console.error("[validaObject] Se esperaba un objeto pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un objeto válido.");
    return false;
  }
  return true;
}
function validaObjetojQuery($objeto, throwError = true) {
  var _a;
  if (!($objeto instanceof jQuery)) {
    console.error("[validaObjetojQuery] Se esperaba un objeto jQuery pero se recibió:", $objeto);
    console.error("Tipo:", typeof $objeto, "| Constructor:", ((_a = $objeto == null ? void 0 : $objeto.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un objeto jQuery válido.");
    return false;
  }
  return true;
}
function validaHTMLElement(elemento, throwError = true) {
  var _a;
  if (!(elemento instanceof HTMLElement)) {
    console.error("[validaHTMLElement] Se esperaba un HTMLElement pero se recibió:", elemento);
    console.error("Tipo:", typeof elemento, "| Constructor:", ((_a = elemento == null ? void 0 : elemento.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un HTMLElement válido.");
    return false;
  }
  return true;
}
function validaFunction(valor2, throwError = true) {
  var _a;
  if (typeof valor2 !== "function") {
    console.error("[validaFunction] Se esperaba una función pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió una función válida.");
    return false;
  }
  return true;
}
function validaNoNull(valor2, throwError = true) {
  var _a;
  if (valor2 === null || valor2 === void 0) {
    console.error("[validaNoNull] Se esperaba un valor no nulo/indefinido pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un valor válido.");
    return false;
  }
  return true;
}
function validaSVGElement(valor2, throwError = true) {
  var _a;
  if (!(valor2 instanceof SVGElement)) {
    console.error("[validaSVGElement] Se esperaba un SVGElement pero se recibió:", valor2);
    console.error("Tipo:", typeof valor2, "| Constructor:", ((_a = valor2 == null ? void 0 : valor2.constructor) == null ? void 0 : _a.name) || "indefinido");
    console.trace("Pila de ejecución");
    if (throwError) throw new Error("No se recibió un SVGElement válido.");
    return false;
  }
  return true;
}
const Tipo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  validaArray,
  validaBoolean,
  validaDate,
  validaDateTime,
  validaDouble,
  validaFunction,
  validaHTMLElement,
  validaInt,
  validaNoNull,
  validaObject,
  validaObjetojQuery,
  validaSVGElement,
  validaString
}, Symbol.toStringTag, { value: "Module" }));
const Utilidades = {
  selectores: Selectores,
  tipo: Tipo
};
class Validador {
  constructor(formulario = "#form", tipoSalida = "inputs", opcionesValidacion = {}) {
    __privateAdd(this, _Validador_instances);
    this.errores = [];
    this.inputs = [];
    this.reglasPorCampo = [];
    __privateMethod(this, _Validador_instances, configuracion_fn).call(this, formulario, tipoSalida, opcionesValidacion);
  }
  input(name, reglas) {
    this.reglasPorCampo = this.reglasPorCampo || {};
    this.reglasPorCampo[name] = reglas;
    const elementos = getElementosPorName(name);
    if (!elementos || elementos.length === 0) return this;
    const reglasArray = [];
    if (Array.isArray(reglas)) {
      reglas.forEach((regla) => {
        if (Array.isArray(regla) && typeof regla[0] === "function") {
          const [fn, msg, ...args] = regla;
          reglasArray.push([this.regla(fn, ...args), msg]);
        } else {
          reglasArray.push(regla);
        }
      });
    }
    const yaRegistrado = this.inputs.find((i) => i.name === name);
    if (!yaRegistrado) {
      this.inputs.push({
        name,
        reglas: reglasArray
      });
    } else {
      this.inputs.push({
        name,
        reglas: reglasArray
      });
    }
    const validarGrupo = () => {
      __privateMethod(this, _Validador_instances, validarInput_fn).call(this, name, reglasArray, elementos, {
        modo: this.tipoSalida
      });
    };
    if (this.opcionesValidacion.reactivo) {
      elementos.forEach((el) => {
        el.addEventListener("input", validarGrupo);
        el.addEventListener("change", validarGrupo);
      });
    }
    return this;
  }
  regla(fn, ...args) {
    return (elemento) => {
      let actual = elemento;
      while (actual && actual !== document.body) {
        const estilo = window.getComputedStyle(actual);
        const ocultoPorCSS = estilo.display === "none" || estilo.visibility === "hidden" || estilo.opacity === "0";
        const ocultoPorAtributo = actual.hasAttribute("hidden") || actual.getAttribute("aria-hidden") === "true";
        const bloqueado = actual.disabled === true || actual.readOnly === true;
        if (ocultoPorCSS || ocultoPorAtributo || bloqueado) {
          return true;
        }
        actual = actual.parentElement;
      }
      return fn(elemento, ...args);
    };
  }
  mostrarErrores() {
    switch (this.tipoSalida) {
      case "consola":
      case "console":
        this.errores.forEach(({
          mensaje
        }) => console.warn(mensaje));
        break;
      case "alerta":
      case "alert":
        alert(this.errores.map((e) => e.mensaje).join("\n"));
        break;
      case "html":
        if (this.opcionesValidacion.contenedorMsg) {
          const contenedor = document.getElementById(this.opcionesValidacion.contenedorMsg);
          if (contenedor) {
            contenedor.innerHTML = this.errores.map(({
              // Muestra los mensajes de error en el contenedor HTML
              mensaje
            }) => {
              return `<div class="${this.opcionesValidacion.cssMensajeError}">${mensaje}</div>`;
            }).join("");
          }
        }
        break;
      case "inputs":
      case "input":
        this.errores.forEach(({
          name,
          mensaje
        }) => {
          __privateMethod(this, _Validador_instances, actualizarInputEstado_fn).call(this, name, {
            mensaje,
            esError: true,
            claseError: this.opcionesValidacion.cssMensajeError
          });
        });
        break;
      case "arreglo":
      case "array":
        return this.errores;
      case "corto-circuito":
        if (this.errores.length) {
          alert(this.errores[0].mensaje);
        }
        break;
      default:
        this.errores.forEach(({
          mensaje
        }) => console.error(mensaje));
    }
  }
  valida() {
    this.errores = [];
    for (const input of this.inputs) {
      const elementos = getElementosPorName(input.name);
      if (this.tipoSalida === "input" || this.tipoSalida === "inputs") __privateMethod(this, _Validador_instances, validarInput_fn).call(this, input.name, input.reglas, elementos, {
        modo: "input"
      });
      else __privateMethod(this, _Validador_instances, validarInput_fn).call(this, input.name, input.reglas, elementos, {
        modo: "otros"
      });
    }
    return this.errores.length === 0;
  }
  reset() {
    this.errores = [];
    limpiarInputsDeContenedor(this.formulario, this.opcionesValidacion.limpiarPresionandoCheckboxs, this.opcionesValidacion.limpiarRadiosConValor);
    resetearClasesYErrores(this.formulario, [this.opcionesValidacion.cssInputError, this.opcionesValidacion.cssInputExito], this.opcionesValidacion.cssInputNeutro, this.opcionesValidacion.dataError);
    ocultarCampos(this.formulario, {
      dataOcultarConDisplay: this.opcionesValidacion.dataOcultarConDisplay,
      dataOcultarConHidden: this.opcionesValidacion.dataOcultarConHidden,
      dataOcultarConClass: this.opcionesValidacion.dataOcultarConClass
    });
    return this;
  }
}
_Validador_instances = new WeakSet();
configuracion_fn = function(formulario, tipoSalida, opcionesValidacion) {
  this.formulario = formulario;
  this.tipoSalida = __privateMethod(this, _Validador_instances, definirTipoSalida_fn).call(this, tipoSalida);
  this.opcionesValidacion = {
    reactivo: opcionesValidacion.reactivo !== false,
    asteriscos: opcionesValidacion.asteriscos || "asterisco-requerido",
    cssInputError: opcionesValidacion.cssInputError || "input-error",
    cssInputExito: opcionesValidacion.cssInputExito || "input-exito",
    contenedorMsg: opcionesValidacion.contenedorMsg,
    cssMensajeError: opcionesValidacion.cssMensajeError || "msg-error",
    cssMensajeExito: opcionesValidacion.cssMensajeExito || "msg-exito",
    dataError: opcionesValidacion.dataError || "data-invocando-error",
    dataPadre: opcionesValidacion.dataPadre || "data-invocando-padre",
    dataHijo: opcionesValidacion.dataHijo || "data-invocando-hijo",
    dataOcultarConDisplay: Array.isArray(opcionesValidacion.dataOcultarConDisplay) ? opcionesValidacion.dataOcultarConDisplay : ["data-invocando-ocultarConDisplay", true],
    dataOcultarConHidden: Array.isArray(opcionesValidacion.dataOcultarConHidden) ? opcionesValidacion.dataOcultarConHidden : ["data-invocando-ocultarConHidden", true],
    dataOcultarConClass: Array.isArray(opcionesValidacion.dataOcultarConClass) ? opcionesValidacion.dataOcultarConClass : ["data-invocando-ocultarConClass", "invocando-ocultar"],
    limpiarPresionandoCheckboxs: opcionesValidacion.limpiarPresionandoCheckboxs !== false,
    limpiarRadiosConValor: opcionesValidacion.limpiarRadiosConValor !== false,
    cssInputNeutro: opcionesValidacion.cssInputNeutro || [],
    autoIniciar: opcionesValidacion.autoIniciar !== false,
    protegerSalida: opcionesValidacion.protegerSalida !== false
  };
  __privateMethod(this, _Validador_instances, ejecutarOpcionesAdicionales_fn).call(this, this.opcionesValidacion);
};
ejecutarOpcionesAdicionales_fn = function(opcionesValidacion) {
  if (opcionesValidacion.autoIniciar) iniciarValores(this.formulario);
  if (opcionesValidacion.protegerSalida) saliendoSinGuardar(this.formulario);
  if (opcionesValidacion.asteriscos !== "") {
    __privateMethod(this, _Validador_instances, inyectarEstiloAsterisco_fn).call(this, opcionesValidacion.asteriscos);
    __privateMethod(this, _Validador_instances, colocarAsteriscos_fn).call(this, opcionesValidacion.asteriscos);
  }
};
definirTipoSalida_fn = function(tipo) {
  switch (tipo) {
    case "arreglo":
    case "array":
    case "html":
    case "inputs":
    case "input":
    case "consola":
    case "console":
    case "alerta":
    case "alert":
    case "corto-circuito":
      return tipo;
    default:
      throw new Error("Se pasó un tipo de salida no definido.");
  }
};
validarInput_fn = function(name, reglas, elementos, {
  modo = "otros",
  claseError = this.opcionesValidacion.cssMensajeError
} = {}) {
  this.errores = this.errores.filter((e) => e.name !== name);
  const valor2 = elementos[0];
  let erroresDeCampo = [];
  for (const [fn, mensaje] of reglas) {
    if (!fn(valor2)) {
      erroresDeCampo.push(mensaje);
      if (modo === "corto-circuito") break;
    }
  }
  if (erroresDeCampo.length > 0) {
    elementos.forEach((el) => {
      el.classList.add(this.opcionesValidacion.cssInputError);
      el.classList.remove(this.opcionesValidacion.cssInputExito);
    });
    const mensajeFinal = ["input", "inputs", "html"].includes(modo) ? erroresDeCampo.map((msg) => `<div>${msg}</div>`).join("") : erroresDeCampo[0];
    __privateMethod(this, _Validador_instances, actualizarInputEstado_fn).call(this, name, {
      mensaje: mensajeFinal,
      esError: true,
      claseError
    });
    this.errores.push({
      name,
      mensaje: mensajeFinal
    });
    return false;
  }
  elementos.forEach((el) => {
    el.classList.remove(this.opcionesValidacion.cssInputError);
    el.classList.add(this.opcionesValidacion.cssInputExito);
  });
  __privateMethod(this, _Validador_instances, actualizarInputEstado_fn).call(this, name);
  return true;
};
actualizarInputEstado_fn = function(name, {
  mensaje = "",
  esError = false,
  claseError = "div-error"
} = {}) {
  const inputs = document.querySelector(`[name="${name}"]`);
  if (!inputs) return;
  const grupo = document.querySelectorAll(`[name="${name}"]`);
  let evitarValidar = false;
  let opcionSeleccionada = __privateMethod(this, _Validador_instances, obtenerOpcionSeleccionada_fn).call(this, inputs, grupo);
  let inputVinculo = __privateMethod(this, _Validador_instances, obtenerInputVinculado_fn).call(this, opcionSeleccionada);
  if (!opcionSeleccionada) {
    __privateMethod(this, _Validador_instances, renderizarClasesValidadoras_fn).call(this, inputs, grupo, esError);
    evitarValidar = __privateMethod(this, _Validador_instances, evitarValidarInputDePadreNoSeleccionado_fn).call(this, inputs);
  } else {
    if (!inputVinculo) {
      __privateMethod(this, _Validador_instances, renderizarClasesValidadoras_fn).call(this, inputs, grupo, esError);
      __privateMethod(this, _Validador_instances, renderizarClasesValidadorasParaSobrinos_fn).call(this, grupo, esError);
    } else if (inputVinculo instanceof HTMLElement && "classList" in inputVinculo) {
      __privateMethod(this, _Validador_instances, renderizarClasesValidadoras_fn).call(this, inputVinculo, [], esError);
    }
  }
  if (!evitarValidar) __privateMethod(this, _Validador_instances, visualizarONoError_fn).call(this, inputs, esError, claseError, mensaje);
};
renderizarClasesValidadorasParaSobrinos_fn = function(grupo, esError) {
  if (grupo.length > 1) {
    let inputsSobrinos = __privateMethod(this, _Validador_instances, obtenerInputSobrinos_fn).call(this, grupo);
    if (inputsSobrinos.length > 0) {
      inputsSobrinos.forEach((inputSobrino) => {
        __privateMethod(this, _Validador_instances, renderizarClasesValidadoras_fn).call(this, inputSobrino, [], esError, true);
      });
    }
  }
};
obtenerInputSobrinos_fn = function(grupo) {
  let sobrinos = [];
  grupo.forEach((hermano) => {
    const idHijo = hermano.getAttribute(this.opcionesValidacion.dataHijo);
    if (idHijo) {
      const idsHijos = idHijo.split(",").map((id) => id.trim());
      idsHijos.forEach((id) => {
        const el = document.querySelector(`#${id}`);
        if (el) sobrinos.push(el);
      });
    }
  });
  return sobrinos;
};
evitarValidarInputDePadreNoSeleccionado_fn = function(inputs) {
  let padre = inputs.getAttribute(this.opcionesValidacion.dataPadre);
  if (padre !== null && !getElementoPorId(padre).checked) return true;
  else return false;
};
renderizarClasesValidadoras_fn = function(inputs, grupo, esError, saltarRenderizado = false) {
  inputs.classList.remove(this.opcionesValidacion.cssInputError, this.opcionesValidacion.cssInputExito);
  __privateMethod(this, _Validador_instances, visualizarONoError_fn).call(this, inputs, false, this.opcionesValidacion.cssMensajeExito, "");
  if (saltarRenderizado === false && grupo.length > 0) {
    if (!inputs.disabled && !inputs.readOnly) inputs.classList.add(esError ? this.opcionesValidacion.cssInputError : this.opcionesValidacion.cssInputExito);
  } else {
    grupo.forEach((el) => {
      el.classList.remove(this.opcionesValidacion.cssInputError, this.opcionesValidacion.cssInputExito);
    });
  }
};
obtenerOpcionSeleccionada_fn = function(inputs, grupo) {
  let opcionSeleccionada = null;
  if (inputs.type === "radio" || inputs.type === "checkbox" || inputs.type === "select-one" || inputs.type === "select-multiple") {
    grupo.forEach((el) => {
      if (el.checked) opcionSeleccionada = el;
    });
  }
  return opcionSeleccionada;
};
obtenerInputVinculado_fn = function(opcionSeleccionada) {
  if (!opcionSeleccionada) return false;
  const id = opcionSeleccionada.getAttribute(this.opcionesValidacion.dataHijo);
  if (id) {
    const idsHijos = id.split(",").map((id2) => id2.trim());
    if (idsHijos.length > 1) {
      return idsHijos.map((id2) => getElementoPorId(id2)).filter((el) => el !== null && "classList" in el);
    } else {
      return getElementoPorId(idsHijos[0]);
    }
  }
  return false;
};
visualizarONoError_fn = function(inputs, esError, claseError, mensaje) {
  let contenedorError = document.getElementById(inputs.getAttribute(this.opcionesValidacion.dataError));
  if (contenedorError) {
    if (esError) {
      contenedorError.className = claseError;
      contenedorError.innerHTML = mensaje;
      contenedorError.style.display = "block";
    } else {
      contenedorError.className = this.opcionesValidacion.cssMensajeExito;
      contenedorError.innerHTML = "";
      contenedorError.style.display = "none";
    }
  }
};
colocarAsteriscos_fn = function(claseRequired) {
  document.querySelectorAll(claseRequired).forEach((el) => {
    if (!el.querySelector(`.${claseRequired}`)) {
      const span = document.createElement("span");
      span.className = claseRequired;
      el.appendChild(span);
    }
  });
  return this;
};
inyectarEstiloAsterisco_fn = function(claseRequired) {
  const existeRegla = Array.from(document.styleSheets).some((sheet) => {
    try {
      return Array.from(sheet.cssRules || []).some((rule) => {
        return rule.selectorText === `.${claseRequired}::after` && rule.style.content !== "";
      });
    } catch (e) {
      return false;
    }
  });
  if (!existeRegla && !document.getElementById("estilo-asterisco-validador")) {
    const style = document.createElement("style");
    style.id = "estilo-asterisco-validador";
    style.textContent = `
                .${claseRequired}::after {
                    content: "*";
                    color: red;
                    margin-left: 2px;
                }
            `;
    document.head.appendChild(style);
  }
};
export {
  Formulario,
  Funciones,
  Input,
  UI,
  Utilidades,
  Validador
};
