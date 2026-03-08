import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAndReplace() {
  try {
    console.log("Generating Image 1 (Alkaline)...");
    const res1 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: "Um close-up cinematográfico e brilhante de um copo de cristal de luxo sendo preenchido por água perfeitamente cristalina. O fundo é um estúdio branco minimalista e limpo. A água tem um leve brilho azul-safira sutil e muitas microbolhas visíveis, transmitindo a ideia de água alcalina ionizada e hidratação profunda. Iluminação natural e suave.",
      config: {
        imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
      }
    });
    
    let img1Base64 = "";
    for (const part of res1.candidates[0].content.parts) {
      if (part.inlineData) {
        img1Base64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    console.log("Generating Image 2 (Ozone)...");
    const res2 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: "Um close-up macro e nítido de frutas vibrantes e frescas (morangos e mirtilos) sendo imersas em uma fruteira de vidro com água. O fundo é um ambiente de cozinha de luxo, clean e moderno. Água efervescente com ozônio, onde muitas microbolhas brancas e ativas envolvem as frutas, removendo impurezas. Iluminação de estúdio limpa, passando a sensação de segurança alimentar e esterilização por O3",
      config: {
        imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
      }
    });

    let img2Base64 = "";
    for (const part of res2.candidates[0].content.parts) {
      if (part.inlineData) {
        img2Base64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    let html = fs.readFileSync('index.html', 'utf8');
    
    // Replace Image 1
    html = html.replace(
      /<img src="https:\/\/images\.unsplash\.com\/photo-1559839914-17aae19cec71[^>]+alt="Água Alcalina"[^>]*>/,
      `<img src="${img1Base64}" alt="Água Alcalina" class="w-full h-48 object-cover rounded-2xl mb-8 shadow-inner">`
    );

    // Replace Image 2
    html = html.replace(
      /<img src="https:\/\/images\.unsplash\.com\/photo-1615486171448-4af6820fb66e[^>]+alt="Água com Ozônio"[^>]*>/,
      `<img src="${img2Base64}" alt="Água com Ozônio" class="w-full h-48 object-cover bg-dark/5 rounded-2xl mb-8 shadow-inner">`
    );

    fs.writeFileSync('index.html', html);
    console.log("Successfully updated images.");
  } catch (e) {
    console.error(e);
  }
}

generateAndReplace();
