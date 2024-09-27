import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export async function sleep(time: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export const loopAsync = async (
  times: number,
  callback: (index: number) => Promise<void>,
  delays: number,
) => {
  for (let i = 0; i < times; i++) {
    await callback(i)
    await sleep(delays)
  }
}
