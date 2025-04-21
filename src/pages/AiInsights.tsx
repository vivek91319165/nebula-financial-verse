
import { useState } from "react";
import { Brain, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { useAiInsights } from "@/hooks/useAiInsights";
import { toast } from "sonner";

const AiInsights = () => {
  const { insights, isLoading, generateInsights, getChatResponse, markAsRead } = useAiInsights();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your Nebula Budget AI assistant. How can I help with your financial planning today?", sender: "ai" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { id: messages.length + 1, text: inputMessage, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    try {
      const response = await getChatResponse.mutateAsync(inputMessage);
      const aiMessage = { 
        id: messages.length + 2, 
        text: response.message, 
        sender: "ai" 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateInsights = () => {
    generateInsights.mutate();
  };

  const handleMarkAsRead = (insightId: string) => {
    markAsRead.mutate(insightId);
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">AI Insights</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-nebula-space-light border-nebula-orange/20 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-nebula-orange" />
                  Financial Insights
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-nebula-orange/20 text-nebula-orange"
                  onClick={handleGenerateInsights}
                  disabled={generateInsights.isPending}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generateInsights.isPending ? "Analyzing..." : "Generate Insights"}
                </Button>
              </div>

              <div className="space-y-4 h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-gray-400">Loading insights...</div>
                ) : insights && insights.length > 0 ? (
                  insights.map((insight: any) => (
                    <Card
                      key={insight.id}
                      className={`p-4 border ${
                        insight.is_read ? 'border-nebula-orange/10' : 'border-nebula-orange/30'
                      } hover:border-nebula-orange/50 transition-colors`}
                    >
                      <ul className="mb-2 list-disc list-inside text-gray-900 dark:text-gray-100">
                        {(insight.content || "")
                          .split('\n')
                          .filter((line: string) => line.trim() !== '')
                          .map((line: string, idx: number) => (
                            <li key={idx}>{line}</li>
                          ))}
                      </ul>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(insight.created_at).toLocaleDateString()}
                        </span>
                        {!insight.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-nebula-orange hover:text-nebula-orange-light"
                            onClick={() => handleMarkAsRead(insight.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-nebula-orange/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Insights Yet</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Generate your first AI-powered financial insights
                    </p>
                    <Button
                      onClick={handleGenerateInsights}
                      className="bg-nebula-orange hover:bg-nebula-orange-light"
                      disabled={generateInsights.isPending}
                    >
                      Generate Insights
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-nebula-space-light border-nebula-orange/20 h-full flex flex-col">
              <div className="p-4 border-b border-nebula-orange/20 flex items-center">
                <div className="w-8 h-8 bg-nebula-orange/20 rounded-full flex items-center justify-center mr-3">
                  <Brain className="h-4 w-4 text-nebula-orange" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Financial Assistant</h2>
                  <p className="text-xs text-gray-400">Powered by Groq API</p>
                </div>
              </div>

              <div className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[350px]">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-nebula-blue/20 text-white rounded-br-none'
                          : 'bg-nebula-orange/20 text-white rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-nebula-orange/20 text-white p-3 rounded-lg rounded-bl-none max-w-[80%]">
                      <div className="flex space-x-1 items-center">
                        <div className="w-2 h-2 bg-nebula-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-nebula-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-nebula-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-nebula-orange/20">
                <div className="flex space-x-2">
                  <Input
                    className="bg-nebula-space border-nebula-orange/20 placeholder-gray-500"
                    placeholder="Ask about your finances..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="bg-nebula-orange hover:bg-nebula-orange-light">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
                <div className="flex justify-center mt-3">
                  <div className="text-xs text-gray-500 flex space-x-3">
                    <button className="hover:text-gray-300">Generate new insights</button>
                    <button className="hover:text-gray-300">Analyze spending</button>
                    <button className="hover:text-gray-300">Investment advice</button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AiInsights;

