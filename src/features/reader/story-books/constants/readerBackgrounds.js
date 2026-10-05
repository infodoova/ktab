import nurseryBackdrop from "@/assets/images/children-stories/cartoon-storybook-backdrop.svg";
import forestBackdrop from "@/assets/images/children-stories/backdrop-enchanted-forest.svg";
import cloudBackdrop from "@/assets/images/children-stories/backdrop-cloud-realm.svg";
import libraryBackdrop from "@/assets/images/children-stories/backdrop-midnight-library.svg";
import studioBackdrop from "@/assets/images/children-stories/backdrop-editorial-studio.svg";

export const READER_BACKGROUNDS = [
  {
    id: "white",
    title: "أبيض ناصع",
    subtitle: "خلفية بيضاء نقية بدون رسومات",
    accent: "#ffffff",
    previewGradient: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    svg: "",
  },
  {
    id: "nursery",
    title: "غرفة الحكايات",
    subtitle: "أضواء دافئة وهلال لطيف",
    accent: "#5de3ba",
    previewGradient: "linear-gradient(135deg, #4a69bd 0%, #d99b4b 100%)",
    svg: nurseryBackdrop,
  },
  {
    id: "forest",
    title: "الغابة الساحرة",
    subtitle: "أنوار سحرية وأشجار خضراء",
    accent: "#2ecc71",
    previewGradient: "linear-gradient(135deg, #0a1f1d 0%, #4d2b10 100%)",
    svg: forestBackdrop,
  },
  {
    id: "clouds",
    title: "مملكة السحاب",
    subtitle: "ألوان وردية وغيوم ناعمة",
    accent: "#fd79a8",
    previewGradient: "linear-gradient(135deg, #fd79a8 0%, #e1b12c 100%)",
    svg: cloudBackdrop,
  },
  {
    id: "library",
    title: "المكتبة الليلية",
    subtitle: "نافذة النجوم وخشب الماهوجني",
    accent: "#fbc02d",
    previewGradient: "linear-gradient(135deg, #0a1128 0%, #69301f 100%)",
    svg: libraryBackdrop,
  },
  {
    id: "studio",
    title: "الاستوديو النقي",
    subtitle: "تصميم بسيط هادئ وفاخر",
    accent: "#0a0a0a",
    previewGradient: "linear-gradient(135deg, #f1f5f9 0%, #d4b483 100%)",
    svg: studioBackdrop,
  },
];

export const DEFAULT_BACKGROUND_ID = "nursery";

export function getReaderBackground(id) {
  const found = READER_BACKGROUNDS.find((b) => b.id === id);
  return found || READER_BACKGROUNDS[0];
}
