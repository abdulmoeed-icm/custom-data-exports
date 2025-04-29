
import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Custom Data Exports
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Export your data in any format. Customize fields, preview results, and save templates for future use.
            </p>
            <div className="mt-10">
              <Link to="/export">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Customize Exports</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    Select and rename fields to include in your exports. Drag and drop to reorder them.
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Multiple Formats</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    Export your data in CSV, PDF, XLS, or XML formats to meet your specific needs.
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Save Templates</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    Save your export configurations as templates to reuse them later.
                  </div>
                </div>
              </div>
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
