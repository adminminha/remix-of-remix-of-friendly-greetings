import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Code, Undo2, Plus, Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeGenerated?: string;
}
interface ChatInterfaceProps {
  projectId: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onUndo?: (messageId: string) => void;
  // Optional resolver to fetch persisted code after refresh (from Dev Mode file list)
  getFileContent?: (filePath: string) => string | null;
}
const suggestions = [{
  icon: Sparkles,
  text: 'হিরো সেকশন',
  prompt: 'একটা সুন্দর হিরো সেকশন বানাও gradient background দিয়ে'
}, {
  icon: Code,
  text: 'Features গ্রিড',
  prompt: 'Create a features section with 3 cards in a grid layout'
}, {
  icon: Sparkles,
  text: 'Contact ফর্ম',
  prompt: 'Add a contact form with name, email, and message fields'
}, {
  icon: Sparkles,
  text: 'Navigation',
  prompt: 'Create a responsive navigation bar with logo and links'
}];
const ChatInterface = ({
  projectId,
  messages,
  onSendMessage,
  isLoading = false,
  onUndo,
  getFileContent
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [viewCodeDialog, setViewCodeDialog] = useState<{
    open: boolean;
    code: string;
  }>({
    open: false,
    code: ''
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleSuggestionClick = (prompt: string) => {
    onSendMessage(prompt);
  };
  const handleViewCode = (message: Message) => {
    // Prefer stored/generated code; after refresh codeGenerated won't exist,
    // so try to resolve from a file path included in the assistant message.
    const pathMatch = message.content.match(/(src\/[^\s]+\.(?:tsx|ts|jsx|js|css|json|md|html))/);
    const resolved = pathMatch?.[1] ? getFileContent?.(pathMatch[1]) : null;
    const code = message.codeGenerated || resolved || `// Code not available for this message.
// Tip: generate again, or open Dev Mode and select a file.
`;
    setViewCodeDialog({
      open: true,
      code
    });
  };
  const handleUndo = (messageId: string) => {
    onUndo?.(messageId);
  };
  return <div className="flex flex-col h-full bg-background">
      {/* Header */}
      

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI দিয়ে Building শুরু করুন</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                আপনি কি বানাতে চান বলুন, আমি সাহায্য করব
              </p>
              
              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, i) => <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(suggestion.prompt)} className="gap-2">
                    <suggestion.icon className="h-3.5 w-3.5" />
                    {suggestion.text}
                  </Button>)}
              </div>
            </div> : <AnimatePresence>
              {messages.map(message => <motion.div key={message.id} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '')}>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground')}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn('flex flex-col gap-1 max-w-[80%]', message.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn('rounded-2xl px-4 py-2.5', message.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-md' : 'bg-muted rounded-tl-md')}>
                      {message.role === 'assistant' ? <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div> : <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
                    </div>
                    {message.role === 'assistant' && <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-primary" onClick={() => handleViewCode(message)}>
                          <Code className="h-3 w-3 mr-1" />
                          View Code
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-destructive" onClick={() => handleUndo(message.id)}>
                          <Undo2 className="h-3 w-3 mr-1" />
                          Undo
                        </Button>
                      </div>}
                    
                  </div>
                </motion.div>)}
            </AnimatePresence>}

          {/* Loading indicator */}
          {isLoading && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{
                animationDelay: '0ms'
              }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{
                animationDelay: '150ms'
              }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{
                animationDelay: '300ms'
              }} />
                </div>
              </div>
            </motion.div>}
        </div>
      </ScrollArea>

      {/* Lovable-style Input Area */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit}>
          <div className="relative bg-muted/50 rounded-xl border border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask Tota AI..." className="w-full bg-transparent resize-none border-0 focus:ring-0 focus:outline-none p-4 pr-14 text-sm min-h-[56px] max-h-32 placeholder:text-muted-foreground" rows={1} />
            
            {/* Bottom bar with buttons */}
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Attach</span>
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Visual edits</span>
                </Button>
              </div>
              
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
        
        {/* Quick suggestions when messages exist */}
        {messages.length > 0}
      </div>

      {/* View Code Dialog */}
      <Dialog open={viewCodeDialog.open} onOpenChange={open => setViewCodeDialog({
      ...viewCodeDialog,
      open
    })}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Generated Code</DialogTitle>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[60vh]">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {viewCodeDialog.code}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default ChatInterface;