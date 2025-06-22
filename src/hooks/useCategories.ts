import { useState, useEffect, useCallback } from 'react';
import { 
  getAllCategories, 
  getCategoriesByType, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  searchCategories,
  type Category 
} from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

interface UseCategoriesOptions {
  type?: 'product' | 'blog';
  autoLoad?: boolean;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<Category | null>;
  update: (id: number, data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) => Promise<Category | null>;
  remove: (id: number) => Promise<boolean>;
  search: (term: string) => Promise<Category[]>;
}

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const { type, autoLoad = true } = options;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Função para carregar categorias
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data: Category[];
      
      if (type) {
        data = await getCategoriesByType(type);
      } else {
        data = await getAllCategories();
      }
      
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [type, toast]);

  // Função para criar categoria
  const create = useCallback(async (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newCategory = await createCategory(data);
      
      // Adicionar à lista local
      setCategories(prev => [...prev, newCategory]);
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
      
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Função para atualizar categoria
  const update = useCallback(async (id: number, data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCategory = await updateCategory(id, data);
      
      // Atualizar na lista local
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updatedCategory : cat
      ));
      
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
      
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Função para deletar categoria
  const remove = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteCategory(id);
      
      // Remover da lista local
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir categoria';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Função para buscar categorias
  const search = useCallback(async (term: string): Promise<Category[]> => {
    try {
      return await searchCategories(term, type);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar categorias';
      setError(errorMessage);
      return [];
    }
  }, [type]);

  // Função para recarregar dados
  const refresh = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  // Carregar dados automaticamente
  useEffect(() => {
    if (autoLoad) {
      loadCategories();
    }
  }, [loadCategories, autoLoad]);

  return {
    categories,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    search,
  };
};

// Hook específico para categorias de produtos
export const useProductCategories = () => {
  return useCategories({ type: 'product' });
};

// Hook específico para categorias de blog
export const useBlogCategories = () => {
  return useCategories({ type: 'blog' });
}; 