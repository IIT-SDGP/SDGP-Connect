import { useState } from "react";

export interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const sanitizeInput = (input: string): { isValid: boolean; sanitized: string } => {
  const lowercaseInput = input.toLowerCase();
  
  const suspiciousPatterns = [
    // Role override attempts
    'disregard', 'ignore', 'forget', 'override', 'replace', 'bypass',
    'you are now', 'you are a', 'act as', 'pretend to be', 'roleplay as',
    'system:', 'assistant:', 'user:', 'role:', 'prompt:', 'ai:',
    
    // Instruction manipulation
    'forget previous', 'ignore previous', 'new instructions', 'new role',
    'change your', 'breaking character', 'jailbreak', 'prompt injection',
    'system prompt', 'instructions:', 'developer mode', 'admin mode',
    'override instructions', 'ignore system', 'bypass system',
    
    // AI-specific manipulation attempts
    'simulate', 'hypothetically', 'what if you were', 'imagine you are',
    'in this scenario', 'for this conversation', 'temporarily act',
    'pretend that', 'assume you are', 'play the role',
    
    // Code injection attempts
    'execute', 'run code', 'eval(', 'function(', 'javascript:',
    'python code', 'write code', 'script', 'command', 'shell',
    '<script>', 'document.', 'window.', 'console.',
    
    // Meta-instruction attempts
    'end of instructions', 'new prompt', 'prompt ends', 'system message',
    'hidden instructions', 'secret prompt', 'internal prompt',
    'break out of', 'escape from', 'step outside',
    
    // Direct attempts to change behavior
    'stop being', 'dont be', 'stop acting', 'break character',
    'switch to', 'transform into', 'become a', 'turn into'
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    lowercaseInput.includes(pattern)
  );
  
  const hasPromptStructure = /^\s*(system|user|assistant|human|ai)\s*[:]/i.test(input);
  
  const hasExcessiveNewlines = (input.match(/\n{3,}/g) || []).length > 0;
  
  const isTooLong = input.length > 2000;
  
  const specialCharCount = (input.match(/[^a-zA-Z0-9\s.,!?\-'"]/g) || []).length;
  const specialCharRatio = specialCharCount / input.length;
  const hasExcessiveSpecialChars = specialCharRatio > 0.3 && input.length > 20;
  
  const hasRepeatedChars = /(.)\1{10,}/.test(input);
  
  const hasBase64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/.test(input) && input.length > 50;
  
  const hasInstructionTags = /<[^>]*instructions?[^>]*>/i.test(input) || 
                            /<[^>]*prompt[^>]*>/i.test(input) ||
                            /<[^>]*system[^>]*>/i.test(input);
  
  const hasUnicodeManipulation = /[\u200B-\u200D\uFEFF]/.test(input);
  
  if (hasSuspiciousContent || hasPromptStructure || hasExcessiveNewlines || 
      isTooLong || hasExcessiveSpecialChars || hasRepeatedChars || 
      hasBase64Pattern || hasInstructionTags || hasUnicodeManipulation) {
    return { 
      isValid: false, 
      sanitized: "Good try, better luck next time! 😎 Psycode Lab's products don't break so easily. For genuine support, contact support@sdgp.lk" 
    };
  }
  
  // Basic HTML/script sanitization for valid inputs
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
  
  // Final length check after sanitization
  if (sanitized.length === 0) {
    return { 
      isValid: false, 
      sanitized: "I didn't understand that. Please ask me about SDGP.lk features or contact support@sdgp.lk for help." 
    };
  }
  
  return { isValid: true, sanitized };
};

// Additional function to validate AI responses
const validateAIResponse = (response: string): string => {
  const lowercaseResponse = response.toLowerCase();
  
  // Check if AI response contains signs it might have been compromised
  const compromiseIndicators = [
    'i am now', 'acting as', 'roleplaying', 'pretending to be',
    'instructions received', 'switching to', 'new role activated',
    'developer mode', 'jailbreak successful', 'system override'
  ];
  
  const isCompromised = compromiseIndicators.some(indicator => 
    lowercaseResponse.includes(indicator)
  );
  
  if (isCompromised) {
    return "I apologize, but I encountered an error. Please contact support@sdgp.lk for assistance.";
  }
  
  return response;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      content: "👋 Hi! I'm the SDGP AI assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showThink, setShowThink] = useState(false);

  const sendMessage = async (input: string) => {
    setIsLoading(true);
    
    // Sanitize the input first
    const { isValid, sanitized } = sanitizeInput(input);
    
    setMessages((prev) => {
      // Find the max id and increment for unique keys
      const maxId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) : 0;
      return [
        ...prev,
        { id: maxId + 1, content: input, sender: "user" },
      ];
    });

    // If input is suspicious, respond immediately without calling API
    if (!isValid) {
      setMessages((prev) => {
        const maxId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) : 0;
        return [
          ...prev,
          { id: maxId + 1, content: sanitized, sender: "ai" },
        ];
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ 
              role: m.sender === "user" ? "user" : "assistant", 
              content: m.content 
            })),
            { role: "user", content: sanitized }, // Send sanitized input
          ],
        }),
      });

      const data = await res.json();
      
      // Validate and sanitize AI response
      const rawResponse = data.choices?.[0]?.message?.content || "(No response)";
      const validatedResponse = validateAIResponse(rawResponse);
      
      setMessages((prev) => {
        // Always increment max id for AI message
        const maxId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) : 0;
        return [
          ...prev,
          { id: maxId + 1, content: validatedResponse, sender: "ai" },
        ];
      });
    } catch (e) {
      setMessages((prev) => {
        const maxId = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) : 0;
        return [
          ...prev,
          { id: maxId + 1, content: "Error: Could not get response.", sender: "ai" },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, showThink, setShowThink };
}