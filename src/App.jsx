import { useMemo, useState } from "react";

const API_URL = "https://postpilot-api-v2.onrender.com";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const analyzePost = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      const res = await fetch(`${API_URL}/posts/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze post");
      }

      const data = await res.json();
      console.log("DATA DEL BACKEND:", data);
      setResult(data);
      setSuccessMessage("Post analizado correctamente 🚀");
    } catch (error) {
      console.error(error);
      alert("Error analyzing post");
    } finally {
      setLoading(false);
    }
  };

  const copyHashtags = async () => {
    if (!hashtags.length) return;

    try {
      const textToCopy = hashtags.map((tag) => tag.text).join(" ");
      await navigator.clipboard.writeText(textToCopy);
      setSuccessMessage("Hashtags copiados al portapapeles 📋");
    } catch (error) {
      console.error(error);
      alert("No se pudieron copiar los hashtags");
    }
  };

  const getNumericScore = (value) => {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
    return null;
  };

  const normalizeArray = (value) => {
    if (!Array.isArray(value)) return [];

    return value.map((item, index) => ({
      id: index,
      text:
        typeof item === "string"
          ? item
          : typeof item === "number"
          ? String(item)
          : item && typeof item === "object"
          ? JSON.stringify(item)
          : String(item),
    }));
  };

  const viralScore = getNumericScore(
    result?.viral_score ?? result?.["puntuación viral"]
  );

  const hookScore = getNumericScore(
    result?.hook_score ?? result?.["puntuación de gancho"]
  );

  const readabilityScore = getNumericScore(
    result?.readability_score ?? result?.["puntuación de legibilidad"]
  );

  const storyScore = getNumericScore(
    result?.story_score ?? result?.["puntuación de la historia"]
  );

  const technologies = normalizeArray(
    result?.technologies ?? result?.tecnologías
  );

  const hashtags = normalizeArray(
    result?.suggested_hashtags ?? result?.["hashtags sugeridos"]
  );

  const tips = normalizeArray(
    result?.improvement_tips ?? result?.consejos_de_mejora
  );

  const rawRole = result?.role_detected ?? result?.["rol detectado"];
  const roleDetected =
    typeof rawRole === "string"
      ? rawRole
      : rawRole
      ? JSON.stringify(rawRole)
      : "Sin detectar";

  const averageScore = useMemo(() => {
    const values = [viralScore, hookScore, readabilityScore, storyScore].filter(
      (value) => value !== null
    );

    if (!values.length) return null;

    return Math.round(
      values.reduce((accumulator, value) => accumulator + value, 0) /
        values.length
    );
  }, [viralScore, hookScore, readabilityScore, storyScore]);

  const getScoreColor = (score) => {
    if (score === null) return "bg-gray-300";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-600";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreTextColor = (score) => {
    if (score === null) return "text-gray-400";
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBadge = (score) => {
    if (score === null) return "Sin dato";
    if (score >= 80) return "Muy bueno";
    if (score >= 60) return "Bueno";
    if (score >= 40) return "Mejorable";
    return "Débil";
  };

  const scoreCard = (title, value) => (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {getScoreBadge(value)}
        </span>
      </div>

      <p className={`mt-4 text-3xl font-bold ${getScoreTextColor(value)}`}>
        {value ?? "-"}
        <span className="text-lg text-slate-400">/100</span>
      </p>

      <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${getScoreColor(
            value
          )}`}
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  PostPilot
                </h1>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Beta
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                AI copilot para optimizar publicaciones de LinkedIn
              </p>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Analiza tu publicación antes de publicarla. Evaluá el hook, la
                legibilidad, la narrativa y recibí sugerencias prácticas para
                mejorar su alcance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estado
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  MVP funcional
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Score general
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {averageScore !== null ? `${averageScore}/100` : "Sin análisis"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
            {successMessage}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Analizador de publicaciones
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pegá tu texto y obtené feedback automático en segundos.
              </p>
            </div>

            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Pega tu post de LinkedIn
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ejemplo: Hoy deployé una API que analiza publicaciones de LinkedIn antes de publicarlas..."
              className="min-h-[360px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={analyzePost}
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="inline-flex items-center gap-2">
                  {loading && <span className="animate-pulse">⏳</span>}
                  <span>
                    {loading
                      ? "Analizando tu post..."
                      : "Optimizar post con IA"}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setText("");
                  setResult(null);
                  setSuccessMessage("");
                }}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Consejo: probá distintos formatos de publicación para comparar los
              resultados.
            </p>
          </section>

          <section className="space-y-6">
            {!result && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  ✍️
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Esperando análisis
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Cuando analices una publicación vas a ver métricas, hashtags
                  sugeridos, tecnologías detectadas y recomendaciones para
                  mejorar el rendimiento del post.
                </p>
              </div>
            )}

            {averageScore !== null && (
              <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Score general del post
                </p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
                    {averageScore}
                    <span className="text-2xl text-slate-400">/100</span>
                  </p>
                  <div className="text-right text-sm text-slate-600">
                    <p>{hashtags.length} hashtags sugeridos</p>
                    <p>{tips.length} consejos detectados</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {scoreCard("Puntuación viral", viralScore)}
              {scoreCard("Puntuación del gancho", hookScore)}
              {scoreCard("Legibilidad", readabilityScore)}
              {scoreCard("Historia", storyScore)}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Tecnologías detectadas
              </h3>

              {technologies.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={`tech-${tech.id}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      {tech.text}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Aún no se detectaron tecnologías.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Hashtags sugeridos
                </h3>

                {hashtags.length > 0 && (
                  <button
                    type="button"
                    onClick={copyHashtags}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    📋 Copiar hashtags
                  </button>
                )}
              </div>

              {hashtags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <span
                      key={`tag-${tag.id}`}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No hay sugerencias aún.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Consejos de mejora
              </h3>

              {tips.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {tips.map((tip) => (
                    <li
                      key={`tip-${tip.id}`}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 text-base">💡</span>
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No hay sugerencias todavía.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Rol detectado</h3>

              <div className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {roleDetected}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>Built with React, Tailwind y FastAPI · PostPilot MVP</p>
        </div>
      </div>
    </div>
  );
}