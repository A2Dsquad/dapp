import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { shortenAddress } from '@/lib/utils'

export function useClaimReward() {
  const { account } = useWallet()

  return useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      const response = await fetch(
        `https://test.lotusfarm.online/api/rewards/claim/${account.address}`,
        {
          method: 'POST',
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to claim reward: ${errorText}`)
      }

      const responseText = await response.text()
      return responseText
    },
    onSuccess: (data) => {
      toast.success('Claim successful', {
        description: (
          <div className="flex flex-row gap-2">
            <span className="text-neutral-50">Transaction hash:</span>
            <Link href={`https://explorer.aptoslabs.com/txn/${data}`} target="_blank" className="underline flex items-center gap-2 text-neutral-100">
              {shortenAddress(data)}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ),
      })
    },
    onError: (error: Error) => {
      console.error('Error claiming reward', error)
      toast.error('Failed to claim reward', {
        description: error.message,
      })
    },
  })
}
