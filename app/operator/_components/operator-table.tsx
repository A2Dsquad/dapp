import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

interface Operator {
  id: string;
  name: string;
  avatar: string;
  totalRestaked: string;
  stakers: number;
  avssSecured: number;
  isDelegate: boolean;
}

interface OperatorTableProps {
  operators: Operator[];
  onDelegateToggle: (operatorId: string) => void;
}

export function OperatorTable({ operators, onDelegateToggle }: OperatorTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Operator</TableHead>
          <TableHead>Total restaked</TableHead>
          <TableHead>Stakers</TableHead>
          <TableHead>AVSs Secured</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operators.map((operator) => (
          <TableRow key={operator.id}>
            <TableCell className="font-medium">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <img src={operator.avatar} alt={operator.name} />
                </Avatar>
                <span>{operator.name}</span>
              </div>
            </TableCell>
            <TableCell>{operator.totalRestaked}</TableCell>
            <TableCell>{operator.stakers}</TableCell>
            <TableCell>{operator.avssSecured}</TableCell>
            <TableCell>
              <Button
                onClick={() => onDelegateToggle(operator.id)}
                variant={operator.isDelegate ? "destructive" : "default"}
              >
                {operator.isDelegate ? "Undelegate" : "Delegate"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
