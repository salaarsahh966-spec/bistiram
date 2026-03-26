import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Tag, 
  Instagram, 
  Hash, 
  Video, 
  FileText, 
  Palette, 
  Calendar, 
  DollarSign,
  Loader2,
  ChevronRight,
  Copy,
  Check,
  Linkedin,
  Twitter,
  Facebook,
  Image as ImageIcon,
  Download,
  Languages
} from 'lucide-react';
import { generateContentPack, generatePosterImage, ContentPack } from './services/gemini';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'twitter', label: 'Twitter (X)', icon: Twitter, color: 'text-black' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
];

const LANGUAGES = [
  'English', 'Hindi', 'Hinglish', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Spanish', 'French', 'German', 'Arabic', 'Chinese', 'Japanese'
];

export default function App() {
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [offer, setOffer] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [posterLoading, setPosterLoading] = useState(false);
  const [contentPack, setContentPack] = useState<ContentPack | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPosterUrl(null);
    try {
      const result = await generateContentPack(businessType, location, targetAudience, offer, selectedPlatforms, language);
      setContentPack(result);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePoster = async () => {
    if (!contentPack) return;
    setPosterLoading(true);
    try {
      const url = await generatePosterImage(contentPack.posterIdea.imagePrompt);
      setPosterUrl(url);
    } catch (error) {
      console.error('Error generating poster:', error);
      alert('Failed to generate poster image.');
    } finally {
      setPosterLoading(false);
    }
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SocialPack AI</h1>
          </div>
          <div className="hidden sm:block text-sm text-gray-500 font-medium">
            Multi-Platform Growth Strategist
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Input Details
              </h2>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Business Type</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      placeholder="e.g. Coffee Shop, Gym, Bakery"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      placeholder="e.g. Mumbai, New York, London"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Target Audience</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      placeholder="e.g. Gen Z, Busy Moms, Techies"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Offer (Optional)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      placeholder="e.g. 20% Off, Buy 1 Get 1"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Target Language</label>
                  <div className="relative">
                    <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none appearance-none"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Select Platforms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                          selectedPlatforms.includes(platform.id)
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <platform.icon className={`w-4 h-4 ${selectedPlatforms.includes(platform.id) ? platform.color : 'text-gray-400'}`} />
                        {platform.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || selectedPlatforms.length === 0}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Pack...
                    </>
                  ) : (
                    <>
                      Generate Content Pack
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!contentPack ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ready to grow?</h3>
                  <p className="text-gray-500 max-w-sm">
                    Select your platforms and fill in your business details to generate a custom content pack.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  {/* Brand Style */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Palette className="w-5 h-5 text-orange-500" />
                      <h2 className="text-2xl font-bold">Brand Style</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Tone</span>
                        <p className="text-lg font-medium capitalize">{contentPack.brandStyle.tone}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Voice Keywords</span>
                        <div className="flex flex-wrap gap-2">
                          {contentPack.brandStyle.keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-100">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Platform Content */}
                  {contentPack.platforms.instagram && (
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <h2 className="text-2xl font-bold">Instagram</h2>
                      </div>
                      <div className="space-y-8">
                        <div className="grid sm:grid-cols-3 gap-4">
                          {contentPack.platforms.instagram.reelIdeas.map((reel, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500 block mb-1">Reel Hook</span>
                              <p className="text-sm font-bold mb-2">"{reel.hook}"</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{reel.concept}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {contentPack.platforms.instagram.captions.map((caption, i) => (
                            <div key={i} className="group bg-white p-6 rounded-2xl border border-gray-200 relative">
                              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{caption}</p>
                              <button
                                onClick={() => copyToClipboard(caption, `ig-cap-${i}`)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                {copied === `ig-cap-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {contentPack.platforms.linkedin && (
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <Linkedin className="w-5 h-5 text-blue-700" />
                        <h2 className="text-2xl font-bold">LinkedIn</h2>
                      </div>
                      <div className="space-y-6">
                        {contentPack.platforms.linkedin.posts.map((post, i) => (
                          <div key={i} className="group bg-white p-8 rounded-2xl border border-gray-200 relative">
                            <h3 className="text-lg font-bold mb-4">{post.title}</h3>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">{post.body}</p>
                            <div className="flex flex-wrap gap-2">
                              {post.hashtags.map((tag, j) => (
                                <span key={j} className="text-blue-700 text-sm font-medium">{tag}</span>
                              ))}
                            </div>
                            <button
                              onClick={() => copyToClipboard(`${post.title}\n\n${post.body}\n\n${post.hashtags.join(' ')}`, `li-post-${i}`)}
                              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              {copied === `li-post-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {contentPack.platforms.twitter && (
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <Twitter className="w-5 h-5 text-black" />
                        <h2 className="text-2xl font-bold">Twitter (X)</h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Punchy Tweets</h3>
                          {contentPack.platforms.twitter.tweets.map((tweet, i) => (
                            <div key={i} className="group bg-white p-5 rounded-2xl border border-gray-200 relative">
                              <p className="text-gray-700">{tweet}</p>
                              <button
                                onClick={() => copyToClipboard(tweet, `tw-tweet-${i}`)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                {copied === `tw-tweet-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Thread Ideas</h3>
                          {contentPack.platforms.twitter.threads.map((thread, i) => (
                            <div key={i} className="bg-black text-white p-6 rounded-2xl">
                              <p className="font-bold mb-3 text-orange-400 italic">"{thread.hook}"</p>
                              <ul className="space-y-2 mb-4">
                                {thread.points.map((p, j) => (
                                  <li key={j} className="text-xs text-gray-400 flex gap-2">
                                    <span className="text-orange-500">•</span> {p}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs font-bold text-orange-500">{thread.cta}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Poster Section */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-orange-500" />
                        <h2 className="text-2xl font-bold">Poster Generator</h2>
                      </div>
                      <button
                        onClick={handleGeneratePoster}
                        disabled={posterLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                      >
                        {posterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        {posterUrl ? 'Regenerate Poster' : 'Generate Poster Image'}
                      </button>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Design Concept</span>
                          <p className="text-gray-700 leading-relaxed">{contentPack.posterIdea.description}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Text Overlay</span>
                          <p className="text-xl font-bold text-orange-600">{contentPack.posterIdea.textOverlay}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">AI Image Prompt</span>
                          <p className="text-xs text-gray-500 italic leading-relaxed">{contentPack.posterIdea.imagePrompt}</p>
                        </div>
                      </div>
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group">
                        {posterUrl ? (
                          <>
                            <img src={posterUrl} alt="Generated Poster" className="w-full h-full object-cover" />
                            <a 
                              href={posterUrl} 
                              download="poster.png"
                              className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur shadow-lg rounded-full text-black opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                              <Download className="w-5 h-5" />
                            </a>
                          </>
                        ) : (
                          <div className="text-center p-8">
                            {posterLoading ? (
                              <div className="space-y-4">
                                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
                                <p className="text-sm text-gray-500 font-medium">Creating your masterpiece...</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
                                <p className="text-sm text-gray-400">Click generate to see your poster come to life</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* 7-Day Plan */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <h2 className="text-2xl font-bold">7-Day Multi-Platform Plan</h2>
                    </div>
                    <div className="grid gap-4">
                      {contentPack.contentPlan.map((day, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-500/20">
                            {day.day}
                          </div>
                          <div className="grid md:grid-cols-3 gap-6 flex-grow">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Platform</span>
                              <p className="text-sm font-bold capitalize">{day.platform}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Post Idea</span>
                              <p className="text-sm font-medium">{day.postIdea}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Caption Hook</span>
                              <p className="text-sm text-gray-600">{day.captionIdea}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Sales Post */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <DollarSign className="w-5 h-5 text-orange-500" />
                      <h2 className="text-2xl font-bold">High-Urgency Sales Post</h2>
                    </div>
                    <div className="bg-orange-500 text-white p-8 rounded-3xl relative group shadow-xl shadow-orange-500/20">
                      <p className="text-xl font-bold leading-relaxed whitespace-pre-wrap">{contentPack.salesPost}</p>
                      <button
                        onClick={() => copyToClipboard(contentPack.salesPost, 'sales')}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copied === 'sales' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white/60" />}
                      </button>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Powered by Gemini AI • Built for Local Business Growth
          </p>
        </div>
      </footer>
    </div>
  );
}
