import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordSearchGrid } from './WordSearchGrid';
import { WordList } from './WordList';
import { generateWordSearch, PuzzleData } from '@/lib/wordSearchGenerator';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Printer, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Grid3X3,
  BookOpen,
  Plus,
  X
} from 'lucide-react';

const GRID_SIZES = [10, 12, 15, 18, 20];

export const WordSearchGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [wordsInput, setWordsInput] = useState('');
  const [gridSize, setGridSize] = useState(15);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = useCallback(() => {
    const words = wordsInput
      .split(/[\n,;]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (words.length === 0) {
      toast.error('Adicione pelo menos uma palavra para gerar o caça-palavras!');
      return;
    }

    if (words.length > 20) {
      toast.warning('Muitas palavras! Usando apenas as 20 primeiras.');
      words.splice(20);
    }

    const longWords = words.filter((w) => w.length > gridSize);
    if (longWords.length > 0) {
      toast.warning(
        `Algumas palavras são maiores que a grade (${gridSize}). Elas serão ignoradas.`
      );
    }

    const newPuzzle = generateWordSearch(words, gridSize);
    setPuzzle(newPuzzle);
    setShowAnswers(false);

    if (newPuzzle.placements.length < words.length) {
      toast.info(
        `${newPuzzle.placements.length} de ${words.length} palavras foram colocadas na grade.`
      );
    } else {
      toast.success('Caça-palavras gerado com sucesso!');
    }
  }, [wordsInput, gridSize]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleReset = useCallback(() => {
    setPuzzle(null);
    setShowAnswers(false);
  }, []);

  const addSampleWords = useCallback(() => {
    const samples = [
      'NATUREZA, FLORESTA, ANIMAIS, PLANTAS, ARVORE',
      'MATEMATICA, NUMERO, SOMA, SUBTRACAO, DIVISAO',
      'HISTORIA, BRASIL, DESCOBRIMENTO, INDEPENDENCIA',
      'CIENCIAS, EXPERIMENTO, HIPOTESE, RESULTADO',
    ];
    const random = samples[Math.floor(Math.random() * samples.length)];
    setWordsInput(random);
    toast.success('Palavras de exemplo adicionadas!');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print gradient-hero py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Grid3X3 className="w-10 h-10 text-primary-foreground" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
              Gerador de Caça-Palavras
            </h1>
          </div>
          <p className="text-center text-primary-foreground/90 text-lg">
            Crie caça-palavras personalizados para seus alunos em segundos!
          </p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Controls Panel */}
          <div className="no-print space-y-6">
            <Card className="shadow-card animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Título do Caça-Palavras (opcional)
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Animais da Floresta"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Words Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="words" className="text-sm font-semibold">
                      Palavras
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addSampleWords}
                      className="h-7 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Exemplo
                    </Button>
                  </div>
                  <Textarea
                    id="words"
                    placeholder="Digite as palavras separadas por vírgula, ponto-e-vírgula ou uma por linha..."
                    value={wordsInput}
                    onChange={(e) => setWordsInput(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo de 20 palavras. Acentos serão removidos automaticamente.
                  </p>
                </div>

                {/* Grid Size */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Tamanho da Grade
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {GRID_SIZES.map((size) => (
                      <Button
                        key={size}
                        variant={gridSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGridSize(size)}
                        className="min-w-[50px]"
                      >
                        {size}x{size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <Sparkles className="w-5 h-5" />
                  Gerar Caça-Palavras
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            {puzzle && (
              <Card className="shadow-card animate-scale-in">
                <CardContent className="pt-6 space-y-3">
                  <Button
                    onClick={() => setShowAnswers(!showAnswers)}
                    variant="outline"
                    className="w-full"
                  >
                    {showAnswers ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Ocultar Respostas
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Mostrar Respostas
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handlePrint}
                    variant="warm"
                    className="w-full"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    className="w-full text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar e Recomeçar
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="min-h-[500px]">
            {puzzle ? (
              <div className="space-y-6 animate-fade-in">
                {/* Printable Area */}
                <div className="bg-card rounded-xl p-6 md:p-8 shadow-card">
                  {/* Title */}
                  {title && (
                    <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
                      {title}
                    </h2>
                  )}

                  {/* Grid */}
                  <div className="flex justify-center mb-6 overflow-x-auto">
                    <WordSearchGrid
                      puzzle={puzzle}
                      showAnswers={showAnswers}
                    />
                  </div>

                  {/* Word List */}
                  <WordList placements={puzzle.placements} />

                  {/* Instructions */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      Encontre todas as palavras escondidas na grade. Elas podem estar
                      na horizontal, vertical ou diagonal.
                    </p>
                  </div>

                  {/* Student Name Field */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">Nome:</span>
                    <div className="flex-1 border-b-2 border-dashed border-border h-6"></div>
                    <span className="text-sm font-medium text-foreground">Data:</span>
                    <div className="w-32 border-b-2 border-dashed border-border h-6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-muted/30 rounded-xl border-2 border-dashed border-border">
                <Grid3X3 className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Seu caça-palavras aparecerá aqui
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Adicione palavras e clique em "Gerar"
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print py-6 px-4 border-t border-border mt-8">
        <p className="text-center text-sm text-muted-foreground">
          Ferramenta gratuita para professores criarem atividades educativas
        </p>
      </footer>
    </div>
  );
};
