// ============================================================================
// Enums & Domain Literals
// ============================================================================

export type StorybookStatus =
  | "DRAFT"
  | "STORY_READY"
  | "CHARACTER_READY"
  | "ILLUSTRATING"
  | "RENDERING"
  | "COMPLETED"
  | "READY"
  | "FAILED"
  | "CANCELLED";

export type ArtStyle = "SOFT_WATERCOLOR";

export type Orientation = "SQUARE" | "PORTRAIT";

export type LanguageVariety = "MSA" | "LEBANESE" | "EGYPTIAN" | "GULF";

export type TashkeelLevel = "FULL" | "PARTIAL" | "NONE";

export type ChildGender = "BOY" | "GIRL";

export type AgeBand = "AGE_3_5" | "AGE_6_8" | "AGE_9_10";

export type SkinTone =
  | "VERY_LIGHT"
  | "LIGHT"
  | "LIGHT_OLIVE"
  | "OLIVE"
  | "TAN"
  | "BROWN"
  | "DARK_BROWN";

export type HairColor =
  | "BLACK"
  | "DARK_BROWN"
  | "BROWN"
  | "LIGHT_BROWN"
  | "BLONDE"
  | "RED";

export type HairStyle =
  | "VERY_SHORT"
  | "SHORT_STRAIGHT"
  | "SHORT_CURLY"
  | "MEDIUM_STRAIGHT"
  | "MEDIUM_CURLY"
  | "LONG_STRAIGHT"
  | "LONG_CURLY"
  | "PONYTAIL"
  | "BRAIDS";

export type EyeColor =
  | "DARK_BROWN"
  | "BROWN"
  | "HAZEL"
  | "GREEN"
  | "BLUE"
  | "GREY";

export type CompanionType =
  | "CAT"
  | "DOG"
  | "RABBIT"
  | "PARROT"
  | "BROTHER"
  | "SISTER";

export type PetColor =
  | "WHITE"
  | "BLACK"
  | "GREY"
  | "ORANGE"
  | "BROWN"
  | "BLACK_AND_WHITE"
  | "GREEN";

export type Interest =
  | "FOOTBALL"
  | "CATS"
  | "DOGS"
  | "DINOSAURS"
  | "SPACE"
  | "SEA_CREATURES"
  | "DRAWING"
  | "MUSIC"
  | "CARS"
  | "HORSES"
  | "BOOKS"
  | "COOKING";

export type StorySetting =
  | "BEIRUT"
  | "CAIRO"
  | "RIYADH"
  | "DUBAI"
  | "AMMAN"
  | "GENERIC_CITY"
  | "COUNTRYSIDE";

export type StoryTime =
  | "MORNING"
  | "DAYTIME"
  | "AFTERNOON"
  | "SUNSET"
  | "NIGHT";

export type PageKind =
  | "COVER"
  | "DEDICATION"
  | "STORY"
  | "BACK_COVER";

export type TextZone =
  | "BOTTOM_SPAN"
  | "TOP_SPAN"
  | "LEFT_HALF"
  | "RIGHT_HALF"
  | "NONE";

// ============================================================================
// Standard API Envelope
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;                  // true for success, false for business/validation errors
  statusCode: number;               // e.g., 200, 201, 400, 404, 422
  status: string;                   // "OK", "CREATED", "BAD_REQUEST", "UNPROCESSABLE_ENTITY"
  messageStatus: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
  message: string;                  // Localized human-readable message
  correlationId: string;            // MDC correlation/trace ID for logging and bug reports
  timestamp: string;                // ISO-8601 string (e.g. "2026-10-06T08:30:00Z")
  data: T;                          // Response body payload
  errors?: Record<string, string[]>; // Field-level validation errors (if status is 400/422)
}

// ============================================================================
// Child & Character Models
// ============================================================================

export interface ChildAppearance {
  skinTone: SkinTone;
  hairColor?: HairColor;      // Required if hijab is false
  hairStyle?: HairStyle;      // Required if hijab is false
  eyeColor: EyeColor;
  glasses: boolean;
  hijab: boolean;             // Only permitted if gender is GIRL
}

export interface CreateChildProfileRequest {
  nameAr: string;             // 2-30 Arabic characters and spaces
  gender: ChildGender;
  ageBand: AgeBand;
  appearance: ChildAppearance;
  photoBase64?: string;       // Optional Base64 Data URI
}

export interface CompanionSpec {
  type: CompanionType;
  nameAr: string;
  petColor?: PetColor;                 // Required if pet (CAT, DOG, RABBIT, PARROT)
  siblingAppearance?: ChildAppearance; // Required if BROTHER or SISTER
  photoBase64?: string;                // Optional Base64 Data URI
}

