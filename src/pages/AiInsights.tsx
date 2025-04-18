
import { useState } from "react";
import { Brain, MessageSquare, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

// Sample AI insights data
const sampleInsights = [
  {
    id: 1,
    title: "Reduce Food Expenses",
    description: "You've spent 15% more on food this month compared to your monthly average. Consider meal planning to reduce costs.",
    action: "View Food Expenses",
    actionLink: "#",
    category: "expense",
  },
  {
    id: 2,
    title: "Potential Savings Opportunity",
    description: "Based on your spending patterns, you could save $120/month by optimizing your subscription services.",
    action: "View Subscriptions",
    actionLink: "#",
    category: "saving",
  },
  {
    id: 3,
    title: "Upcoming Bill Alert",
    description: "Your electricity bill is due in 3 days. The estimated amount is $78.45 based on your usage pattern.",
    action: "Schedule Payment",
    actionLink: "#",
    category: "alert",
  },
  {
    id: 4,
    title: "Crypto Market Opportunity",
    description: "ETH price has dropped 5% in the last 24 hours. Based on your investment strategy, this might be a buying opportunity.",
    action: "View Details",
    actionLink: "#",
    category: "crypto",
  },
];

// Sample chat messages
const initialMessages = [
  { 
    id: 1, 
    text: "Hi there! I'm your Nebula Budget AI assistant. How can I help with your financial planning today?", 
    sender: "ai" 
  },
];

const AiInsights = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = { id: messages.length + 1, text: inputMessage, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "Based on your spending history, I recommend creating a separate savings account for your vacation fund. Would you like me to suggest an optimal monthly deposit amount?",
        "I've analyzed your recent transactions and noticed several recurring subscription payments. You could save approximately $35 per month by consolidating or canceling unused services.",
        "Your crypto investments have shown 12% growth this quarter. Based on market trends, this might be a good time to diversify with a small allocation to stablecoins.",
        "I notice your emergency fund is below the recommended 3-month expenses threshold. Would you like me to create a savings plan to build this back up?",
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage = { id: messages.length + 2, text: randomResponse, sender: "ai" };
      setMessages([...messages, userMessage, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle insights carousel navigation
  const nextInsight = () => {
    setCurrentInsightIndex((prev) => (prev === sampleInsights.length - 1 ? 0 : prev + 1));
  };

  const prevInsight = () => {
    setCurrentInsightIndex((prev) => (prev === 0 ? sampleInsights.length - 1 : prev - 1));
  };

  const categoryColors = {
    expense: "border-red-400 bg-red-500/10",
    saving: "border-green-400 bg-green-500/10",
    alert: "border-yellow-400 bg-yellow-500/10",
    crypto: "border-nebula-purple border-nebula-purple/20 bg-nebula-purple/10",
  };

  const categoryIcons = {
    expense: <ArrowUpRight className="h-4 w-4 text-red-400" />,
    saving: <ArrowUpRight className="h-4 w-4 text-green-400" />,
    alert: <ArrowUpRight className="h-4 w-4 text-yellow-400" />,
    crypto: <ArrowUpRight className="h-4 w-4 text-nebula-purple" />,
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">AI Insights</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* AI Insights Carousel */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-nebula-space-light border-nebula-orange/20 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-nebula-orange" />
                  Personalized Insights
                </h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={prevInsight}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={nextInsight}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="relative overflow-hidden h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInsightIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div className={`p-5 rounded-lg border ${categoryColors[sampleInsights[currentInsightIndex].category as keyof typeof categoryColors]} h-full flex flex-col`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                          Insight {currentInsightIndex + 1} of {sampleInsights.length}
                        </span>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: sampleInsights.length }).map((_, index) => (
                            <div 
                              key={index} 
                              className={`w-2 h-2 rounded-full ${
                                index === currentInsightIndex 
                                  ? "bg-nebula-orange" 
                                  : "bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {sampleInsights[currentInsightIndex].title}
                      </h3>
                      
                      <p className="text-gray-300 mb-6 flex-grow">
                        {sampleInsights[currentInsightIndex].description}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-auto border-nebula-orange/20 text-nebula-orange hover:text-nebula-orange-light"
                      >
                        <span>{sampleInsights[currentInsightIndex].action}</span>
                        {categoryIcons[sampleInsights[currentInsightIndex].category as keyof typeof categoryIcons]}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Card>
          </div>

          {/* AI Chat Interface */}
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
                    <button className="hover:text-gray-300">How to save more?</button>
                    <button className="hover:text-gray-300">Optimize my budget</button>
                    <button className="hover:text-gray-300">Crypto insights</button>
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
