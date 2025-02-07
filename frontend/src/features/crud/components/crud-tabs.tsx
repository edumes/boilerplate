import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, House, PanelsTopLeft } from 'lucide-react';

export function CrudTabs() {

  return (
    <div className='flex gap-2'>
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="mb-3 h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
            <TabsTrigger
              value="tab-1"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              <House
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              <PanelsTopLeft
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Projects
              <Badge className="ms-1.5 min-w-5 bg-primary/15 px-1" variant="secondary">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              <Box
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Packages
              <Badge className="ms-1.5">New</Badge>
            </TabsTrigger>
          </TabsList>
          {/* <ScrollBar orientation="horizontal" /> */}
        </ScrollArea>
        <TabsContent value="tab-1">
          <p className="pt-1 text-center text-xs text-muted-foreground">Content for Tab 1</p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="pt-1 text-center text-xs text-muted-foreground">Content for Tab 2</p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="pt-1 text-center text-xs text-muted-foreground">Content for Tab 3</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
