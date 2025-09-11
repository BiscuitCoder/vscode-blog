"use client"

import { Portfolio } from "./portfolio"

interface PortfolioSectionProps {
  onItemSelect?: (itemId: string) => void
}

export function PortfolioSection({ onItemSelect }: PortfolioSectionProps) {
  return <Portfolio onItemSelect={onItemSelect} />
}