export interface CharacterInput {
  id: string;                          // Unique identifier slug (e.g. "grandpa", "mom")
  name: string;                        // Arabic display name (e.g. "الجد سالم")
  type?: "HUMAN" | "ANIMAL" | "FANTASY";
  role?: "MENTOR" | "SUPPORTING" | "FRIEND" | string;
  relationship?: string;               // e.g. "grandfather", "mother", "teacher"
  age?: number;
  gender?: ChildGender;
  clothes?: string;                    // Arabic description of clothing
  appearance?: ChildAppearance;
  personality?: string[];              // e.g. ["حكيم", "صبور"]
  strength?: string;
  weakness?: string;
  favoriteActivity?: string;
  signatureItem?: string;
  speakingStyle?: string;
  photoBase64?: string;                // Optional Base64 Data URI
}

// ============================================================================
// Storybook Request & Response Models
// ============================================================================

export interface CreateStorybookRequest {
  // Child: Provide either child (inline object) OR childProfileId (saved profile)
  child?: CreateChildProfileRequest;
  childProfileId?: number;
  childPhotoBase64?: string;

  // Companion (Optional)
  companion?: CompanionSpec;
  companionPhotoBase64?: string;

  // Supporting Characters (Optional, up to 4)
  characters?: CharacterInput[];

  // Story Configuration
  pageCount: number;                   // Strict integer between 15 and 20
  style: ArtStyle;                     // "SOFT_WATERCOLOR"
  orientation?: Orientation;           // Default: "SQUARE"
  variety?: LanguageVariety;           // Default: "MSA"
  tashkeelLevel?: TashkeelLevel;       // Default: "PARTIAL" (Must be "NONE" if dialect)

  // Creative Tone & Context (Optional)
  interests?: Interest[];              // Maximum 3 interests
  setting?: StorySetting;
  settings?: StorySetting;
  timeOfDay?: StoryTime;
  place?: string;                      // Specific setting (max 120 chars)
  theme?: string;                      // Central theme (e.g., courage, kindness)
  storyTone?: string;                  // Tone of voice (e.g., adventurous, warm)
  lesson?: string;                     // Moral lesson
  storyIdea?: string;                  // Parent's premise / plot seed
  dedication?: string;                 // Book opening dedication (max 300 chars)
  thingsToAvoid?: string[];            // Fears or sensitive topics to omit

  // Legal Consent (Required if any photo is attached)
  photoConsent?: boolean;
}

export interface PageView {
  pageIndex: number;
  kind: PageKind;
  textAr?: string;
  textZone: TextZone;
  imageUrl?: string;
}

export interface StorybookDetail {
  id: number;
  status: StorybookStatus;
  statusMessage?: string;              // Human-friendly localized Arabic status message
  titleAr?: string;
  childNameAr?: string;
  variety: LanguageVariety;
  tashkeelLevel: TashkeelLevel;
  pageCount: number;
  dedication?: string;
  pages: PageView[];
  coverImageUrl?: string;
  coverUrl?: string;
  characterSheetUrl?: string;          // Generated 4-panel watercolor character look sheet
  failureReason?: string;              // Present if status === "FAILED"
  lookRegenerationsLeft: number;       // Remaining character look regenerations allowed
  pageRegenerationsLeft: number;       // Remaining page illustration regenerations allowed
}

export interface StorybookSummary {
  id: number;
  titleAr?: string;
  childNameAr?: string;
  status: StorybookStatus;
  pageCount: number;
  createdAt: string;                   // ISO timestamp
  coverImageUrl?: string;
  coverUrl?: string;
}

export interface ReaderManifestPage {
  order: number;
  kind: PageKind;
  textAr: string;
  textZone: TextZone;
  imageUrl: string;
}

export interface ReaderManifest {
  bookId: number;
  dir: "rtl" | "ltr";
  titleAr: string;
  pages: ReaderManifestPage[];
}

export interface DownloadUrlResponse {
  url: string;                         // S3 / R2 presigned download URL for print PDF
}

export interface ChildProfileResponse {
  id: number;
  nameAr: string;
  gender: ChildGender;
  ageBand: AgeBand;
  appearance: ChildAppearance;
}

export interface EditStoryPageInput {
  pageIndex: number;
  textAr: string;
  sceneEn?: string;
}

export interface EditStoryRequest {
  titleAr?: string;
  pages?: EditStoryPageInput[];
}
