/**
 * Interactive Stories API Module
 * 
 * This module contains all API calls related to interactive stories.
 * All functions use the centralized apiHelpers for consistent error handling,
 * token management, and request structure.
 */

import { getHelper, postHelper, putHelper } from "./apiHelpers";

/**
 * Get the initial scene of an interactive story
 * 
 * @param {string|number} storyId - The ID of the story to start
 * @returns {Promise<Object>} Response containing:
 *   - scene: Object with sceneId, sceneNumber, sceneText, sceneImage, nodes[]
 *   - story: Metadata about the story (title, genre, etc.)
 * 
 * Expected response structure:
 * {
 *   data: {
 *     scene: {
 *       sceneId: "scene_0",
 *       sceneNumber: 0,
 *       sceneText: "...",
 *       sceneImage: "https://...",
 *       nodes: [
 *         {
 *           nodeId: "node_1",
 *           nodeText: "Choice 1",
 *           nodeDescription: "Description of choice 1"
 *         },
 *         ...
 *       ]
 *     },
 *     story: {
 *       title: "Story Title",
 *       genre: "Fantasy",
 *       totalScenes: 10
 *     }
 *   }
 * }
 */
export async function getInitialScene(storyId) {
  return await getHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/start`,
  });
}

/**
 * Generate the next scene based on user's choice
 * 
 * @param {string|number} storyId - The ID of the current story
 * @param {Object} sceneData - Data about current scene and chosen node
 * @param {string} sceneData.currentSceneId - ID of the current scene
 * @param {string} sceneData.chosenNodeId - ID of the node the user selected
 * @param {number} sceneData.sceneNumber - The next scene number
 * @returns {Promise<Object>} Response containing the next scene
 * 
 * Expected response structure:
 * {
 *   data: {
 *     scene: {
 *       sceneId: "scene_1",
 *       sceneNumber: 1,
 *       sceneText: "...",
 *       sceneImage: "https://...",
 *       chosenNodeId: "node_2",
 *       nodes: [...]
 *     }
 *   }
 * }
 */
export async function generateNextScene(storyId, sceneData) {
  return await postHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/next-scene`,
    body: {
      currentSceneId: sceneData.currentSceneId,
      chosenNodeId: sceneData.chosenNodeId,
      sceneNumber: sceneData.sceneNumber,
    },
  });
}

/**
 * Get story progress/history for the current user
 * 
 * @param {string|number} storyId - The ID of the story
 * @returns {Promise<Object>} Response containing user's progress
 * 
 * Expected response structure:
 * {
 *   data: {
 *     storyId: "123",
 *     currentSceneNumber: 5,
 *     sceneHistory: [
 *       { sceneId: "scene_0", chosenNodeId: "node_1", timestamp: "..." },
 *       ...
 *     ],
 *     completionPercentage: 50
 *   }
 * }
 */
export async function getStoryProgress(storyId) {
  return await getHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/progress`,
  });
}

/**
 * Save current progress (bookmark a scene)
 * 
 * @param {string|number} storyId - The ID of the story
 * @param {Object} progressData - Progress data to save
 * @param {string} progressData.sceneId - Current scene ID
 * @param {number} progressData.sceneNumber - Current scene number
 * @param {Array} progressData.sceneHistory - History of all scenes visited
 * @returns {Promise<Object>} Response confirming save
 */
export async function saveStoryProgress(storyId, progressData) {
  return await putHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/progress`,
    body: progressData,
  });
}

/**
 * Get a specific scene by ID (for navigating history)
 * 
 * @param {string|number} storyId - The ID of the story
 * @param {string} sceneId - The ID of the scene to retrieve
 * @returns {Promise<Object>} Response containing the requested scene
 */
export async function getSceneById(storyId, sceneId) {
  return await getHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/scenes/${sceneId}`,
  });
}

/**
 * Complete/finish a story
 * 
 * @param {string|number} storyId - The ID of the story
 * @param {Object} completionData - Data about how the story was completed
 * @param {string} completionData.finalSceneId - ID of the final scene reached
 * @param {number} completionData.totalScenes - Total scenes visited
 * @param {Array} completionData.path - Array of scene IDs showing the path taken
 * @returns {Promise<Object>} Response containing completion data, achievements, etc.
 */
export async function completeStory(storyId, completionData) {
  return await postHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/complete`,
    body: completionData,
  });
}

/**
 * Get all possible endings for a story (for replay/exploration)
 * 
 * @param {string|number} storyId - The ID of the story
 * @returns {Promise<Object>} Response containing all possible endings
 */
export async function getStoryEndings(storyId) {
  return await getHelper({
    url: `${import.meta.env.VITE_API_URL}/interactive-stories/${storyId}/endings`,
  });
}

// ============================================================
// API RESPONSE NORMALIZATION HELPERS
// ============================================================

/**
 * Normalize scene response to ensure consistent structure
 * Handles various possible API response formats
 */
export function normalizeSceneResponse(response) {
  const data = response?.data ?? response;
  const scene = data?.scene ?? data?.initialScene ?? data;
  const metadata = data?.story ?? data?.metadata ?? null;

  return {
    scene: {
      sceneId: scene?.sceneId ?? scene?.id ?? "",
      sceneNumber: scene?.sceneNumber ?? 0,
      sceneText: scene?.sceneText ?? scene?.text ?? "",
      sceneImage: scene?.sceneImage ?? scene?.image ?? "",
      chosenNodeId: scene?.chosenNodeId ?? null,
      nodes: (scene?.nodes ?? scene?.choices ?? []).map((node) => ({
        nodeId: node?.nodeId ?? node?.id ?? "",
        nodeText: node?.nodeText ?? node?.text ?? "",
        nodeDescription: node?.nodeDescription ?? node?.description ?? "",
      })),
    },
    metadata,
  };
}

/**
 * Validate scene data structure
 * Returns true if scene has required fields
 */
export function isValidScene(scene) {
  return !!(
    scene &&
    scene.sceneText &&
    scene.nodes &&
    Array.isArray(scene.nodes) &&
    scene.nodes.length > 0
  );
}

// ============================================================
// EXAMPLE USAGE
// ============================================================

/**
 * Example: Starting and playing through a story
 * 
 * // 1. Get initial scene
 * const response = await getInitialScene(storyId);
 * const { scene, metadata } = normalizeSceneResponse(response);
 * 
 * // 2. User makes a choice
 * const chosenNode = scene.nodes[0];
 * 
 * // 3. Get next scene
 * const nextResponse = await generateNextScene(storyId, {
 *   currentSceneId: scene.sceneId,
 *   chosenNodeId: chosenNode.nodeId,
 *   sceneNumber: scene.sceneNumber + 1
 * });
 * 
 * // 4. Save progress periodically
 * await saveStoryProgress(storyId, {
 *   sceneId: currentScene.sceneId,
 *   sceneNumber: currentScene.sceneNumber,
 *   sceneHistory: historyArray
 * });
 */
