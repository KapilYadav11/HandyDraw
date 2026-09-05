import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private currentPencilPoints: { x: number; y: number }[] = [];
  private selectedTool: Tool = "rect";

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
    } catch (e) {
      console.error("Failed to load existing shapes", e);
      this.existingShapes = [];
    }
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        try {
          const parsed = JSON.parse(message.message);
          if (parsed?.shape) {
            this.existingShapes.push(parsed.shape as Shape);
            this.clearCanvas();
          }
        } catch (e) {
          console.error("Bad shape payload", e);
        }
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "rgba(255, 255, 255)";
    this.ctx.lineWidth = 2;

    this.existingShapes.forEach((shape) => this.drawShape(shape));
  }

  private drawShape(shape: Shape) {
    this.ctx.strokeStyle = "rgba(255, 255, 255)";

    if (shape.type === "rect") {
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      this.ctx.beginPath();
      this.ctx.arc(
        shape.centerX,
        shape.centerY,
        Math.abs(shape.radius),
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "pencil") {
      if (shape.points.length < 2) return;
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);
      for (let i = 1; i < shape.points.length; i++) {
        this.ctx.lineTo(shape.points[i]!.x, shape.points[i]!.y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  private sendShape(shape: Shape) {
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    if (!this.clicked) return;
    this.clicked = false;

    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - this.startX;
    const height = currentY - this.startY;

    let shape: Shape | null = null;

    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        radius,
        centerX: this.startX + (width < 0 ? -radius : radius),
        centerY: this.startY + (height < 0 ? -radius : radius),
      };
    } else if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x: currentX, y: currentY });
      if (this.currentPencilPoints.length >= 2) {
        shape = {
          type: "pencil",
          points: this.currentPencilPoints,
        };
      }
      this.currentPencilPoints = [];
    }

    if (!shape) return;
    this.sendShape(shape);
    this.clearCanvas();
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x: currentX, y: currentY });
      this.clearCanvas();
      this.drawShape({ type: "pencil", points: this.currentPencilPoints });
      return;
    }

    const width = currentX - this.startX;
    const height = currentY - this.startY;

    this.clearCanvas();
    this.ctx.strokeStyle = "rgba(255, 255, 255)";

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const centerX = this.startX + (width < 0 ? -radius : radius);
      const centerY = this.startY + (height < 0 ? -radius : radius);
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}