"use client";

import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export default function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState(''); // Stores recognized voice input
  const [recognizedText, setRecognizedText] = useState(''); // Final stored value after recognition
  const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false; // Stop listening after the user stops speaking
    recognition.interimResults = true; // Show interim results while the user is speaking
    recognition.lang = 'en-US'; // Set language

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setSearchText(transcript); // Update with interim or final result
    };

    recognition.onend = () => {
      setIsListening(false); // Automatically stop listening
      setRecognizedText(searchText); // Store final value in state
      setSearchText(''); // Clear the search input so the user can start again
    };
  }, [recognition, searchText]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop(); // Stop recognition
    } else {
      recognition.start(); // Start recognition
    }
    setIsListening(!isListening);
  };
console.log(recognizedText)
console.log(recognition)
  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Mic className="h-6 w-6 text-[#F04F5F]" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col items-center justify-center h-[300px] p-4 ">
          <Button
            size="lg"
            variant="ghost"
            className={`rounded-full p-8 ${
              isListening ? ' text-[#F04F5F]' : 'bg-white text-[#F04F5F]'
            }`}
            onClick={toggleListening}
          >
            <Mic className={`h-12 w-12 text-[#F04F5F] ${isListening ? 'animate-pulse' : ''}`} />
            <span className="sr-only">
              {isListening ? 'Stop listening' : 'Start listening'}
            </span>
          </Button>
          <div className="mt-6 text-center">
            {isListening ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">Listening...</p>
                <p className="text-sm text-gray-500">Speak now</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-pink-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700">Tap mic to search</p>
                {recognizedText && (
                  <p className="mt-2 text-sm text-gray-500">
                    Recognized Text: {recognizedText}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
