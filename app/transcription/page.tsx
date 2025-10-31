"use client";

import { AppLayout } from "../components/app-layout";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import TranscriptionIcon from "../../public/trans-icon.svg";
import {
  FaMicrophone,
  FaStop,
  FaUpload,
  FaCopy,
  FaDownload,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), {
  ssr: false
});

// Waveform visualization component
const WaveformVisualizer = ({ isRecording }: { isRecording: boolean }) => {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    if (!isRecording) {
      setHeights([]);
      return;
    }

    const interval = setInterval(() => {
      const newHeights = Array.from({ length: 30 }, () =>
        Math.random() * 40 + 10
      );
      setHeights(newHeights);
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-end justify-center gap-1 h-16 mb-4">
      {heights.length > 0 ? (
        heights.map((height, idx) => (
          <div
            key={idx}
            className="w-1 bg-[#2C7C9D] rounded-t animate-pulse"
            style={{ height: `${height}%` }}
          />
        ))
      ) : (
        <div className="text-gray-500 text-sm">Ready to record</div>
      )}
    </div>
  );
};

export default function TranscriptionPage() {
  // Separate recording states for transcription and translation
  const [isRecordingTranscription, setIsRecordingTranscription] = useState(false);
  const [isRecordingTranslation, setIsRecordingTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBlobTranslation, setAudioBlobTranslation] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("yoruba");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [textTranslation, setTextTranslation] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedTranscript, setUploadedTranscript] = useState("");
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [audioSourceTranslation, setAudioSourceTranslation] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDownloadMenu1, setShowDownloadMenu1] = useState(false);
  const [showDownloadMenu2, setShowDownloadMenu2] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaRecorderTranslationRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTranslationRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunksTranslationRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const streamTranslationRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async (forTranslation = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      if (forTranslation) {
        mediaRecorderTranslationRef.current = mediaRecorder;
        chunksTranslationRef.current = [];
        streamTranslationRef.current = stream;
        setIsRecordingTranslation(true);
      } else {
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        streamRef.current = stream;
        setIsRecordingTranscription(true);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          if (forTranslation) {
            chunksTranslationRef.current.push(event.data);
          } else {
            chunksRef.current.push(event.data);
          }
        }
      };

      mediaRecorder.onstop = async () => {
        if (forTranslation) {
          const blob = new Blob(chunksTranslationRef.current, { type: "audio/webm" });
          setAudioBlobTranslation(blob);
          const url = URL.createObjectURL(blob);
          setAudioSourceTranslation(url);
          // Automatically transcribe the recording
          await transcribeAudio(blob, true);
        } else {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioSource(url);
          // Automatically transcribe the recording
          await transcribeAudio(blob, false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingTime(0);

      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please check your microphone permissions.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const stopRecording = (forTranslation = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (forTranslation) {
      if (mediaRecorderTranslationRef.current && isRecordingTranslation) {
        mediaRecorderTranslationRef.current.stop();
        setIsRecordingTranslation(false);
      }
    } else {
      if (mediaRecorderRef.current && isRecordingTranscription) {
        mediaRecorderRef.current.stop();
        setIsRecordingTranscription(false);
      }
    }

    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioSource(url);

      // Automatically transcribe the uploaded file
      setIsProcessing(true);

      try {
        const formData = new FormData();
        formData.append('audio', file);

        // Call the transcription API
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
        }

        const data = await response.json();
        const transcriptText = data.transcript || 'No speech detected in the audio.';

        setTranscript(transcriptText);
        setUploadedTranscript(transcriptText);

        toast.success("Upload and transcription completed!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } catch (error: any) {
        console.error('Transcription error:', error);
        toast.error(error.message || "Transcription failed. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePlayPause = (forTranslation = false) => {
    const audioElement = forTranslation ? audioTranslationRef.current : audioRef.current;
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
      setIsPlaying(!audioElement.paused);
    }
  };

  const transcribeAudio = async (audioBlob: Blob, forTranslation = false) => {
    setIsProcessing(true);

    try {
      // Prepare form data for API call
      const formData = new FormData();

      // Determine the file extension and mime type
      const fileExtension = audioBlob.type.includes('webm') ? 'webm' :
        audioBlob.type.includes('mp3') ? 'mp3' :
          audioBlob.type.includes('wav') ? 'wav' : 'webm';

      const fileName = `recording.${fileExtension}`;
      formData.append('audio', audioBlob, fileName);

      // Call the transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      const transcriptText = data.transcript || 'No speech detected in the audio.';

      if (forTranslation) {
        setOriginalTranscript(transcriptText);
      } else {
        setTranscript(transcriptText);
      }

      toast.success("Transcription completed!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast.error(error.message || "Transcription failed. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const translateAudio = async () => {
    if (!originalTranscript && !transcript) {
      toast.error("Please transcribe audio first", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const textToTranslate = originalTranscript || transcript;

      // Call the translation API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage: targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTranslation(data.translation || textToTranslate);

      toast.success("Translation completed!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(error.message || "Translation failed. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const translateText = async () => {
    if (!textToTranslate.trim()) {
      toast.error("Please enter text to translate", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call the translation API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage: targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTextTranslation(data.translation || textToTranslate);

      toast.success("Translation completed!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(error.message || "Translation failed. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const downloadText = (text: string, filename: string, format: 'txt' | 'doc' | 'pdf' = 'txt') => {
    let blob: Blob;
    let mimeType: string;

    switch (format) {
      case 'txt':
        blob = new Blob([text], { type: 'text/plain' });
        mimeType = 'text/plain';
        break;
      case 'doc':
        // Create a simple Word-like document
        const htmlContent = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>Document</title>
          </head>
          <body>
            <p>${text.replace(/\n/g, '</p><p>')}</p>
          </body>
          </html>
        `;
        blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        filename = filename.replace('.txt', '.doc');
        mimeType = 'application/msword';
        break;
      case 'pdf':
        // For PDF, we'll just create a text file since we don't have a PDF library
        // In production, you'd use a library like jsPDF or PDFKit
        blob = new Blob([text], { type: 'text/plain' });
        filename = filename.replace('.txt', '.pdf');
        mimeType = 'text/plain';
        break;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (streamTranslationRef.current) {
        streamTranslationRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.download-dropdown')) {
        setShowDownloadMenu1(false);
        setShowDownloadMenu2(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <AppLayout>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-b from-[#131E36] via-[#1a2a4a] to-[#131E36]">
        {/* Hero Section */}
        <section className="px-2 py-32 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-slate-700 p-6 rounded-full">
                <FaMicrophone className="text-2xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center md:text-5xl lg:text-6xl mb-6">
              Transcription & Translation Tool
            </h1>
            <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
              Record or upload for instant AI-powered transcription and translation into Hausa, Igbo, and Yoruba.
            </p>
          </div>
        </section>

        {/* Transcribe Audio Section */}
        <section className="px-2 py-20 text-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Transcribe Audio</h2>
            <p className="text-center text-gray-300 mb-8">
              Record your voice or upload an audio/video file for transcription.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Recording Section */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <FaMicrophone className="text-[#2C7C9D]" />
                  Record Your Voice
                </h3>

                <div className="bg-slate-800 rounded-xl p-6 mb-6">
                  <WaveformVisualizer isRecording={isRecordingTranscription} />
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-3xl font-mono">
                      {isRecordingTranscription || isRecordingTranslation ? formatTime(recordingTime) : "00:00"}
                    </div>
                    <div className="flex gap-4">
                      {!isRecordingTranscription ? (
                        <button
                          onClick={() => startRecording(false)}
                          disabled={isProcessing}
                          className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors disabled:opacity-50"
                        >
                          <FaMicrophone className="text-2xl" />
                        </button>
                      ) : (
                        <button
                          onClick={() => stopRecording(false)}
                          className="bg-slate-600 hover:bg-slate-700 p-4 rounded-full transition-colors"
                        >
                          <FaStop className="text-2xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                {audioSource && (
                  <div className="bg-slate-800 rounded-xl p-4 mb-6">
                    <audio
                      ref={audioRef}
                      src={audioSource}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handlePlayPause(false)}
                        className="bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 p-3 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <FaPause className="text-xl" />
                        ) : (
                          <FaPlay className="text-xl" />
                        )}
                      </button>
                      <span className="text-sm text-gray-300">Audio ready</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <FaUpload className="text-[#2C7C9D]" />
                  Upload Audio/Video File
                </h3>

                <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-[#2C7C9D] transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="audio/*,video/*"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaUpload className="text-4xl mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 mb-2">
                      Drag & drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: WAV, MP3, OGG, FLAC, AAC, M4A, WEBM, MP4, AVI, MOV, WMV, FLV, MKV
                    </p>
                  </label>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-4 bg-slate-800 rounded-xl">
                    <p className="text-sm text-gray-300">
                      File: {uploadedFile.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Display */}
            <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <h3 className="text-2xl font-semibold">Recording Transcript</h3>
                {transcript && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(transcript)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy
                    </button>
                    <div className="relative inline-block download-dropdown">
                      <button
                        onClick={() => setShowDownloadMenu1(!showDownloadMenu1)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <FaDownload /> Download
                      </button>
                      {showDownloadMenu1 && (
                        <div className="absolute right-0 mt-2 bg-slate-700 rounded-lg overflow-hidden min-w-[120px] z-10">
                          <button
                            onClick={() => {
                              downloadText(transcript, "transcript.txt", "txt");
                              setShowDownloadMenu1(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors"
                          >
                            .txt
                          </button>
                          <button
                            onClick={() => {
                              downloadText(transcript, "transcript.doc", "doc");
                              setShowDownloadMenu1(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors"
                          >
                            .doc
                          </button>
                          <button
                            onClick={() => {
                              downloadText(transcript, "transcript.pdf", "pdf");
                              setShowDownloadMenu1(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors"
                          >
                            .pdf
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-800 rounded-xl p-6 min-h-[200px]">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {transcript || "Recording transcript will appear here automatically after you stop recording"}
                </p>
              </div>
            </div>

            {/* Uploaded Transcript Display */}
            <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <h3 className="text-2xl font-semibold">Upload Transcript</h3>
                {uploadedTranscript && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(uploadedTranscript)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy
                    </button>
                    <div className="relative inline-block download-dropdown">
                      <button
                        onClick={() => setShowDownloadMenu2(!showDownloadMenu2)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <FaDownload /> Download
                      </button>
                      {showDownloadMenu2 && (
                        <div className="absolute right-0 mt-2 bg-slate-700 rounded-lg overflow-hidden min-w-[120px] z-10">
                          <button
                            onClick={() => {
                              downloadText(uploadedTranscript, "uploaded-transcript.txt", "txt");
                              setShowDownloadMenu2(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors"
                          >
                            .txt
                          </button>
                          <button
                            onClick={() => {
                              downloadText(uploadedTranscript, "uploaded-transcript.doc", "doc");
                              setShowDownloadMenu2(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors"
                          >
                            .doc
                          </button>
                          <button
                            onClick={() => {
                              downloadText(uploadedTranscript, "uploaded-transcript.pdf", "pdf");
                              setShowDownloadMenu2(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors"
                          >
                            .pdf
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-800 rounded-xl p-6 min-h-[200px]">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {uploadedTranscript || "Upload transcript will appear here automatically when you upload a file"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Translation Section */}
        <section className="px-2 py-20 text-white bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Audio Translation</h2>
            <p className="text-center text-gray-300 mb-8">
              Record your voice or upload an audio file and get it translated to another language.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Record for Translation</h3>
                <div className="bg-slate-800 rounded-xl p-6 mb-6">
                  <WaveformVisualizer isRecording={isRecordingTranslation} />
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-3xl font-mono">
                      {isRecordingTranslation ? formatTime(recordingTime) : "00:00"}
                    </div>
                    <div className="flex gap-4">
                      {!isRecordingTranslation ? (
                        <button
                          onClick={() => startRecording(true)}
                          disabled={isProcessing}
                          className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors disabled:opacity-50"
                        >
                          <FaMicrophone className="text-2xl" />
                        </button>
                      ) : (
                        <button
                          onClick={() => stopRecording(true)}
                          className="bg-slate-600 hover:bg-slate-700 p-4 rounded-full transition-colors"
                        >
                          <FaStop className="text-2xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {audioSourceTranslation && (
                  <div className="bg-slate-800 rounded-xl p-4 mb-6">
                    <audio
                      ref={audioTranslationRef}
                      src={audioSourceTranslation}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handlePlayPause(true)}
                        className="bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 p-3 rounded-full transition-colors"
                      >
                        {isPlaying && !audioTranslationRef.current?.paused ? (
                          <FaPause className="text-xl" />
                        ) : (
                          <FaPlay className="text-xl" />
                        )}
                      </button>
                      <span className="text-sm text-gray-300">Audio ready</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Upload for Translation</h3>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-[#2C7C9D] transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file-upload-translation"
                    className="hidden"
                    accept="audio/*,video/*"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload-translation" className="cursor-pointer">
                    <FaUpload className="text-4xl mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 mb-2">Drag & drop or click to browse</p>
                    <p className="text-sm text-gray-500">
                      Supported formats: WAV, MP3, OGG, FLAC, AAC, M4A, WEBM, MP4, AVI, MOV, WMV, FLV, MKV
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="text-lg font-semibold">Target Language:</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="flex-1 bg-slate-800 text-white px-6 py-3 rounded-lg border border-gray-600 focus:border-[#2C7C9D] focus:outline-none"
                >
                  <option value="yoruba">Yoruba</option>
                  <option value="hausa">Hausa</option>
                  <option value="igbo">Igbo</option>
                </select>
                <button
                  onClick={translateAudio}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  {isProcessing ? "Translating..." : "Translate Audio"}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Original Audio Transcript</h3>
                  {originalTranscript && (
                    <button
                      onClick={() => copyToClipboard(originalTranscript)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy
                    </button>
                  )}
                </div>
                <div className="bg-slate-800 rounded-xl p-6 min-h-[200px]">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {originalTranscript || "Original transcript will appear here"}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Audio Translation</h3>
                  {translation && (
                    <button
                      onClick={() => copyToClipboard(translation)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy
                    </button>
                  )}
                </div>
                <div className="bg-slate-800 rounded-xl p-6 min-h-[200px]">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {translation || "Translation will appear here after translation"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Text Translation Section */}
        <section className="px-2 py-20 text-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Text Translation</h2>
            <p className="text-center text-gray-300 mb-8">
              Enter English text and translate it to one of the supported languages.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Enter English Text</h3>
                </div>
                <textarea
                  value={textToTranslate}
                  onChange={(e) => setTextToTranslate(e.target.value)}
                  placeholder="Type or paste your English text here..."
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#2C7C9D] focus:outline-none min-h-[200px] resize-none"
                />
                <div className="flex gap-2 mt-4">
                  {textToTranslate && (
                    <button
                      onClick={() => copyToClipboard(textToTranslate)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Text Translation</h3>
                  {textTranslation && (
                    <button
                      onClick={() => copyToClipboard(textTranslation)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy
                    </button>
                  )}
                </div>
                <div className="bg-slate-800 rounded-xl p-6 min-h-[200px]">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {textTranslation || "Translation will appear here after translation"}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  {textTranslation && (
                    <button
                      onClick={() => copyToClipboard(textTranslation)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors"
                    >
                      <FaCopy /> Copy Translation
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mt-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="text-lg font-semibold">Target Language:</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="flex-1 bg-slate-800 text-white px-6 py-3 rounded-lg border border-gray-600 focus:border-[#2C7C9D] focus:outline-none"
                >
                  <option value="yoruba">Yoruba</option>
                  <option value="hausa">Hausa</option>
                  <option value="igbo">Igbo</option>
                </select>
                <button
                  onClick={translateText}
                  disabled={isProcessing || !textToTranslate.trim()}
                  className="px-8 py-3 bg-[#2C7C9D] hover:bg-[#2C7C9D]/80 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Translating..." : "Translate Text"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

