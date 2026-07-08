import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  availableLanguages,
  defaultRecipe,
  encodeRecipe,
  fontPresets,
  normalizeRecipe,
  pageTemplates,
  palettePresets,
  sectionLabels,
  slugify,
  themes,
  type CustomFont,
  type PageConfig,
  type RecipeV2,
  type SectionCategory,
  type ThemeId,
} from "../../data/recipeSchema";
import {
  applyThemeDefaults,
  defaultVariantFor,
  groupedVariantsFor,
  variantById,
} from "../../data/componentRegistry";
import { buildLovablePrompt } from "../../utils/lovablePrompt";

const STORAGE_KEY = "astro-lego:v2:current";
const SAVED_PREFIX = "astro-lego:v2:saved:";

const wizardSteps = [
  { id: "negocio", label: "Negocio", hint: "Datos del cliente y la marca" },
  { id: "paginas", label: "Páginas", hint: "Qué páginas tendrá la web" },
  { id: "estilo", label: "Estilo", hint: "Tema visual de toda la web" },
  { id: "paleta", label: "Paleta", hint: "Colores en vivo" },
  { id: "tipografia", label: "Tipografía", hint: "Fuentes de titulares y texto" },
  { id: "secciones", label: "Secciones", hint: "Variantes de cada bloque" },
  { id: "contenido", label: "Contenido", hint: "Textos, servicios y SEO" },
  { id: "extras", label: "Extras", hint: "Formularios, analytics y más" },
  { id: "deploy", label: "Deploy", hint: "GitHub, Dokploy y dominio" },
  { id: "montar", label: "Montar web", hint: "Genera el proyecto completo" },
] as const;

type StepId = (typeof wizardSteps)[number]["id"];

type BuildLogLine = { time: string; level: "info" | "ok" | "error"; message: string };
type BuildState = {
  jobId: string | null;
  status: "idle" | "running" | "done" | "error";
  lines: BuildLogLine[];
  outputDir?: string;
};

function loadInitialRecipe(): RecipeV2 {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === 2) return applyThemeDefaults(normalizeRecipe(parsed));
      }
    } catch {
      /* receta corrupta: empezamos de cero */
    }
  }
  return applyThemeDefaults(structuredClone(defaultRecipe));
}

