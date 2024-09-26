import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

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
              <TableHead>Restaked</TableHead>
              <TableHead>Your share</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={index.toString()}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6 bg-blue-500">
                      <span className="text-sm">{asset.name[2].toLowerCase()}</span>
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
                <TableCell>${asset.restaked}K</TableCell>
                <TableCell>{asset.share}%</TableCell>
                <TableCell>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/staking">
                      <Button variant="default">Deposit</Button>
                    </Link>
                    <Link href="/staking">
                      <Button variant="secondary">Withdraw</Button>
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