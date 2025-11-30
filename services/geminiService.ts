import { GoogleGenAI } from "@google/genai";
import { Source, GroundingChunk, LessonData, LessonSection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Research and Structure
 * Uses Google Search Grounding to get facts, then synthesizes a structured lesson.
 */
export const generateLessonPlan = async (topic: string): Promise<Omit<LessonData, 'sections'> & { rawSections: LessonSection[] }> => {
  const systemInstruction = `
    Actúa como un profesor experto y diseñador visual. 
    Tu objetivo es explicar un tema dividiéndolo en partes claras.
    
    REGLAS ESTRICTAS DE FORMATO:
    1. NO uses Markdown con asteriscos (ni **negritas**, ni *cursivas*). Escribe texto plano y limpio.
    2. Divide la lección en EXACTAMENTE 3 secciones o conceptos clave distintos.
    3. Para cada sección, incluye un título, una explicación clara y una descripción para una imagen (prompt visual).
    
    Usa el siguiente formato EXACTO para que mi software pueda leerlo:
    
    [INTRO]
    (Escribe aquí una introducción general breve y motivadora)
    
    [SECCION]
    TITULO: (Título corto del concepto 1)
    CONTENIDO: (Explicación detallada del concepto 1 sin asteriscos)
    VISUAL: (Descripción detallada de cómo debería ser la imagen para explicar este concepto, estilo flat design)
    
    [SECCION]
    TITULO: (Título corto del concepto 2)
    CONTENIDO: (Explicación detallada del concepto 2 sin asteriscos)
    VISUAL: (Descripción detallada para la imagen 2)
    
    [SECCION]
    TITULO: (Título corto del concepto 3)
    CONTENIDO: (Explicación detallada del concepto 3 sin asteriscos)
    VISUAL: (Descripción detallada para la imagen 3)
  `;

  const prompt = `
    Investiga y crea una lección visual sobre: "${topic}".
    Asegúrate de que la información sea veraz y actual.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const fullText = response.text || "";
    
    // Parse the custom format
    const introMatch = fullText.match(/\[INTRO\]\s*([\s\S]*?)(?=\[SECCION\]|$)/);
    const intro = introMatch ? introMatch[1].trim() : "Aquí tienes tu lección.";

    // Split by [SECCION] and process chunks
    const sectionChunks = fullText.split('[SECCION]').slice(1); // Skip the part before the first section
    
    const rawSections: LessonSection[] = sectionChunks.map(chunk => {
      const titleMatch = chunk.match(/TITULO:\s*(.*)/);
      const contentMatch = chunk.match(/CONTENIDO:\s*([\s\S]*?)(?=VISUAL:|$)/);
      const visualMatch = chunk.match(/VISUAL:\s*([\s\S]*?)(?=$|\[SECCION\])/);

      return {
        title: titleMatch ? titleMatch[1].trim() : "Concepto Clave",
        content: contentMatch ? contentMatch[1].trim() : chunk.trim(),
        visualPrompt: visualMatch ? visualMatch[1].trim() : `Una ilustración educativa sobre ${topic}`,
      };
    });

    // Extract sources
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });
    }

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return { 
      topic, 
      intro, 
      rawSections, 
      sources: uniqueSources 
    };

  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};

/**
 * Step 2: Parallel Image Generation
 * Generates images for all sections in parallel.
 */
export const generateSectionImages = async (sections: LessonSection[]): Promise<LessonSection[]> => {
  
  const imagePromises = sections.map(async (section) => {
    try {
      const imagePrompt = `
        Ilustración educativa estilo diseño plano (flat vector art), fondo blanco o muy suave.
        Alta calidad, minimalista, colores armoniosos.
        Tema: ${section.title}
        Descripción de la escena: ${section.visualPrompt}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: imagePrompt }]
        },
        config: {
          imageConfig: {
              aspectRatio: "16:9", 
          }
        }
      });

      let imageUrl: string | undefined = undefined;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      return { ...section, imageUrl };

    } catch (error) {
      console.warn(`Failed to generate image for section: ${section.title}`, error);
      return section; // Return section without image if it fails
    }
  });

  return Promise.all(imagePromises);
};