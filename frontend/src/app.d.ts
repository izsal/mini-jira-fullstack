declare global {
  namespace App {
    interface Locals {
      user?: { sub: number; role: "admin" | "user" };
    }
  }
}

export {};
