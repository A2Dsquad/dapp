import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { toCurrency } from '@/lib/number'
import { TOKEN_ADDRESS } from '@/lib/constants'

export function AssetTable({
  assets,
}: { assets: { name: string; apy?: string; tvl: string; restaked: string; share: string }[] }) {
  return (
    <Card>
      <CardContent className="p-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead>Your restaked</TableHead>
              <TableHead>Your share</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={index.toString()}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6 bg-blue-500">
                      <AvatarImage src="https://s2.coinmarketcap.com/static/img/coins/200x200/29034.png" />
                    </Avatar>
                    <span>{asset.name}</span>
                    {asset.apy && (
                      <Badge variant="secondary" className="ml-2">
                        APY: {asset.apy}%
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>${asset.tvl}M</TableCell>
                <TableCell>{asset.restaked !== '--' ? toCurrency(asset.restaked, { prefix: '$' }) : '--'}</TableCell>
                <TableCell>{asset.share !== '--' ? `${asset.share}%` : '--'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col justify-end sm:flex-row gap-2">
                    <Link href={`/staking/${TOKEN_ADDRESS}`}>
                      <Button variant="default">Restake</Button>
                    </Link>
                    <Link href={`/staking/${TOKEN_ADDRESS}`}>
                      <Button variant="secondary">Unstake</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
