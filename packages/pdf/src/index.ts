import type { Devotee } from "@temple-cloud/shared";

export type ReceiptInput = {
  templeName: string;
  devotee: Devotee;
  amount: number;
  purpose: string;
  issuedAt: string;
};

export function createReceiptTitle(input: ReceiptInput) {
  return `${input.templeName} ${input.purpose} 영수증`;
}