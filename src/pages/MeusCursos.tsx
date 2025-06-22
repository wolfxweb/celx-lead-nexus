import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';

// Mock de dados de cursos do usuário
const userCourses = [
  {
    id: 1,
    courseId: 1,
    title: 'Curso de Automação com IA',
    coverImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=400&fit=crop',
    progress: 65,
    instructor: 'Carlos Silva'
  },
  {
    id: 2,
    courseId: 2,
    title: 'Curso de Desenvolvimento Web Full Stack',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d1469c9b?w=800&h=400&fit=crop',
    progress: 20,
    instructor: 'Carlos Silva'
  }
];

const MeusCursos = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Cursos</h1>
        <p className="text-lg text-gray-600 mt-2">Continue de onde parou e aprimore suas habilidades.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {userCourses.map(course => (
          <Link to={`/curso/${course.courseId}`} key={course.id}>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <AspectRatio ratio={16 / 9}>
                <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
              </AspectRatio>
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-semibold">{course.title}</CardTitle>
                <p className="text-sm text-gray-500 pt-2">Por {course.instructor}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={course.progress} className="w-full" />
                  <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MeusCursos; 