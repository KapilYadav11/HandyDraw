import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import type { Shape } from "./Game";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages as { message: string }[];

  const shapes: Shape[] = [];
  for (const m of messages) {
    try {
      const parsed = JSON.parse(m.message);
      if (parsed?.shape) {
        shapes.push(parsed.shape as Shape);
      }
    } catch {
      // skip malformed / non-shape chat rows
    }
  }

  return shapes;
}