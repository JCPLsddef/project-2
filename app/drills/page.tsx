'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import Link from 'next/link';

function DrillsPage() {
  const [drills, setDrills] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrills();
  }, []);

  const loadDrills = async () => {
    const { data } = await supabase
      .from('drills')
      .select('*')
      .order('category');

    setDrills(data || []);
    setLoading(false);
  };

  const filteredDrills = drills.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(filteredDrills.map(d => d.category)));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-4">
            Bibliothèque d'Exercices
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un exercice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#2F6BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-xl font-bold text-[#0A1B3D] mb-3">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDrills
                    .filter(d => d.category === category)
                    .map(drill => (
                      <Link key={drill.id} href={`/drills/${drill.id}`}>
                        <Card className="premium-card hover:shadow-xl transition-shadow cursor-pointer h-full">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-[#0A1B3D]">{drill.name}</h3>
                            <Badge variant="outline">{drill.id}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{drill.goal}</p>
                          {drill.reps && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Reps:</span> {drill.reps}
                            </p>
                          )}
                          {drill.mode_tags && drill.mode_tags.length > 0 && (
                            <div className="mt-2 flex gap-1 flex-wrap">
                              {drill.mode_tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <DrillsPage />
    </AuthProvider>
  );
}
