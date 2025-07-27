import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getQuotesAdmin } from "@/lib/database";
import QuotesClient from "./quotes-client";
import type { Quote } from "./quotes-client";

export default async function QuotesPage() {
  const quotes: Quote[] = await getQuotesAdmin() || [];

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Quote Requests</CardTitle>
          <CardDescription>
            Here are the latest quote requests from customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuotesClient initialQuotes={quotes} />
        </CardContent>
      </Card>
    </div>
  );
}