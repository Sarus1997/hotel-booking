import type { RoomType } from "./types";

type RoomCopy = { name: string; description: string };

const ENGLISH_ROOM_COPY: Record<string, RoomCopy> = {
  "ห้องประหยัด (Economy)": {
    name: "Economy Room",
    description:
      "A compact 20 sq.m. room for solo stays with complimentary Wi-Fi.",
  },
  "ห้องมาตรฐาน (Standard)": {
    name: "Standard Room",
    description:
      "A 28 sq.m. twin room with air conditioning, TV, and complimentary Wi-Fi.",
  },
  "ห้องซูพีเรียร์ (Superior)": {
    name: "Superior Room",
    description:
      "A contemporary 32 sq.m. room with garden views, a work desk, and Wi-Fi.",
  },
  "ห้องดีลักซ์ (Deluxe)": {
    name: "Deluxe Room",
    description: "A 36 sq.m. city-view room with a king-size bed and bathtub.",
  },
  "ห้องดีลักซ์วิวทะเล (Ocean Deluxe)": {
    name: "Ocean Deluxe Room",
    description:
      "A 40 sq.m. room with a private balcony, ocean views, and a window-side lounge.",
  },
  "ห้องพรีเมียม (Premium)": {
    name: "Premium Room",
    description:
      "A 42 sq.m. king room with a lounge area and private coffee machine.",
  },
  "ห้องสวีท (Suite)": {
    name: "Suite",
    description:
      "A 60 sq.m. suite with a separate living room and breakfast for two.",
  },
  "ห้องจูเนียร์สวีท (Junior Suite)": {
    name: "Junior Suite",
    description:
      "A 48 sq.m. suite with separate sleeping and living areas, bathtub, and minibar.",
  },
  "ห้องสวีทวิวเมือง (City Suite)": {
    name: "City Suite",
    description:
      "A 65 sq.m. suite with panoramic city views, living room, and dining area.",
  },
  "ห้องแฟมิลี่ (Family)": {
    name: "Family Room",
    description: "A 55 sq.m. family room with two double beds.",
  },
  "ห้องแฟมิลี่คอนเนคติ้ง (Family Connecting)": {
    name: "Family Connecting Room",
    description:
      "Two connecting rooms totaling 70 sq.m., ideal for larger families.",
  },
  "ห้องผู้บริหาร (Executive)": {
    name: "Executive Room",
    description:
      "A 45 sq.m. room with a work desk, sofa, and Executive Lounge access.",
  },
  "พูลวิลล่า (Pool Villa)": {
    name: "Pool Villa",
    description:
      "An 80 sq.m. private villa with a pool, balcony, and outdoor lounge.",
  },
  "การ์เด้นวิลล่า (Garden Villa)": {
    name: "Garden Villa",
    description:
      "A 75 sq.m. garden villa with a private terrace and outdoor soaking tub.",
  },
  "ห้องฮันนีมูน (Honeymoon)": {
    name: "Honeymoon Room",
    description:
      "A romantic 50 sq.m. room with a round bed, jacuzzi, and sunset balcony.",
  },
  "ห้องเพนต์เฮาส์ (Penthouse)": {
    name: "Penthouse",
    description:
      "A 110 sq.m. top-floor suite with a spacious lounge and panoramic city views.",
  },
  "ห้องสำหรับผู้ใช้รถเข็น (Accessible)": {
    name: "Accessible Room",
    description:
      "A 32 sq.m. step-free room with grab rails and a wide bathroom door.",
  },
  "ห้องพักระยะยาว (Long Stay)": {
    name: "Long-Stay Room",
    description:
      "A 38 sq.m. room with a kitchenette, washer, and work area for extended stays.",
  },
};

export function getRoomCopy(roomType: RoomType, thai: boolean): RoomCopy {
  return thai
    ? { name: roomType.name, description: roomType.description }
    : (ENGLISH_ROOM_COPY[roomType.name] ?? {
        name: roomType.name,
        description: roomType.description,
      });
}
