'use client';

import { useState, useEffect, Fragment, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Loader2, ChevronDown, ChevronRight, Link2, CheckCircle2, Circle, X, TrendingUp, BookOpen, Target, Bot, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
}

interface Topic {
  topic: string;
  count: number;
  products: Product[];
  status: 'pending' | 'completed';
  linked_blog_posts: BlogPost[];
}

export default function ContentOpportunitiesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [generatedBrief, setGeneratedBrief] = useState('');
  const [isBriefLoading, setIsBriefLoading] = useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content-opportunities');
      if (!response.ok) throw new Error('Failed to fetch topics');
      const data = await response.json();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
        const response = await fetch('/api/blog');
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        setBlogPosts(data);
    } catch (err) {
        console.error("Error fetching blog posts:", err);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchBlogPosts();
  }, []);

  const handleLinkBlogPost = async (blogPostId: string) => {
    if (!selectedTopic) return;

    try {
        const response = await fetch('/api/admin/content-opportunities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: selectedTopic.topic, blog_post_id: blogPostId }),
        });

        if (!response.ok) throw new Error('Failed to link blog post');

        toast({ title: "Success", description: "Blog post linked successfully." });
        setIsLinkModalOpen(false);
        fetchTopics();
    } catch (error) {
        toast({ title: "Error", description: "Failed to link blog post.", variant: "destructive" });
    }
  };

  const handleUnlinkBlogPost = async (topic: string, blogPostId: string) => {
    try {
        const response = await fetch('/api/admin/content-opportunities', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, blog_post_id: blogPostId }),
        });

        if (!response.ok) throw new Error('Failed to unlink blog post');

        toast({ title: "Success", description: "Blog post unlinked successfully." });
        fetchTopics();
    } catch (error) {
        toast({ title: "Error", description: "Failed to unlink blog post.", variant: "destructive" });
    }
  };

  const stats = useMemo(() => {
    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => t.status === 'completed').length;
    const pendingTopics = totalTopics - completedTopics;
    const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return { totalTopics, completedTopics, pendingTopics, completionRate };
  }, [topics]);

  const handleGenerateBrief = async (topic: Topic) => {
    setIsBriefLoading(true);
    setGeneratedBrief('');
    setSelectedTopic(topic);
    setIsBriefModalOpen(true);
    try {
      const response = await fetch('/api/admin/ai-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.topic, products: topic.products }),
      });
      if (!response.ok) throw new Error('Failed to generate brief');
      const data = await response.json();
      setGeneratedBrief(JSON.stringify(data, null, 2));
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate AI brief.", variant: "destructive" });
      setIsBriefModalOpen(false);
    } finally {
      setIsBriefLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBrief);
    toast({ title: "Copied!", description: "AI brief copied to clipboard." });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Lightbulb className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Opportunities</h1>
          <p className="text-slate-600 mt-2 max-w-4xl">
            This page identifies high-impact content ideas based on your existing products. Topics are automatically generated from the 'related_topics' field in your products' SEO information. Use this tool to create a strategic content plan: identify a topic, write a relevant blog post, and then link it here to track your progress and strengthen your site's internal linking structure for better SEO.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTopics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Topics</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTopics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTopics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topics Leaderboard</CardTitle>
          <CardDescription>
            Click on a topic to see related products. Use the actions to link blog posts and mark topics as completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /><p className="ml-4 text-slate-600">Loading topics...</p></div>
          ) : error ? (
            <div className="text-center py-12 text-red-600"><p>Error: {error}</p></div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12 text-slate-500"><p>No related topics found.</p><p className="text-sm mt-2">Add 'related_topics' to your products' SEO info to see opportunities.</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead className="w-[50px]"></TableHead><TableHead className="w-[50px]">Rank</TableHead><TableHead>Topic</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right">Product Count</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {topics.map((topic, index) => (
                  <Fragment key={topic.topic}>
                    <TableRow className="cursor-pointer" onClick={() => setExpandedTopic(expandedTopic === topic.topic ? null : topic.topic)}>
                      <TableCell><Button variant="ghost" size="sm" className="pointer-events-none">{expandedTopic === topic.topic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</Button></TableCell>
                      <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-800">{topic.topic}</TableCell>
                      <TableCell className="text-center">{topic.status === 'completed' ? <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge> : <Badge variant="secondary"><Circle className="mr-1 h-3 w-3" />Pending</Badge>}</TableCell>
                      <TableCell className="text-right"><Badge variant="outline">{topic.count} products</Badge></TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleGenerateBrief(topic); }}>
                          <Bot className="mr-2 h-4 w-4" />
                          Generate Brief
                        </Button>
                        <Dialog open={isLinkModalOpen && selectedTopic?.topic === topic.topic} onOpenChange={(isOpen) => { if (!isOpen) setSelectedTopic(null); setIsLinkModalOpen(isOpen); }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); setIsLinkModalOpen(true); }}><Link2 className="mr-2 h-4 w-4" />Link Post</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Link Blog Post to "{selectedTopic?.topic}"</DialogTitle></DialogHeader>
                            <Command>
                              <CommandInput placeholder="Search blog posts..." />
                              <CommandEmpty>No blog posts found.</CommandEmpty>
                              <CommandGroup>
                                {blogPosts.filter(p => !topic.linked_blog_posts.some(lp => lp.id === p.id)).map((post) => (
                                  <CommandItem key={post.id} onSelect={() => handleLinkBlogPost(post.id)}>{post.title}</CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                    {expandedTopic === topic.topic && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="p-4 bg-slate-50 rounded-md">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Related Products:</h4>
                                <ul className="space-y-1 list-disc list-inside">
                                  {topic.products.map(product => (<li key={product.id}><Link href={`/products/${product.slug}`} className="text-blue-600 hover:underline">{product.name}</Link></li>))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Linked Blog Posts:</h4>
                                {topic.linked_blog_posts.length > 0 ? (
                                  <ul className="space-y-1 list-disc list-inside">
                                    {topic.linked_blog_posts.map(post => (
                                      <li key={post.id} className="flex items-center justify-between">
                                        <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">{post.title}</Link>
                                        <Button variant="ghost" size="sm" onClick={() => handleUnlinkBlogPost(topic.topic, post.id)}><X className="h-4 w-4" /></Button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (<p className="text-sm text-slate-500">No blog posts linked yet.</p>)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isBriefModalOpen} onOpenChange={setIsBriefModalOpen}>
        <DialogContent className="max-w-4xl h-5/6 flex flex-col">
          <DialogHeader>
            <DialogTitle>AI Content Brief for "{selectedTopic?.topic}"</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
            {isBriefLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                <p className="ml-4 text-slate-600">Generating brief...</p>
              </div>
            ) : (
              <Textarea readOnly value={generatedBrief} className="w-full h-full text-xs font-mono" />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={copyToClipboard} disabled={isBriefLoading}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