export default function SiteBuilder() {
  const [recipe, setRecipe] = useState<RecipeV2>(loadInitialRecipe);
  const [stepIndex, setStepIndex] = useState(0);
  const [previewPage, setPreviewPage] = useState<string>("home");
  const [previewSrc, setPreviewSrc] = useState("");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [copied, setCopied] = useState("");
  const [fontRole, setFontRole] = useState<CustomFont["role"]>("both");
  const [fontStatus, setFontStatus] = useState("");
  const [build, setBuild] = useState<BuildState>({ jobId: null, status: "idle", lines: [] });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = wizardSteps[stepIndex];

  // Persistencia + refresco (debounced) del preview
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
      } catch { /* localStorage lleno: ignoramos */ }
      const pageId = recipe.pages.some((p) => p.id === previewPage) ? previewPage : recipe.pages[0]?.id ?? "home";
      setPreviewSrc(`/preview?recipe=${encodeRecipe(recipe)}&page=${pageId}`);
    }, 450);
    return () => clearTimeout(timer);
  }, [recipe, previewPage]);

  useEffect(() => {
    refreshSavedNames();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  function refreshSavedNames() {
    const names: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(SAVED_PREFIX)) names.push(key.slice(SAVED_PREFIX.length));
    }
    setSavedNames(names.sort());
  }

  const update = (patch: Partial<RecipeV2>) => setRecipe((current) => ({ ...current, ...patch }));
  const updateBusiness = (patch: Partial<RecipeV2["business"]>) =>
    setRecipe((c) => ({ ...c, business: { ...c.business, ...patch } }));
  const updateContent = (patch: Partial<RecipeV2["content"]>) =>
    setRecipe((c) => ({ ...c, content: { ...c.content, ...patch } }));
  const updateSeo = (patch: Partial<RecipeV2["seo"]>) => setRecipe((c) => ({ ...c, seo: { ...c.seo, ...patch } }));
  const updateIntegrations = (patch: Partial<RecipeV2["integrations"]>) =>
    setRecipe((c) => ({ ...c, integrations: { ...c.integrations, ...patch } }));
  const updateDeployment = (patch: Partial<RecipeV2["deployment"]>) =>
    setRecipe((c) => ({ ...c, deployment: { ...c.deployment, ...patch } }));

  function changeTheme(theme: ThemeId) {
    setRecipe((current) =>
      applyThemeDefaults({
        ...current,
        design: { ...current.design, theme },
        pages: current.pages.map((page) => ({
          ...page,
          sections: page.sections.map((section) => ({ ...section, variant: "" })),
        })),
      }),
    );
  }

  function togglePage(templateId: string) {
    setRecipe((current) => {
      const exists = current.pages.some((page) => page.id === templateId);
      if (exists) {
        return { ...current, pages: current.pages.filter((page) => page.id !== templateId) };
      }
      const template = pageTemplates.find((t) => t.id === templateId);
      if (!template) return current;
      const newPage: PageConfig = {
        id: template.id,
        title: template.title,
        path: template.path,
        sections: template.defaultSections.map((category) => ({
          category,
          variant: defaultVariantFor(category, current.design.theme)?.id ?? "",
        })),
      };
      const order = pageTemplates.map((t) => t.id);
      const pages = [...current.pages, newPage].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      return { ...current, pages };
    });
  }

  function updatePageSections(pageId: string, mutate: (sections: PageConfig["sections"]) => PageConfig["sections"]) {
    setRecipe((current) => ({
      ...current,
      pages: current.pages.map((page) => (page.id === pageId ? { ...page, sections: mutate(page.sections) } : page)),
    }));
  }

  async function copyToClipboard(text: string, tag: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(""), 2200);
    } catch {
      window.prompt("Copia manualmente:", text);
    }
  }

  const recipeJson = useMemo(() => JSON.stringify(recipe, null, 2), [recipe]);
  const validation = useMemo(() => validateRecipe(recipe), [recipe]);
  const outputPreview = useMemo(() => {
    const root = recipe.project.outputRoot.trim();
    const isAbsolute = /^([a-zA-Z]:[\\/]|\\\\|\/)/.test(root);
    const base = !root ? "Escritorio\\webs-generadas" : isAbsolute ? root : `Escritorio\\${root}`;
    return `${base}\\${slugify(recipe.project.name) || "proyecto"}`;
  }, [recipe.project.outputRoot, recipe.project.name]);

  async function startBuild() {
    if (validation.errors.length > 0) return;
    setBuild({ jobId: null, status: "running", lines: [{ time: "", level: "info", message: "Enviando receta al generador…" }] });
    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: recipeJson,
      });
      if (!response.ok) throw new Error(await response.text());
      const { jobId } = await response.json();
      setBuild((b) => ({ ...b, jobId }));
      pollRef.current = setInterval(async () => {
        const res = await fetch(`/api/build?job=${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        setBuild({ jobId, status: data.status, lines: data.lines, outputDir: data.outputDir });
        if (data.status === "done" || data.status === "error") {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 1200);
    } catch (error: any) {
      setBuild({
        jobId: null,
        status: "error",
        lines: [{ time: "", level: "error", message: `No se pudo iniciar el build: ${error?.message ?? error}` }],
      });
    }
  }

  return (
    <div className="builder-workbench">
      <div className="step-rail" aria-label="Pasos del builder">
        {wizardSteps.map((s, index) => (
          <button
            key={s.id}
            type="button"
            className={index === stepIndex ? "step-pill is-active" : index < stepIndex ? "step-pill is-done" : "step-pill"}
            onClick={() => setStepIndex(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{s.label}</strong>
            <small>{s.hint}</small>
          </button>
        ))}
      </div>

      <div className="builder-grid">
        <div className="builder-panel">
          <div className="step-header">
            <span>Paso {stepIndex + 1} de {wizardSteps.length}</span>
            <h2>{step.label}</h2>
            <p>{step.hint}</p>
          </div>

          {step.id === "negocio" && (
            <>
              <div className="admin-strip">
                <button type="button" onClick={() => {
                  const name = slugify(recipe.project.name) || "receta";
                  window.localStorage.setItem(SAVED_PREFIX + name, recipeJson);
                  refreshSavedNames();
                }}>Guardar receta</button>
                <select value="" onChange={(e) => {
                  const raw = window.localStorage.getItem(SAVED_PREFIX + e.target.value);
                  if (raw) setRecipe(applyThemeDefaults(normalizeRecipe(JSON.parse(raw))));
                }}>
                  <option value="">Cargar receta guardada…</option>
                  {savedNames.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
                <button type="button" className="ghost" onClick={() => setRecipe(applyThemeDefaults(structuredClone(defaultRecipe)))}>Empezar de cero</button>
              </div>
              <div className="field-grid">
                <Field label="Nombre del proyecto (carpeta)" value={recipe.project.name} onChange={(name) => update({ project: { ...recipe.project, name } })} placeholder="peluqueria-ana" />
                <Field label="Marca visible" value={recipe.business.brandName} onChange={(brandName) => updateBusiness({ brandName })} />
                <Field label="Sector" value={recipe.business.sector} onChange={(sector) => updateBusiness({ sector })} placeholder="Peluquería, clínica, restaurante…" />
                <Field label="Ciudad" value={recipe.business.city} onChange={(city) => updateBusiness({ city })} />
                <Field label="Teléfono" value={recipe.business.phone} onChange={(phone) => updateBusiness({ phone })} />
                <Field label="Email" value={recipe.business.email} onChange={(email) => updateBusiness({ email })} />
                <Field label="Dirección" value={recipe.business.address} onChange={(address) => updateBusiness({ address })} />
                <Field label="Horario" value={recipe.business.schedule} onChange={(schedule) => updateBusiness({ schedule })} />
              </div>
              <label className="area-field">
                <span>Descripción del negocio (alimenta SEO y textos)</span>
                <textarea value={recipe.business.description} onChange={(e) => updateBusiness({ description: e.target.value })} rows={3} />
              </label>
              <h3 className="group-title">Idiomas de la web</h3>
              <div className="field-grid">
                <label className="select-field"><span>Idioma principal</span>
                  <select value={recipe.project.language} onChange={(e) => update({
                    project: { ...recipe.project, language: e.target.value, extraLanguages: recipe.project.extraLanguages.filter((l) => l !== e.target.value) },
                  })}>
                    {availableLanguages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
                  </select>
                </label>
              </div>
              <div className="pill-row">
                {availableLanguages.filter((lang) => lang.code !== recipe.project.language).map((lang) => {
                  const active = recipe.project.extraLanguages.includes(lang.code);
                  return (
                    <button key={lang.code} type="button" className={active ? "pill is-active" : "pill"}
                      onClick={() => update({
                        project: {
                          ...recipe.project,
                          extraLanguages: active
                            ? recipe.project.extraLanguages.filter((l) => l !== lang.code)
                            : [...recipe.project.extraLanguages, lang.code],
                        },
                      })}>
                      {active ? "✓ " : "+ "}{lang.label}
                    </button>
                  );
                })}
              </div>
              {recipe.project.extraLanguages.length > 0 && (
                <p className="hint-text">Se generarán rutas /{recipe.project.extraLanguages.join("/, /")}/ con hreflang y selector de idioma. Los textos salen en el idioma principal: tradúcelos al personalizar.</p>
              )}
              <h3 className="group-title">Redes sociales (deja vacío lo que no aplique)</h3>
              <div className="field-grid">
                {(Object.keys(recipe.business.socials) as Array<keyof RecipeV2["business"]["socials"]>).map((network) => (
                  <Field key={network} label={network} value={recipe.business.socials[network]}
                    onChange={(value) => updateBusiness({ socials: { ...recipe.business.socials, [network]: value } })}
                    placeholder={network === "whatsapp" ? "+34600000000" : `https://…`} />
                ))}
              </div>
            </>
          )}

          {step.id === "paginas" && (
            <>
              {["Esenciales", "Contenido", "Sectores", "Legal"].map((group) => (
                <div key={group}>
                  <h3 className="group-title">{group}</h3>
                  <div className="choice-list">
                    {pageTemplates.filter((template) => template.group === group).map((template) => {
                      const active = recipe.pages.some((page) => page.id === template.id);
                      return (
                        <button key={template.id} type="button" className={active ? "choice-card is-active" : "choice-card"} onClick={() => togglePage(template.id)}>
                          <strong>{template.title} <em>{template.path}</em></strong>
                          <small>{template.defaultSections.map((c) => sectionLabels[c]).join(" · ")}</small>
                          <span className="pick">{active ? "Incluida ✓" : "Añadir"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="hint-text">Consejo: las tres páginas legales son obligatorias en España si recoges datos (formularios) o usas cookies.</p>
            </>
          )}

          {step.id === "estilo" && (
            <div className="choice-list">
              {themes.map((theme) => (
                <button key={theme.id} type="button" className={recipe.design.theme === theme.id ? "choice-card is-active" : "choice-card"} onClick={() => changeTheme(theme.id)}>
                  <strong>{theme.label}</strong>
                  <small>{theme.description}</small>
                  <span className="tagline">{theme.vibe}</span>
                </button>
              ))}
            </div>
          )}

          {step.id === "paleta" && (
            <>
              <div className="palette-grid">
                {palettePresets.map((palette) => (
                  <button key={palette.id} type="button"
                    className={recipe.design.palette.id === palette.id ? "palette-card is-active" : "palette-card"}
                    onClick={() => update({ design: { ...recipe.design, palette } })}>
                    <span className="swatches">
                      {[palette.primary, palette.secondary, palette.accent, palette.background].map((color) => (
                        <i key={color} style={{ background: color }} />
                      ))}
                    </span>
                    <strong>{palette.label}</strong>
                  </button>
                ))}
              </div>
              <h3 className="group-title">Ajuste fino (crea una paleta custom)</h3>
              <div className="color-grid">
                {([["primary", "Primario"], ["secondary", "Secundario"], ["accent", "Acento"], ["background", "Fondo claro"], ["backgroundDark", "Fondo oscuro"], ["text", "Texto"]] as const).map(([key, label]) => (
                  <label key={key} className="color-field">
                    <span>{label}</span>
                    <input type="color" value={recipe.design.palette[key]}
                      onChange={(e) => update({ design: { ...recipe.design, palette: { ...recipe.design.palette, [key]: e.target.value, id: "custom", label: "Custom" } } })} />
                    <code>{recipe.design.palette[key]}</code>
                  </label>
                ))}
              </div>
              <label className="toggle-field">
                <input type="checkbox" checked={recipe.design.darkMode} onChange={(e) => update({ design: { ...recipe.design, darkMode: e.target.checked } })} />
                <span>Activar modo oscuro en la web generada</span>
              </label>
            </>
          )}

          {step.id === "tipografia" && (
            <>
              <div className="choice-list">
                {fontPresets.map((pair) => (
                  <button key={pair.id} type="button" className={recipe.design.typography.id === pair.id ? "choice-card is-active" : "choice-card"} onClick={() => update({ design: { ...recipe.design, typography: pair } })}>
                    <strong style={{ fontFamily: pair.headingStack }}>{pair.heading}</strong>
                    <small style={{ fontFamily: pair.bodyStack }}>Cuerpo: {pair.body} — Diseño profesional listo para vender.</small>
                    <span className="tagline">{pair.label}</span>
                  </button>
                ))}
              </div>

              <h3 className="group-title">Fuente propia (ttf, otf, woff, woff2)</h3>
              <p className="hint-text">Sube una fuente descargada de internet y elige dónde usarla. Sustituye a la elegida arriba en ese rol. Asegúrate de tener licencia para uso web.</p>
              <div className="admin-strip">
                <select value={fontRole} onChange={(e) => setFontRole(e.target.value as CustomFont["role"])}>
                  <option value="both">Usar en titulares y cuerpo</option>
                  <option value="heading">Solo titulares</option>
                  <option value="body">Solo cuerpo de texto</option>
                </select>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFontStatus("Subiendo…");
                    try {
                      const buffer = await file.arrayBuffer();
                      let binary = "";
                      new Uint8Array(buffer).forEach((b) => (binary += String.fromCharCode(b)));
                      const response = await fetch("/api/upload-font", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ filename: file.name, data: btoa(binary) }),
                      });
                      if (!response.ok) throw new Error(await response.text());
                      const uploaded = await response.json();
                      const font: CustomFont = { family: uploaded.family, file: uploaded.file, format: uploaded.format, role: fontRole };
                      update({
                        design: {
                          ...recipe.design,
                          customFonts: [
                            ...recipe.design.customFonts.filter((f) => !(f.role === fontRole || fontRole === "both" || f.role === "both")),
                            font,
                          ],
                        },
                      });
                      setFontStatus(`✓ ${uploaded.family} lista`);
                    } catch (error: any) {
                      setFontStatus(`Error: ${error?.message ?? error}`);
                    }
                    e.target.value = "";
                  }}
                />
              </div>
              {fontStatus && <p className="hint-text">{fontStatus}</p>}
              {recipe.design.customFonts.length > 0 && (
                <div className="choice-list">
                  {recipe.design.customFonts.map((font) => (
                    <div key={font.file} className="choice-card is-active">
                      <strong>{font.family}</strong>
                      <small>{font.file} · {font.role === "both" ? "titulares y cuerpo" : font.role === "heading" ? "titulares" : "cuerpo"}</small>
                      <button type="button" className="ghost" onClick={() => update({ design: { ...recipe.design, customFonts: recipe.design.customFonts.filter((f) => f.file !== font.file) } })}>Quitar</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step.id === "secciones" && (
            <>
              <div className="page-tabs">
                {recipe.pages.map((page) => (
                  <button key={page.id} type="button" className={previewPage === page.id ? "page-tab is-active" : "page-tab"} onClick={() => setPreviewPage(page.id)}>
                    {page.title}
                  </button>
                ))}
              </div>
              {recipe.pages.filter((page) => page.id === (recipe.pages.some((p) => p.id === previewPage) ? previewPage : recipe.pages[0]?.id)).map((page) => (
                <div key={page.id} className="section-editor">
                  {page.sections.map((section, index) => {
                    const { recommended, others } = groupedVariantsFor(section.category, recipe.design.theme);
                    const known = [...recommended, ...others];
                    const extra = variantById(section.variant) && !known.some((o) => o.id === section.variant) ? [variantById(section.variant)!] : [];
                    return (
                      <div key={`${section.category}-${index}`} className="section-row">
                        <div className="section-row-head">
                          <strong>{sectionLabels[section.category]}</strong>
                          <span className="row-actions">
                            <button type="button" title="Subir" disabled={index === 0} onClick={() => updatePageSections(page.id, (sections) => move(sections, index, index - 1))}>↑</button>
                            <button type="button" title="Bajar" disabled={index === page.sections.length - 1} onClick={() => updatePageSections(page.id, (sections) => move(sections, index, index + 1))}>↓</button>
                            <button type="button" title="Quitar" onClick={() => updatePageSections(page.id, (sections) => sections.filter((_, i) => i !== index))}>✕</button>
                          </span>
                        </div>
                        <select value={section.variant} onChange={(e) => updatePageSections(page.id, (sections) => sections.map((s, i) => (i === index ? { ...s, variant: e.target.value } : s)))}>
                          {extra.map((option) => (
                            <option key={option.id} value={option.id}>{option.label} — {option.description}</option>
                          ))}
                          <optgroup label={`Recomendadas (${themes.find((t) => t.id === recipe.design.theme)?.label})`}>
                            {recommended.map((option) => (
                              <option key={option.id} value={option.id}>{option.label} — {option.description}</option>
                            ))}
                          </optgroup>
                          {others.length > 0 && (
                            <optgroup label="Otros estilos (mezclar con criterio)">
                              {others.map((option) => (
                                <option key={option.id} value={option.id}>[{option.theme}] {option.label} — {option.description}</option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    );
                  })}
                  <div className="add-section">
                    <select value="" onChange={(e) => {
                      const category = e.target.value as SectionCategory;
                      if (!category) return;
                      updatePageSections(page.id, (sections) => [
                        ...sections.slice(0, -1),
                        { category, variant: defaultVariantFor(category, recipe.design.theme)?.id ?? "" },
                        ...sections.slice(-1),
                      ]);
                    }}>
                      <option value="">+ Añadir sección…</option>
                      {(Object.keys(sectionLabels) as SectionCategory[]).map((category) => (
                        <option key={category} value={category}>{sectionLabels[category]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </>
          )}

          {step.id === "contenido" && (
            <>
              <div className="field-grid">
                <Field label="Titular principal (hero)" value={recipe.content.headline} onChange={(headline) => updateContent({ headline })} />
                <Field label="Subtitular" value={recipe.content.subheadline} onChange={(subheadline) => updateContent({ subheadline })} />
                <Field label="CTA primario" value={recipe.content.primaryCta} onChange={(primaryCta) => updateContent({ primaryCta })} />
                <Field label="CTA secundario" value={recipe.content.secondaryCta} onChange={(secondaryCta) => updateContent({ secondaryCta })} />
              </div>
              <h3 className="group-title">Servicios / puntos fuertes</h3>
              {recipe.content.services.map((service, index) => (
                <div key={index} className="service-row">
                  <input value={service.title} placeholder="Título" onChange={(e) => updateContent({ services: recipe.content.services.map((s, i) => (i === index ? { ...s, title: e.target.value } : s)) })} />
                  <input value={service.description} placeholder="Descripción" onChange={(e) => updateContent({ services: recipe.content.services.map((s, i) => (i === index ? { ...s, description: e.target.value } : s)) })} />
                  <button type="button" onClick={() => updateContent({ services: recipe.content.services.filter((_, i) => i !== index) })}>✕</button>
                </div>
              ))}
              <button type="button" className="ghost" onClick={() => updateContent({ services: [...recipe.content.services, { title: "", description: "" }] })}>+ Añadir servicio</button>
              <h3 className="group-title">SEO</h3>
              <div className="field-grid">
                <Field label="Title del sitio" value={recipe.seo.siteTitle} onChange={(siteTitle) => updateSeo({ siteTitle })} />
                <Field label="Keywords (opcional)" value={recipe.seo.keywords} onChange={(keywords) => updateSeo({ keywords })} />
              </div>
              <label className="area-field">
                <span>Meta description (150-160 caracteres)</span>
                <textarea value={recipe.seo.description} onChange={(e) => updateSeo({ description: e.target.value })} rows={2} />
              </label>
            </>
          )}

          {step.id === "extras" && (
            <>
              <h3 className="group-title">Formulario de contacto</h3>
              <div className="pill-row">
                <button type="button" className={recipe.integrations.forms === "none" ? "pill is-active" : "pill"} onClick={() => updateIntegrations({ forms: "none" })}>Sin backend</button>
                <button type="button" className={recipe.integrations.forms === "formspree" ? "pill is-active" : "pill"} onClick={() => updateIntegrations({ forms: "formspree" })}>Formspree</button>
              </div>
              {recipe.integrations.forms === "formspree" && (
                <Field label="Formspree ID" value={recipe.integrations.formspreeId} onChange={(formspreeId) => updateIntegrations({ formspreeId })} placeholder="xzdjovge" />
              )}
              <h3 className="group-title">Analytics</h3>
              <div className="pill-row">
                {(["none", "plausible", "ga4"] as const).map((option) => (
                  <button key={option} type="button" className={recipe.integrations.analytics === option ? "pill is-active" : "pill"} onClick={() => updateIntegrations({ analytics: option })}>
                    {option === "none" ? "Ninguno" : option === "plausible" ? "Plausible" : "Google Analytics 4"}
                  </button>
                ))}
              </div>
              {recipe.integrations.analytics !== "none" && (
                <Field label={recipe.integrations.analytics === "ga4" ? "Measurement ID (G-XXXX)" : "Dominio en Plausible"} value={recipe.integrations.analyticsId} onChange={(analyticsId) => updateIntegrations({ analyticsId })} />
              )}
              <label className="toggle-field">
                <input type="checkbox" checked={recipe.integrations.cookieBanner} onChange={(e) => updateIntegrations({ cookieBanner: e.target.checked })} />
                <span>Banner de cookies</span>
              </label>
              <label className="toggle-field">
                <input type="checkbox" checked={recipe.integrations.sitemap} onChange={(e) => updateIntegrations({ sitemap: e.target.checked })} />
                <span>Sitemap + robots.txt</span>
              </label>

              <h3 className="group-title">Widgets</h3>
              <p className="hint-text">Deja vacío lo que no uses. El chat y el botón de reservas se inyectan en todas las páginas; el mapa aparece en las secciones "Mapa / Ubicación".</p>
              <div className="field-grid">
                <Field label="Crisp chat — Website ID" value={recipe.integrations.widgets.crispId} onChange={(crispId) => updateIntegrations({ widgets: { ...recipe.integrations.widgets, crispId } })} placeholder="xxxxxxxx-xxxx-…" />
                <Field label="Tawk.to — Property ID" value={recipe.integrations.widgets.tawktoId} onChange={(tawktoId) => updateIntegrations({ widgets: { ...recipe.integrations.widgets, tawktoId } })} placeholder="abc123/default" />
                <Field label="Reservas (URL Calendly / Cal.com)" value={recipe.integrations.widgets.bookingUrl} onChange={(bookingUrl) => updateIntegrations({ widgets: { ...recipe.integrations.widgets, bookingUrl } })} placeholder="https://cal.com/tu-negocio" />
                <Field label="Google Maps — URL de embed" value={recipe.integrations.widgets.gmapsEmbed} onChange={(gmapsEmbed) => updateIntegrations({ widgets: { ...recipe.integrations.widgets, gmapsEmbed } })} placeholder="https://www.google.com/maps/embed?pb=…" />
              </div>
              <label className="area-field">
                <span>Script personalizado (se inyecta antes de &lt;/body&gt; — úsalo solo con código de confianza)</span>
                <textarea value={recipe.integrations.widgets.customScript} onChange={(e) => updateIntegrations({ widgets: { ...recipe.integrations.widgets, customScript: e.target.value } })} rows={3} placeholder="<script>…</script>" />
              </label>
            </>
          )}

          {step.id === "deploy" && (
            <>
              <div className="field-grid">
                <Field label="Dominio final" value={recipe.deployment.domain} onChange={(domain) => updateDeployment({ domain })} placeholder="cliente.com" />
                <Field label="Carpeta de salida — vacío = Escritorio\webs-generadas; un nombre suelto se crea en el Escritorio" value={recipe.project.outputRoot} onChange={(outputRoot) => update({ project: { ...recipe.project, outputRoot } })} placeholder="C:\\Users\\...\\mis-webs o mis-webs" />
              </div>
              <label className="toggle-field">
                <input type="checkbox" checked={recipe.deployment.installDeps} onChange={(e) => updateDeployment({ installDeps: e.target.checked })} />
                <span>Ejecutar npm install automáticamente</span>
              </label>
              <label className="toggle-field">
                <input type="checkbox" checked={recipe.deployment.createGithub} onChange={(e) => updateDeployment({ createGithub: e.target.checked })} />
                <span>Crear repositorio en GitHub y hacer push (necesita GITHUB_TOKEN o gh CLI)</span>
              </label>
              {recipe.deployment.createGithub && (
                <div className="field-grid">
                  <Field label="Owner (usuario u org)" value={recipe.deployment.github.owner} onChange={(owner) => updateDeployment({ github: { ...recipe.deployment.github, owner } })} />
                  <Field label="Nombre del repo" value={recipe.deployment.github.repo} onChange={(repo) => updateDeployment({ github: { ...recipe.deployment.github, repo } })} />
                  <label className="select-field"><span>Visibilidad</span>
                    <select value={recipe.deployment.github.visibility} onChange={(e) => updateDeployment({ github: { ...recipe.deployment.github, visibility: e.target.value as "private" | "public" } })}>
                      <option value="private">Privado</option>
                      <option value="public">Público</option>
                    </select>
                  </label>
                  <Field label="Branch" value={recipe.deployment.github.branch} onChange={(branch) => updateDeployment({ github: { ...recipe.deployment.github, branch } })} />
                </div>
              )}
              <label className="toggle-field">
                <input type="checkbox" checked={recipe.deployment.setupDokploy} onChange={(e) => updateDeployment({ setupDokploy: e.target.checked })} />
                <span>Crear y desplegar la app en Dokploy (necesita DOKPLOY_API_TOKEN)</span>
              </label>
              {recipe.deployment.setupDokploy && (
                <div className="field-grid">
                  <Field label="URL del panel Dokploy" value={recipe.deployment.dokploy.url} onChange={(url) => updateDeployment({ dokploy: { ...recipe.deployment.dokploy, url } })} placeholder="https://dokploy.tudominio.com" />
                  <Field label="Environment ID" value={recipe.deployment.dokploy.environmentId} onChange={(environmentId) => updateDeployment({ dokploy: { ...recipe.deployment.dokploy, environmentId } })} />
                  <Field label="Server ID (si aplica)" value={recipe.deployment.dokploy.serverId} onChange={(serverId) => updateDeployment({ dokploy: { ...recipe.deployment.dokploy, serverId } })} />
                  <Field label="GitHub Provider ID (en Dokploy)" value={recipe.deployment.github.providerId} onChange={(providerId) => updateDeployment({ github: { ...recipe.deployment.github, providerId } })} />
                </div>
              )}
            </>
          )}

          {step.id === "montar" && (
            <>
              {validation.errors.length > 0 && (
                <div className="callout error">
                  <strong>Antes de montar corrige esto:</strong>
                  <ul>{validation.errors.map((error) => <li key={error}>{error}</li>)}</ul>
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div className="callout warning">
                  <ul>{validation.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
                </div>
              )}
              <div className="summary-grid">
                <div><span>Proyecto</span><strong>{recipe.project.name}</strong></div>
                <div><span>Se creará en</span><strong>{outputPreview}</strong></div>
                <div><span>Tema</span><strong>{themes.find((t) => t.id === recipe.design.theme)?.label}</strong></div>
                <div><span>Páginas</span><strong>{recipe.pages.map((page) => page.title).join(", ")}</strong></div>
                <div><span>Tipografía</span><strong>{recipe.design.typography.heading} / {recipe.design.typography.body}</strong></div>
                <div><span>GitHub</span><strong>{recipe.deployment.createGithub ? `${recipe.deployment.github.owner}/${recipe.deployment.github.repo}` : "No"}</strong></div>
                <div><span>Dokploy</span><strong>{recipe.deployment.setupDokploy ? recipe.deployment.domain : "No"}</strong></div>
              </div>
              <div className="action-row">
                <button type="button" className="primary" disabled={validation.errors.length > 0 || build.status === "running"} onClick={startBuild}>
                  {build.status === "running" ? "Montando…" : "🚀 Montar web"}
                </button>
                <button type="button" onClick={() => copyToClipboard(recipeJson, "receta")}>{copied === "receta" ? "¡Copiada!" : "Copiar receta JSON"}</button>
                <button type="button" onClick={() => copyToClipboard(buildLovablePrompt(recipe), "lovable")}>{copied === "lovable" ? "¡Copiado!" : "Copiar prompt Lovable"}</button>
              </div>
              {build.lines.length > 0 && (
                <div className={`build-log ${build.status}`}>
                  {build.lines.map((line, index) => (
                    <div key={index} className={`log-line ${line.level}`}>{line.message}</div>
                  ))}
                  {build.status === "done" && build.outputDir && (
                    <div className="log-line ok"><strong>✅ Proyecto listo en: {build.outputDir}</strong></div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="step-nav">
            <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>← Anterior</button>
            <button type="button" className="primary" disabled={stepIndex === wizardSteps.length - 1} onClick={() => setStepIndex((i) => Math.min(wizardSteps.length - 1, i + 1))}>Siguiente →</button>
          </div>
        </div>

        <div className="preview-pane">
          <div className="preview-toolbar">
            <div className="page-tabs">
              {recipe.pages.map((page) => (
                <button key={page.id} type="button" className={previewPage === page.id ? "page-tab is-active" : "page-tab"} onClick={() => setPreviewPage(page.id)}>
                  {page.title}
                </button>
              ))}
            </div>
            <div className="viewport-toggle">
              <button type="button" className={viewport === "desktop" ? "is-active" : ""} onClick={() => setViewport("desktop")}>🖥️</button>
              <button type="button" className={viewport === "mobile" ? "is-active" : ""} onClick={() => setViewport("mobile")}>📱</button>
              {previewSrc && <a href={previewSrc} target="_blank" rel="noreferrer" title="Abrir en pestaña nueva">↗</a>}
            </div>
          </div>
          <div className={`preview-frame ${viewport}`}>
            {previewSrc ? <iframe src={previewSrc} title="Previsualización de la web" /> : <div className="preview-empty">Cargando preview…</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="text-field">
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function move<T>(items: T[], from: number, to: number): T[] {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function validateRecipe(recipe: RecipeV2): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!slugify(recipe.project.name)) errors.push("El proyecto necesita un nombre válido (paso Negocio).");
  if (!recipe.business.brandName.trim()) errors.push("Falta la marca visible (paso Negocio).");
  if (recipe.pages.length === 0) errors.push("Selecciona al menos una página (paso Páginas).");
  if (recipe.deployment.createGithub && (!recipe.deployment.github.owner || !recipe.deployment.github.repo)) {
    errors.push("Para crear el repo hacen falta owner y nombre (paso Deploy).");
  }
  if (recipe.deployment.setupDokploy) {
    if (!recipe.deployment.dokploy.url) errors.push("Falta la URL del panel Dokploy (paso Deploy).");
    if (!recipe.deployment.dokploy.environmentId) errors.push("Falta el Environment ID de Dokploy (paso Deploy).");
    if (!recipe.deployment.createGithub) warnings.push("Dokploy sin GitHub: el deploy automático por push no quedará conectado.");
    if (!recipe.deployment.domain || recipe.deployment.domain === "example.com") errors.push("Pon el dominio real para Dokploy (paso Deploy).");
  }
  if (recipe.integrations.forms === "formspree" && !recipe.integrations.formspreeId) {
    warnings.push("Formspree sin ID: el formulario quedará sin conectar.");
  }
  return { errors, warnings };
}
