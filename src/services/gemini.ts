import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ContentPack {
  brandStyle: {
    tone: string;
    keywords: string[];
  };
  platforms: {
    instagram?: {
      captions: string[];
      hashtags: string[];
      reelIdeas: { hook: string; concept: string; cta: string }[];
    };
    linkedin?: {
      posts: { title: string; body: string; hashtags: string[] }[];
    };
    twitter?: {
      tweets: string[];
      threads: { hook: string; points: string[]; cta: string }[];
    };
    facebook?: {
      posts: string[];
      groupPosts: string[];
    };
  };
  viralScript: {
    hook: string;
    story: string;
    cta: string;
  };
  posterIdea: {
    description: string;
    textOverlay: string;
    colorTheme: string;
    imagePrompt: string;
  };
  contentPlan: {
    day: number;
    platform: string;
    postIdea: string;
    captionIdea: string;
  }[];
  salesPost: string;
}

export async function generateContentPack(
  businessType: string,
  location: string,
  targetAudience: string,
  offer?: string,
  selectedPlatforms: string[] = ['instagram'],
  language: string = 'English'
): Promise<ContentPack> {
  const prompt = `
    You are an expert AI social media growth strategist, content creator, and branding expert.
    Generate a complete high-converting social media content pack for a local business.

    INPUT:
    Business Type: ${businessType}
    Location: ${location}
    Target Audience: ${targetAudience}
    Offer: ${offer || "None provided"}
    Selected Platforms: ${selectedPlatforms.join(', ')}
    Target Language: ${language}

    RULES:
    - Content must be generated in the specified language: ${language}.
    - Content must feel human, not robotic.
    - If the language is Hindi/Hinglish, use local slang and cultural references appropriate for ${location}.
    - Focus on local audience psychology.
    - Keep it trendy and viral-ready.
    - For each platform, provide platform-specific content (e.g., professional for LinkedIn, punchy for Twitter).
    - Provide a detailed "imagePrompt" for an AI image generator to create the poster.
    - Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandStyle: {
            type: Type.OBJECT,
            properties: {
              tone: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["tone", "keywords"],
          },
          platforms: {
            type: Type.OBJECT,
            properties: {
              instagram: {
                type: Type.OBJECT,
                properties: {
                  captions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reelIdeas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        hook: { type: Type.STRING },
                        concept: { type: Type.STRING },
                        cta: { type: Type.STRING },
                      },
                      required: ["hook", "concept", "cta"],
                    },
                  },
                },
              },
              linkedin: {
                type: Type.OBJECT,
                properties: {
                  posts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        body: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["title", "body", "hashtags"],
                    },
                  },
                },
              },
              twitter: {
                type: Type.OBJECT,
                properties: {
                  tweets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  threads: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        hook: { type: Type.STRING },
                        points: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cta: { type: Type.STRING },
                      },
                      required: ["hook", "points", "cta"],
                    },
                  },
                },
              },
              facebook: {
                type: Type.OBJECT,
                properties: {
                  posts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  groupPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
          },
          viralScript: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              story: { type: Type.STRING },
              cta: { type: Type.STRING },
            },
            required: ["hook", "story", "cta"],
          },
          posterIdea: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              textOverlay: { type: Type.STRING },
              colorTheme: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
            },
            required: ["description", "textOverlay", "colorTheme", "imagePrompt"],
          },
          contentPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                platform: { type: Type.STRING },
                postIdea: { type: Type.STRING },
                captionIdea: { type: Type.STRING },
              },
              required: ["day", "platform", "postIdea", "captionIdea"],
            },
          },
          salesPost: { type: Type.STRING },
        },
        required: [
          "brandStyle",
          "platforms",
          "viralScript",
          "posterIdea",
          "contentPlan",
          "salesPost",
        ],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generatePosterImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Create a high-quality, vibrant social media poster for a local business. ${prompt}. The poster should be modern, clean, and professional.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}
