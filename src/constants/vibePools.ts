export const backgrounds = [
  'bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500',
  'bg-gradient-to-tl from-yellow-200 via-red-300 to-pink-500',
  'bg-[#0f0f1f]',
  'bg-gradient-radial from-gray-800 via-indigo-900 to-black',
  'bg-gradient-to-b from-orange-200 via-pink-300 to-purple-500',
  'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700',
  // New aesthetic backgrounds
  'bg-gradient-to-br from-pink-200 via-purple-300 to-blue-200',
  'bg-gradient-to-r from-rose-400 to-orange-300',
  'bg-gradient-to-tr from-violet-500 to-fuchsia-300',
  // New minimal backgrounds
  'bg-[#121212]',
  'bg-gradient-to-b from-gray-900 to-black',
  'bg-[#1a1a2e]',
  // New vibrant backgrounds
  'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
  'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-600',
  'bg-gradient-to-tr from-blue-500 via-teal-400 to-green-500',
  // New nostalgic backgrounds
  'bg-gradient-to-r from-amber-500 to-pink-500',
  'bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500',
  'bg-[#2d3436]',
  // New dreamy backgrounds
  'bg-gradient-radial from-indigo-400 via-purple-500 to-indigo-800',
  'bg-gradient-to-br from-blue-900 via-purple-900 to-black',
  'bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900',
]

export const pets = [
  '🦊', '🐸', '👾', '🐱', '🌸', '🧸', '🪐', '🐢',
  // Aesthetic pets
  '🦢', '🕊️', '🌷', '🦋', '🦩',
  // Minimal pets
  '◻️', '◼️', '⚪', '⚫', '🔲', '🔳',
  // Vibrant pets
  '🌈', '✨', '💫', '⭐', '🔆', '🎨',
  // Nostalgic pets
  '📻', '📺', '🎮', '💾', '📼', '🕹️',
  // Dreamy pets
  '🌙', '☁️', '🌌', '🔮', '🌠', '✨',
  // Glitch pets
  '🤖', '💻', '🖥️', '📱', '🎛️', '🔌',
  // Cozy pets
  '🧶', '🧣', '🍵', '🕯️', '🧦',
]

export const fonts = [
  'font-sans', 'font-mono', 'font-serif', 'font-light',
  'font-medium', 'font-semibold', 'font-bold', 'italic'
]

export const captions = [
  'Float in the glitch.',
  'You are a loop in the system.',
  'Tonight feels like a synthwave dream.',
  'The void is calm. You are too.',
  'Pause. Breathe. Drift.',
  'This vibe never existed until now.',
  'Let the pixels carry you home.',
  'You are seen by the neon.',
  // Aesthetic captions
  'Soft whispers in pastel skies.',
  'Delicate moments, captured forever.',
  'Bloom where you are planted.',
  // Minimal captions
  'Less is more.',
  'Simplicity is the ultimate sophistication.',
  'In the silence, find peace.',
  // Vibrant captions
  'Colors speak louder than words.',
  'Live vibrantly, love fiercely.',
  'Paint your world with joy.',
  // Nostalgic captions
  'Remember when we were young?',
  'Some memories never fade.',
  'Rewind to the good old days.',
  // Dreamy captions
  'Lost in the cosmos of your mind.',
  'Starlight guides dreamers home.',
  'Between reality and dreams, we float.',
  // Glitch captions
  'System error: beauty overload.',
  'Caught in the digital undertow.',
  'Pixels rearrange to form new realities.',
  // Cozy captions
  'Wrapped in comfort, surrounded by peace.',
  'Home is where the heart feels warm.',
  'The simple joys are the most precious.',
]

export const audios = [
  '/assets/rain.mp3',
  '/assets/synth.mp3',
  '/assets/stargarden.mp3',
  '/assets/digital.mp3',
  '/assets/dreamcore.mp3',
  '/assets/voidwave.mp3',
  '/assets/pixel.mp3',
]

