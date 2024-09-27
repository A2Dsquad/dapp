import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

export function useClaimReward() {
  const { account } = useWallet()

  return useMutation({
    mutationFn: async () => {
      if (!account) return

      try {
        await fetch(`https://test.lotusfarm.online/api/rewards/${account?.address}`, {
          method: 'POST',
        })
        toast.success('Claim successfully', {
          description: 'Your reward will be reflected in your balance shortly',
        })
      } catch (error) {
        console.error('Error claiming reward', error)
      }
    },
  })
}
