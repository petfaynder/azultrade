"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Tipleri page.tsx'ten kopyalıyoruz
interface ProductInfo {
  id: string;
  name: string;
  manufacturer: string;
}

interface QuoteItem {
  quantity: number;
  notes: string | null;
  products: ProductInfo[] | null;
}

export interface Quote {
  id: string;
  customer_name: string;
  customer_email: string;
  company_name: string | null;
  phone_number: string | null;
  message: string | null;
  status: string;
  created_at: string;
  quote_items: QuoteItem[];
}

interface QuotesClientProps {
  initialQuotes: Quote[];
}

export default function QuotesClient({ initialQuotes }: QuotesClientProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const { toast } = useToast();
  const router = useRouter();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/quotes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      toast({
        title: "Success",
        description: "Quote status updated successfully.",
      });
      // Sayfayı yeniden yüklemek yerine state'i güncelliyoruz
      setQuotes(prevQuotes => 
        prevQuotes.map(q => q.id === id ? { ...q, status } : q)
      );
      router.refresh(); // Sunucu verisini yenilemek için
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update quote status.",
        variant: "destructive",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'default';
      case 'processed': return 'secondary';
      case 'completed': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Product(s)</TableHead>
          <TableHead className="hidden lg:table-cell">Message</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote) => (
          <TableRow key={quote.id}>
            <TableCell>
              <div className="font-medium">{quote.customer_name}</div>
              <div className="text-sm text-muted-foreground">
                {quote.company_name || 'N/A'}
              </div>
            </TableCell>
            <TableCell>
               <div className="text-sm">{quote.customer_email}</div>
               <div className="text-xs text-muted-foreground">{quote.phone_number || '-'}</div>
            </TableCell>
            <TableCell>
              {quote.quote_items.map((item, index) => {
                const product = item.products?.[0];
                if (!product) {
                  return <div key={index}>{item.quantity} x [Deleted Product]</div>;
                }
                return (
                  <div key={index}>
                    {item.quantity} x{' '}
                    <Link href={`/products/${product.id}`} className="font-medium text-blue-600 hover:underline" target="_blank">
                      {product.name}
                    </Link>
                  </div>
                );
              })}
            </TableCell>
            <TableCell className="hidden lg:table-cell max-w-xs truncate">
              {quote.message || '-'}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(quote.status) as any}>
                {quote.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(quote.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'processed')}>
                    Mark as Processed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'completed')}>
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'cancelled')}>
                    Mark as Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}