import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  Grid, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Edit3, 
  Lock, 
  Unlock, 
  Upload, 
  Check, 
  Sparkles, 
  Maximize2,
  Sliders,
  Mail,
  Instagram,
  ArrowRight,
  FolderPlus,
  Image as ImageIcon,
  ArrowLeft,
  Star,
  Layers
} from 'lucide-react';

// Default Multi-Photo Albums (Toto Villaruel inspired warm film aesthetic)
const DEFAULT_ALBUMS = [
  {
    id: 'album-1',
    title: 'Warmth of Tuscany',
    subtitle: 'Val d\'Orcia Wedding Story',
    category: 'Weddings',
    location: 'Tuscany, Italy',
    date: 'Autumn 2024',
    coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600',
    description: 'An intimate sunset celebration tucked away in the rolling golden hills of Val d\'Orcia. Ambient candle light, warm olive grove hues, and quiet laughter.',
    visible: true,
    featured: true,
    createdAt: Date.now() - 1000000,
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600', caption: 'The bride preparing at Villa Catenignano' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1600', caption: 'Exchange of vows under Tuscan cypress trees' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1600', caption: 'Golden hour portraits near the vineyard' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1600', caption: 'Intimate candlelight dinner setup' }
    ]
  },
  {
    id: 'album-2',
    title: 'Monochrome & Texture',
    subtitle: 'Bridal Fashion & Fine Art Portraiture',
    category: 'Editorial',
    location: 'Paris, France',
    date: 'Spring 2025',
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600',
    description: 'High fashion editorial capturing silk textures, vintage glass optics, and directional window light in a 19th-century Parisian studio.',
    visible: true,
    featured: true,
    createdAt: Date.now() - 800000,
    photos: [
      { id: 'p5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600', caption: 'Leica 50mm Summilux - Natural light portrait' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1600', caption: 'Shadow play & organic skin tones' },
      { id: 'p7', url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=1600', caption: 'Silk velvet silhouette' }
    ]
  },
  {
    id: 'album-3',
    title: 'Highland Elopement',
    subtitle: 'Misty Isle of Skye Vows',
    category: 'Elopements',
    location: 'Skye, Scotland',
    date: 'Summer 2024',
    coverUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1600',
    description: 'Surrounded by ocean winds and misty peaks, an adventurous couple exchanges vows in complete solitude.',
    visible: true,
    featured: false,
    createdAt: Date.now() - 500000,
    photos: [
      { id: 'p8', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1600', caption: 'Windswept cliff side view' },
      { id: 'p9', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600', caption: 'Walking towards the old lighthouse' }
    ]
  }
];

const CATEGORIES = ['All', 'Weddings', 'Elopements', 'Editorial', 'Portraits'];

export default function App() {
  // Persistence state for multi-photo albums
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem('toto_portfolio_albums');
      return saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
    } catch (e) {
      return DEFAULT_ALBUMS;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio', 'stories', 'about', 'contact', 'admin'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Active album viewed in viewer
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('toto_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Admin Album Form State (Multi-photo support)
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [albumForm, setAlbumForm] = useState({
    title: '',
    subtitle: '',
    category: 'Weddings',
    location: '',
    date: '',
    description: '',
    featured: false,
    photos: [] // Current photos list inside album being edited
  });
  const [isDragging, setIsDragging] = useState(false);

  // Save to local storage on albums change
  useEffect(() => {
    try {
      localStorage.setItem('toto_portfolio_albums', JSON.stringify(albums));
    } catch (e) {
      console.error('Failed to save albums to localStorage', e);
    }
  }, [albums]);

  // Handle Admin Pin Login
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.length >= 4) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('toto_admin_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('toto_admin_auth');
  };

  // Visible Albums Filtered
  const visibleAlbums = useMemo(() => {
    return albums.filter(a => a.visible && (selectedCategory === 'All' || a.category === selectedCategory));
  }, [albums, selectedCategory]);

  // Read local file(s) from user's hard drive using FileReader
  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setAlbumForm(prev => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              url: dataUrl,
              caption: file.name.replace(/\.[^/.]+$/, "") // default caption to file name
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Save Album (Create or Edit)
  const handleSaveAlbum = (e) => {
    e.preventDefault();
    if (!albumForm.title) return;

    // Default coverUrl if no photos present
    const cover = albumForm.photos.length > 0 ? albumForm.photos[0].url : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600';

    const albumObj = {
      id: editingAlbumId || `album-${Date.now()}`,
      title: albumForm.title,
      subtitle: albumForm.subtitle,
      category: albumForm.category,
      location: albumForm.location,
      date: albumForm.date,
      description: albumForm.description,
      coverUrl: cover,
      visible: true,
      featured: albumForm.featured,
      photos: albumForm.photos,
      createdAt: editingAlbumId ? (albums.find(a => a.id === editingAlbumId)?.createdAt || Date.now()) : Date.now()
    };

    if (editingAlbumId) {
      setAlbums(albums.map(a => a.id === editingAlbumId ? albumObj : a));
      setEditingAlbumId(null);
    } else {
      setAlbums([albumObj, ...albums]);
    }

    // Reset Form
    setAlbumForm({
      title: '',
      subtitle: '',
      category: 'Weddings',
      location: '',
      date: '',
      description: '',
      featured: false,
      photos: []
    });
  };

  // Edit Album trigger
  const handleEditAlbumClick = (album) => {
    setEditingAlbumId(album.id);
    setAlbumForm({
      title: album.title,
      subtitle: album.subtitle || '',
      category: album.category,
      location: album.location || '',
      date: album.date || '',
      description: album.description || '',
      featured: album.featured || false,
      photos: album.photos ? [...album.photos] : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Photo manipulations inside Album edit form
  const handleRemovePhotoFromForm = (photoId) => {
    setAlbumForm(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }));
  };

  const handleSetAsCover = (photoUrl) => {
    // Move selected photo to top of list so it becomes primary cover
    setAlbumForm(prev => {
      const idx = prev.photos.findIndex(p => p.url === photoUrl);
      if (idx <= 0) return prev;
      const updated = [...prev.photos];
      const [target] = updated.splice(idx, 1);
      updated.unshift(target);
      return { ...prev, photos: updated };
    });
  };

  const handleToggleAlbumVisibility = (id) => {
    setAlbums(albums.map(a => a.id === id ? { ...a, visible: !a.visible } : a));
  };

  const handleDeleteAlbum = (id) => {
    if (window.confirm && !confirm('Are you sure you want to delete this complete album?')) return;
    setAlbums(albums.filter(a => a.id !== id));
  };

  // Lightbox Navigation inside Active Album Detail
  const activeAlbumPhotos = selectedAlbum ? selectedAlbum.photos : [];
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => {
    if (lightboxIndex !== null && activeAlbumPhotos.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + activeAlbumPhotos.length) % activeAlbumPhotos.length);
    }
  };
  const nextLightbox = () => {
    if (lightboxIndex !== null && activeAlbumPhotos.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % activeAlbumPhotos.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-serif antialiased selection:bg-[#9E8873] selection:text-white">
      {/* Editorial Header Nav */}
      <header className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => { setSelectedAlbum(null); setActiveTab('portfolio'); }} 
            className="text-left group cursor-pointer"
          >
            <h1 className="text-2xl md:text-3xl tracking-widest font-light uppercase text-stone-900 group-hover:text-[#9E8873] transition-colors">
              TOTO VILLARUEL
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-sans mt-0.5">
              Fine Art & Editorial Photography
            </p>
          </button>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 md:gap-10 text-xs tracking-[0.2em] font-sans uppercase">
            <button
              onClick={() => { setSelectedAlbum(null); setActiveTab('portfolio'); }}
              className={`pb-1 transition-all ${activeTab === 'portfolio' && !selectedAlbum ? 'text-[#9E8873] border-b border-[#9E8873] font-medium' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Albums
            </button>
            <button
              onClick={() => { setSelectedAlbum(null); setActiveTab('stories'); }}
              className={`pb-1 transition-all ${activeTab === 'stories' ? 'text-[#9E8873] border-b border-[#9E8873] font-medium' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Featured Stories
            </button>
            <button
              onClick={() => { setSelectedAlbum(null); setActiveTab('about'); }}
              className={`pb-1 transition-all ${activeTab === 'about' ? 'text-[#9E8873] border-b border-[#9E8873] font-medium' : 'text-stone-500 hover:text-stone-900'}`}
            >
              About
            </button>
            <button
              onClick={() => { setSelectedAlbum(null); setActiveTab('contact'); }}
              className={`pb-1 transition-all ${activeTab === 'contact' ? 'text-[#9E8873] border-b border-[#9E8873] font-medium' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Contact
            </button>
            <button
              onClick={() => { setSelectedAlbum(null); setActiveTab('admin'); }}
              className={`px-3 py-1.5 rounded-full border border-stone-300 flex items-center gap-1.5 text-[10px] transition-all hover:border-[#9E8873] ${activeTab === 'admin' ? 'bg-[#9E8873] text-white font-semibold border-[#9E8873]' : 'text-stone-600 hover:text-stone-900'}`}
            >
              {isAdminAuthenticated ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>Admin Portal</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* VIEW DETAILED SINGLE ALBUM STORY */}
        {selectedAlbum ? (
          <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
            <button
              onClick={() => setSelectedAlbum(null)}
              className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-stone-500 hover:text-[#9E8873] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Albums</span>
            </button>

            {/* Album Header Narrative */}
            <div className="space-y-4 border-b border-stone-200 pb-10">
              <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#9E8873] font-medium">
                {selectedAlbum.category} {selectedAlbum.location && `— ${selectedAlbum.location}`}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-light">
                {selectedAlbum.title}
              </h1>
              {selectedAlbum.subtitle && (
                <p className="text-lg font-serif italic text-stone-500">
                  {selectedAlbum.subtitle}
                </p>
              )}
              {selectedAlbum.description && (
                <p className="text-stone-700 font-serif leading-relaxed text-base max-w-3xl pt-2">
                  {selectedAlbum.description}
                </p>
              )}
            </div>

            {/* Multi-Photo Editorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {selectedAlbum.photos && selectedAlbum.photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => openLightbox(idx)}
                  className="group relative cursor-pointer overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption || selectedAlbum.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <span className="text-xs font-sans text-stone-100">
                      {photo.caption || `Photo ${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-sans text-[#EBE3D9] uppercase tracking-wider mt-1 flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> View Fullscreen
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* VIEW 1: ALBUMS GALLERY OVERVIEW */}
            {activeTab === 'portfolio' && (
              <div className="space-y-12 animate-fadeIn">
                <div className="text-center max-w-2xl mx-auto space-y-4 py-4">
                  <p className="text-stone-600 italic font-serif text-lg md:text-xl leading-relaxed">
                    "Capturing quiet, honest stories bathed in warm natural light and timeless elegance."
                  </p>
                  <div className="w-12 h-[1px] bg-[#9E8873]/40 mx-auto" />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-6 text-xs font-sans tracking-[0.2em] uppercase py-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`transition-colors cursor-pointer pb-1 ${
                        selectedCategory === cat 
                          ? 'text-[#9E8873] font-semibold border-b border-[#9E8873]' 
                          : 'text-stone-400 hover:text-stone-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Album Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {visibleAlbums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => setSelectedAlbum(album)}
                      className="group relative cursor-pointer overflow-hidden bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-stone-100">
                        <img
                          src={album.coverUrl || (album.photos && album.photos[0]?.url)}
                          alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Album Details Overlay */}
                      <div className="p-6 bg-white border-t border-stone-100">
                        <div className="flex justify-between items-center text-[10px] tracking-[0.2em] font-sans uppercase text-[#9E8873] mb-1 font-medium">
                          <span>{album.category}</span>
                          <span className="flex items-center gap-1 text-stone-400">
                            <Layers className="w-3 h-3" /> {album.photos ? album.photos.length : 0} photos
                          </span>
                        </div>
                        <h3 className="text-xl font-serif text-stone-900 tracking-wide font-light group-hover:text-[#9E8873] transition-colors">
                          {album.title}
                        </h3>
                        {album.subtitle && (
                          <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                            {album.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: FEATURED STORIES */}
            {activeTab === 'stories' && (
              <div className="space-y-16 animate-fadeIn max-w-5xl mx-auto">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl md:text-4xl font-serif tracking-wide text-stone-900 font-light">
                    Featured Love Stories
                  </h2>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-stone-500">
                    Full photo essays and intimate celebrations
                  </p>
                </div>

                <div className="space-y-20">
                  {albums.filter(a => a.featured && a.visible).map((story, i) => (
                    <div 
                      key={story.id} 
                      onClick={() => setSelectedAlbum(story)}
                      className="cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-stone-200/80 p-6 md:p-8 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="aspect-[3/2] overflow-hidden bg-stone-100 border border-stone-200">
                          <img 
                            src={story.coverUrl} 
                            alt={story.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                          />
                        </div>
                      </div>
                      <div className={`lg:col-span-5 space-y-4 ${i % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <span className="text-xs font-sans tracking-[0.25em] text-[#9E8873] uppercase font-medium block">
                          {story.category} — Story {i + 1}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif text-stone-900 group-hover:text-[#9E8873] transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-stone-600 font-serif text-sm leading-relaxed">
                          {story.description}
                        </p>
                        <div className="pt-2 flex items-center text-xs font-sans text-[#9E8873] font-medium gap-2">
                          <span>Explore Story ({story.photos ? story.photos.length : 0} Photographs)</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: ABOUT */}
            {activeTab === 'about' && (
              <div className="max-w-4xl mx-auto space-y-16 animate-fadeIn py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  <div className="md:col-span-5">
                    <div className="aspect-[4/5] bg-stone-100 border border-stone-300 relative shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000"
                        alt="Toto Villaruel"
                        className="w-full h-full object-cover filter contrast-105"
                      />
                      <div className="absolute inset-0 border border-stone-300/80 -m-3 pointer-events-none" />
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-6">
                    <span className="text-xs font-sans tracking-[0.3em] text-[#9E8873] font-medium uppercase block">
                      The Artist
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light">
                      Toto Villaruel
                    </h2>
                    <div className="space-y-4 text-stone-600 font-serif leading-relaxed text-base">
                      <p>
                        I am a wedding and portrait photographer devoted to capturing quiet beauty, genuine emotion, and warm, cinematic tones.
                      </p>
                      <p>
                        With an aesthetic rooted in editorial storytelling and classic film warmth, my goal is to create imagery that feels timeless, atmospheric, and profoundly human.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: CONTACT */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn py-6">
                <div className="text-center space-y-3">
                  <span className="text-xs font-sans tracking-[0.3em] text-[#9E8873] font-medium uppercase block">
                    Inquiries & Booking
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light">
                    Let's Create Together
                  </h2>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you for reaching out! We will get back to you within 24 hours.');
                  }}
                  className="space-y-6 bg-white p-8 border border-stone-200/80 shadow-sm font-sans"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] tracking-widest text-stone-500 uppercase">First Name</label>
                      <input required type="text" className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] tracking-widest text-stone-500 uppercase">Last Name</label>
                      <input required type="text" className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] tracking-widest text-stone-500 uppercase">Email Address</label>
                    <input required type="email" className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] tracking-widest text-stone-500 uppercase">Message & Vision</label>
                    <textarea rows={4} required className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]" />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#9E8873] text-white py-4 font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#887360] transition-colors shadow-sm"
                  >
                    Send Inquiry
                  </button>
                </form>
              </div>
            )}

            {/* VIEW 5: ADMIN PORTAL WITH MULTI-PHOTO ALBUM MANAGEMENT */}
            {activeTab === 'admin' && (
              <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
                {!isAdminAuthenticated ? (
                  /* PIN LOGIN */
                  <div className="max-w-md mx-auto py-16 text-center space-y-6 bg-white border border-stone-200/80 p-8 shadow-sm">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-[#9E8873]">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-serif text-stone-900">Admin Dashboard</h2>
                      <p className="text-xs font-sans text-stone-500">
                        Enter passcode to access album & photo management
                      </p>
                    </div>
                    <form onSubmit={handlePinSubmit} className="space-y-4">
                      <input
                        type="password"
                        placeholder="Enter PIN (Default: 1234)"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 p-3 text-center text-lg text-stone-900 font-mono tracking-widest focus:outline-none focus:border-[#9E8873]"
                      />
                      {pinError && (
                        <p className="text-xs text-rose-500 font-sans">Invalid PIN code. Try "1234"</p>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-[#9E8873] text-white py-3 font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#887360] transition-colors"
                      >
                        Unlock Admin Access
                      </button>
                    </form>
                  </div>
                ) : (
                  /* AUTHENTICATED ADMIN DASHBOARD */
                  <div className="space-y-12">
                    {/* Admin Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6 gap-4">
                      <div>
                        <h2 className="text-2xl font-serif text-stone-900">Multi-Photo Album Manager</h2>
                        <p className="text-xs font-sans text-stone-500 mt-1">
                          Create stories, perform multi-photo batch uploads, and assign main covers.
                        </p>
                      </div>
                      <button
                        onClick={handleLogoutAdmin}
                        className="px-4 py-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:border-stone-400 text-xs font-sans uppercase tracking-wider transition-colors"
                      >
                        Lock Portal
                      </button>
                    </div>

                    {/* Multi-Photo Album Creator Form */}
                    <div className="bg-white border border-stone-200/80 p-6 md:p-8 space-y-6 shadow-sm">
                      <div className="flex items-center gap-2 text-[#9E8873] font-sans text-xs uppercase tracking-widest font-semibold">
                        <FolderPlus className="w-4 h-4" />
                        <span>{editingAlbumId ? 'Edit Album Details & Photos' : 'Create New Multi-Photo Album'}</span>
                      </div>

                      <form onSubmit={handleSaveAlbum} className="space-y-6 font-sans">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Album Title *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Tuscany Sunset Elopement"
                              value={albumForm.title}
                              onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Subtitle / Tagline</label>
                            <input
                              type="text"
                              placeholder="e.g. Intimate Vows at Villa Catenignano"
                              value={albumForm.subtitle}
                              onChange={(e) => setAlbumForm({ ...albumForm, subtitle: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Category *</label>
                            <select
                              value={albumForm.category}
                              onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]"
                            >
                              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Location</label>
                            <input
                              type="text"
                              placeholder="e.g. Florence, Italy"
                              value={albumForm.location}
                              onChange={(e) => setAlbumForm({ ...albumForm, location: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Date</label>
                            <input
                              type="text"
                              placeholder="e.g. Autumn 2024"
                              value={albumForm.date}
                              onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })}
                              className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Story Narrative / Description</label>
                          <textarea
                            rows={3}
                            placeholder="Write about the mood, styling, optics used, or the couple's narrative..."
                            value={albumForm.description}
                            onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                            className="w-full bg-stone-50 border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-[#9E8873]"
                          />
                        </div>

                        {/* Local Hard Drive File Upload Dropzone */}
                        <div className="space-y-3">
                          <label className="text-[11px] uppercase tracking-wider text-[#9E8873] flex items-center gap-1.5 font-semibold">
                            <Upload className="w-3.5 h-3.5" /> Upload Photos from Hard Drive
                          </label>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                              isDragging 
                                ? 'border-[#9E8873] bg-[#9E8873]/5' 
                                : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-[#9E8873]">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-stone-700 font-sans font-medium">
                                Drag & drop image files here, or <span className="text-[#9E8873] underline">browse your computer</span>
                              </p>
                              <p className="text-[10px] text-stone-400 font-sans">
                                Select multiple JPG, PNG, WEBP files from your hard drive
                              </p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileInputChange}
                              className="hidden"
                              id="hardDriveFileInput"
                            />
                            <label
                              htmlFor="hardDriveFileInput"
                              className="bg-stone-800 hover:bg-stone-900 text-white text-xs uppercase px-4 py-2 tracking-wider transition-colors cursor-pointer shadow-sm"
                            >
                              Select Files From Hard Drive
                            </label>
                          </div>
                        </div>

                        {/* List of photos currently inside this album */}
                        {albumForm.photos.length > 0 && (
                          <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">
                              Photos in this Album ({albumForm.photos.length}) — First photo acts as Cover:
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {albumForm.photos.map((photo, i) => (
                                <div key={photo.id || i} className="relative group bg-white border border-stone-200 p-2 space-y-2 shadow-sm">
                                  <div className="aspect-square overflow-hidden bg-stone-100 relative">
                                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                    {i === 0 && (
                                      <span className="absolute top-1 left-1 bg-[#9E8873] text-white text-[9px] uppercase px-1.5 py-0.5 font-semibold">
                                        Cover
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    {i !== 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetAsCover(photo.url)}
                                        className="text-[10px] text-stone-500 hover:text-[#9E8873] uppercase"
                                      >
                                        Set Cover
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePhotoFromForm(photo.id)}
                                      className="text-rose-500 hover:text-rose-700 ml-auto p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <input
                            type="checkbox"
                            id="featuredAlbumToggle"
                            checked={albumForm.featured}
                            onChange={(e) => setAlbumForm({ ...albumForm, featured: e.target.checked })}
                            className="w-4 h-4 accent-[#9E8873]"
                          />
                          <label htmlFor="featuredAlbumToggle" className="text-xs uppercase tracking-wider text-stone-700 cursor-pointer">
                            Feature this Album in Love Stories Section
                          </label>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-stone-200">
                          <button
                            type="submit"
                            className="bg-[#9E8873] text-white px-6 py-3 font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#887360] transition-colors shadow-sm"
                          >
                            {editingAlbumId ? 'Save Album Changes' : 'Create Album'}
                          </button>
                          {editingAlbumId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAlbumId(null);
                                setAlbumForm({ title: '', subtitle: '', category: 'Weddings', location: '', date: '', description: '', featured: false, photos: [] });
                              }}
                              className="border border-stone-300 text-stone-600 px-6 py-3 text-xs tracking-[0.2em] uppercase hover:text-stone-900 hover:border-stone-400"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Existing Albums List */}
                    <div className="space-y-4 font-sans">
                      <h3 className="text-lg font-serif text-stone-900">
                        All Published Albums ({albums.length})
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        {albums.map((album) => (
                          <div
                            key={album.id}
                            className="bg-white border border-stone-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={album.coverUrl || (album.photos && album.photos[0]?.url)}
                                alt={album.title}
                                className="w-16 h-16 object-cover border border-stone-200 bg-stone-100"
                              />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-serif text-stone-900 text-base">{album.title}</h4>
                                  <span className="text-[9px] uppercase px-2 py-0.5 bg-stone-100 text-stone-600 rounded-sm font-medium">
                                    {album.category}
                                  </span>
                                  <span className="text-[9px] uppercase px-2 py-0.5 bg-stone-100 text-[#9E8873] rounded-sm flex items-center gap-1 font-medium">
                                    <ImageIcon className="w-2.5 h-2.5" /> {album.photos ? album.photos.length : 0} photos
                                  </span>
                                </div>
                                <p className="text-xs text-stone-500 line-clamp-1">
                                  {album.subtitle || album.location || 'No subtitle'}
                                </p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3 self-end md:self-auto">
                              <button
                                onClick={() => handleToggleAlbumVisibility(album.id)}
                                title={album.visible ? "Hide Album" : "Show Album"}
                                className={`p-2 border rounded-sm transition-colors ${album.visible ? 'border-stone-300 text-stone-700 hover:bg-stone-100' : 'border-rose-200 text-rose-600 bg-rose-50'}`}
                              >
                                {album.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleEditAlbumClick(album)}
                                title="Edit Album & Photos"
                                className="p-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-sm transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAlbum(album.id)}
                                title="Delete Album"
                                className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-sm transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activeAlbumPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          <div className="flex justify-between items-center text-stone-400 text-xs font-sans tracking-widest uppercase">
            <span>
              {lightboxIndex + 1} / {activeAlbumPhotos.length}
            </span>
            <button onClick={closeLightbox} className="p-2 text-stone-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button onClick={prevLightbox} className="absolute left-2 md:left-6 z-10 p-3 text-stone-400 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={activeAlbumPhotos[lightboxIndex].url}
              alt={activeAlbumPhotos[lightboxIndex].caption || 'Full resolution'}
              className="max-h-[80vh] max-w-[90vw] object-contain shadow-2xl transition-all duration-300"
            />
            <button onClick={nextLightbox} className="absolute right-2 md:left-auto md:right-6 z-10 p-3 text-stone-400 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-1">
            <p className="text-xs font-sans text-stone-400">
              {activeAlbumPhotos[lightboxIndex].caption || selectedAlbum?.title}
            </p>
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200/80 mt-20 py-12 px-6 md:px-12 text-center text-stone-500 font-sans text-xs space-y-4 bg-white">
        <div className="flex justify-center items-center gap-6 text-stone-600">
          <a href="#" className="hover:text-[#9E8873] transition-colors"><Instagram className="w-4 h-4" /></a>
          <a href="#" className="hover:text-[#9E8873] transition-colors"><Mail className="w-4 h-4" /></a>
        </div>
        <p className="tracking-widest uppercase text-[10px] text-stone-400">
          © {new Date().getFullYear()} TOTO VILLARUEL. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}