// Theme-specific pools for remix options
export const themeOptions = {
  aesthetic: {
    backgrounds: [
      'bg-gradient-to-br from-pink-200 via-purple-300 to-blue-200',
      'bg-gradient-to-r from-rose-400 to-orange-300',
      'bg-gradient-to-tr from-violet-500 to-fuchsia-300',
    ],
    pets: ['🌸', '🦢', '🕊️', '🌷', '🦋', '🦩'],
    fonts: ['font-serif', 'font-light'],
    captions: [
      'Soft whispers in pastel skies.',
      'Delicate moments, captured forever.',
      'Bloom where you are planted.',
      'Beauty in simplicity, joy in details.',
      'Every petal tells a story.',
    ],
  },
  minimal: {
    backgrounds: [
      'bg-[#121212]',
      'bg-[#0f0f1f]',
      'bg-gradient-to-b from-gray-900 to-black',
      'bg-[#1a1a2e]',
    ],
    pets: ['◻️', '◼️', '⚪', '⚫', '🔲', '🔳'],
    fonts: ['font-mono', 'font-sans'],
    captions: [
      'Less is more.',
      'Simplicity is the ultimate sophistication.',
      'In the silence, find peace.',
      'Clarity comes from simplicity.',
      'Minimalism: room to breathe.',
    ],
  },
  vibrant: {
    backgrounds: [
      'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
      'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-600',
      'bg-gradient-to-tr from-blue-500 via-teal-400 to-green-500',
    ],
    pets: ['🌈', '✨', '💫', '⭐', '🔆', '🎨'],
    fonts: ['font-sans', 'font-bold'],
    captions: [
      'Colors speak louder than words.',
      'Live vibrantly, love fiercely.',
      'Paint your world with joy.',
      'Vibrance is a state of mind.',
      'Let your true colors shine.',
    ],
  },
  nostalgic: {
    backgrounds: [
      'bg-gradient-to-r from-amber-500 to-pink-500',
      'bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500',
      'bg-[#2d3436]',
    ],
    pets: ['📻', '📺', '🎮', '💾', '📼', '🕹️'],
    fonts: ['font-serif', 'font-medium'],
    captions: [
      'Remember when we were young?',
      'Some memories never fade.',
      'Rewind to the good old days.',
      'Nostalgia is a time machine.',
      'Old souls never die.',
    ],
  },
  dreamy: {
    backgrounds: [
      'bg-gradient-radial from-indigo-400 via-purple-500 to-indigo-800',
      'bg-gradient-to-br from-blue-900 via-purple-900 to-black',
      'bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900',
    ],
    pets: ['🌙', '☁️', '🌌', '🔮', '🌠', '✨'],
    fonts: ['font-light', 'font-serif'],
    captions: [
      'Lost in the cosmos of your mind.',
      'Starlight guides dreamers home.',
      'Between reality and dreams, we float.',
      'Dreams are the universe whispering.',
      'Celestial wanderings of the soul.',
    ],
  },
  glitch: {
    backgrounds: [
      'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700',
      'bg-gradient-radial from-gray-800 via-indigo-900 to-black',
      'bg-[#0f0f1f]',
    ],
    pets: ['👾', '🤖', '💻', '🖥️', '📱', '🎛️', '🔌'],
    fonts: ['font-mono', 'font-medium'],
    captions: [
      'System error: beauty overload.',
      'Caught in the digital undertow.',
      'Pixels rearrange to form new realities.',
      'Glitch in the matrix, beauty in the chaos.',
      'Digital dreams in analog reality.',
    ],
  },
  cozy: {
    backgrounds: [
      'bg-gradient-to-b from-orange-200 via-pink-300 to-purple-500',
      'bg-gradient-to-tl from-yellow-200 via-red-300 to-pink-500',
      'bg-gradient-to-r from-amber-500 to-pink-500',
    ],
    pets: ['🧸', '🧶', '🧣', '🍵', '🕯️', '🧦'],
    fonts: ['font-serif', 'font-medium'],
    captions: [
      'Wrapped in comfort, surrounded by peace.',
      'Home is where the heart feels warm.',
      'The simple joys are the most precious.',
      'Cozy corners and gentle moments.',
      'Warmth in a world of chaos.',
    ],
  },
}