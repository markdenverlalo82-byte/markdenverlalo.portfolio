const DEFAULT_ALBUMS = [
    {
        id: 'album-1',
        title: 'Warmth of Tuscany',
        subtitle: 'Val d\'Orcia Wedding Story',
        category: 'Weddings',
        location: 'Tuscany, Italy',
        date: 'Autumn 2024',
        coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600',
        description: 'An intimate sunset celebration tucked away in the rolling golden hills of Val d\'Orcia.',
        visible: true,
        featured: true,
        photos: [
            { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600', caption: 'The bride preparing at Villa Catenignano' },
            { id: 'p2', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1600', caption: 'Exchange of vows under Tuscan cypress trees' }
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
        description: 'High fashion editorial capturing silk textures and natural window light.',
        visible: true,
        featured: true,
        photos: [
            { id: 'p5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600', caption: 'Natural light portrait' }
        ]
    }
];

function photographyApp() {
    return {
        albums: [],
        activeTab: 'portfolio',
        selectedCategory: 'All',
        categories: ['All', 'Weddings', 'Elopements', 'Editorial', 'Portraits'],
        selectedAlbum: null,
        lightboxIndex: null,
        isAdminAuthenticated: false,
        pinInput: '',
        pinError: false,
        editingAlbumId: null,
        albumForm: {
            title: '',
            subtitle: '',
            category: 'Weddings',
            location: '',
            date: '',
            description: '',
            featured: false,
            photos: []
        },

        init() {
            const saved = localStorage.getItem('toto_portfolio_albums');
            this.albums = saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
            this.isAdminAuthenticated = localStorage.getItem('toto_admin_auth') === 'true';
            
            this.$watch('albums', val => {
                localStorage.setItem('toto_portfolio_albums', JSON.stringify(val));
            });

            // Initialize Lucide icons after DOM renders
            setTimeout(() => lucide.createIcons(), 50);
            this.$watch('activeTab', () => setTimeout(() => lucide.createIcons(), 50));
            this.$watch('selectedAlbum', () => setTimeout(() => lucide.createIcons(), 50));
            this.$watch('isAdminAuthenticated', () => setTimeout(() => lucide.createIcons(), 50));
            this.$watch('albumForm.photos', () => setTimeout(() => lucide.createIcons(), 50));
        },

        get visibleAlbums() {
            return this.albums.filter(a => a.visible && (this.selectedCategory === 'All' || a.category === this.selectedCategory));
        },

        handlePinSubmit() {
            if (this.pinInput === '1234' || this.pinInput.length >= 4) {
                this.isAdminAuthenticated = true;
                localStorage.setItem('toto_admin_auth', 'true');
                this.pinError = false;
                this.pinInput = '';
            } else {
                this.pinError = true;
            }
        },

        handleLogoutAdmin() {
            this.isAdminAuthenticated = false;
            localStorage.removeItem('toto_admin_auth');
        },

        handleFilesSelected(e) {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.albumForm.photos.push({
                        id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                        url: e.target.result,
                        caption: file.name.replace(/\.[^/.]+$/, "")
                    });
                };
                reader.readAsDataURL(file);
            });
        },

        handleDrop(e) {
            const files = e.dataTransfer.files;
            if (!files || files.length === 0) return;
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.albumForm.photos.push({
                        id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                        url: e.target.result,
                        caption: file.name.replace(/\.[^/.]+$/, "")
                    });
                };
                reader.readAsDataURL(file);
            });
        },

        removePhoto(id) {
            this.albumForm.photos = this.albumForm.photos.filter(p => p.id !== id);
        },

        movePhoto(index, direction) {
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= this.albumForm.photos.length) return;
            const item = this.albumForm.photos.splice(index, 1)[0];
            this.albumForm.photos.splice(newIndex, 0, item);
        },

        setAsCover(url) {
            const idx = this.albumForm.photos.findIndex(p => p.url === url);
            if (idx > 0) {
                const target = this.albumForm.photos.splice(idx, 1)[0];
                this.albumForm.photos.unshift(target);
            }
        },

        handleSaveAlbum() {
            if (!this.albumForm.title) return;
            const cover = this.albumForm.photos.length > 0 ? this.albumForm.photos[0].url : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600';

            const albumObj = {
                id: this.editingAlbumId
