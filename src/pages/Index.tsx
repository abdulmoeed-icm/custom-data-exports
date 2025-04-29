
import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { exportTemplates } from '@/data/export-templates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Custom Data Exports
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Export your data in any format. Customize fields, preview results, and save templates for future use.
            </p>
            <div className="mt-10">
              <Link to="/export">
                <Button size="lg" className="button-hover-effect px-8 py-6 text-base">
                  Get Started <ChevronRight className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-accent hover:border-primary/30 transition-colors">
                <div className="px-6 py-8">
                  <h3 className="text-lg font-medium text-gray-900">Customize Exports</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    Select and rename fields to include in your exports. Drag and drop to reorder them.
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-accent hover:border-primary/30 transition-colors">
                <div className="px-6 py-8">
                  <h3 className="text-lg font-medium text-gray-900">Multiple Formats</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    Export your data in CSV, PDF, XLS, or XML formats to meet your specific needs.
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-accent hover:border-primary/30 transition-colors">
                <div className="px-6 py-8">
                  <h3 className="text-lg font-medium text-gray-900">Save Templates</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    Save your export configurations as templates to reuse them later.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Templates Carousel */}
          <div className="mt-28 mb-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Saved Templates</h2>
              <p className="mt-3 text-lg text-gray-500">
                Quick access to your recently saved export configurations
              </p>
            </div>
            
            <div className="relative px-12">
              <Carousel className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {exportTemplates.map((template) => (
                    <CarouselItem key={template.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="border border-border shadow-md hover:shadow-lg hover:border-primary/30 transition-all mx-2 h-full">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {template.entityId}
                            </Badge>
                          </div>
                          <CardDescription className="text-muted-foreground">
                            {format(template.createdAt, 'MMM d, yyyy')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">
                            {template.fields.length} fields selected
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {template.fields.slice(0, 3).map((field) => (
                              <Badge key={field.id} variant="secondary" className="text-xs">
                                {field.displayName}
                              </Badge>
                            ))}
                            {template.fields.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.fields.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link 
                            to={`/export/${template.entityId}?template=${template.id}`} 
                            className="w-full"
                          >
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full button-hover-effect justify-center"
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              Use Template
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Custom Data Exports. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
