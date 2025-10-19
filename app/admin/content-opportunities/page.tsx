'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Loader2 } from 'lucide-react';

interface Topic {
  topic: string;
  count: number;
}

export default function ContentOpportunitiesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch('/api/admin/content-opportunities');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTopics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Lightbulb className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Opportunities</h1>
          <p className="text-slate-600 mt-2">
            Discover the most relevant topics for new blog posts based on your products.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related Topics Leaderboard</CardTitle>
          <CardDescription>
            These topics are frequently associated with your products. Writing blog posts about them can improve your SEO and internal linking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              <p className="ml-4 text-slate-600">Loading topics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>Error: {error}</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No related topics found in your products yet.</p>
              <p className="text-sm mt-2">Import products with SEO info to see opportunities here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-right">Product Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic, index) => (
                  <TableRow key={topic.topic}>
                    <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-800">{topic.topic}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{topic.count} products</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
