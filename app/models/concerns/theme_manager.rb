module ThemeManager
  THEMES = ["light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",].freeze

  def self.next_theme(current_theme)
    current_index = THEMES.index(current_theme) || 0
    THEMES[(current_index + 1) % THEMES.length]
  end

  def self.all_themes
    THEMES
  end
end
