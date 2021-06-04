source "https://rubygems.org"

gem "minimal-mistakes-jekyll"
# gem "jackal" # TODO: Look in to using jackal theme, which is not a gem

gem "jekyll", "~> 4.0"

# If you have any plugins, put them here!
group :jekyll_plugins do
   # gem "github-pages", '>=104'
   # github-pages doesn't support Jekyll 4.0 yet, so include the needed packages manually
   gem "jemoji"
   # end implicit github-pages plugins

   gem "jekyll-feed"
   gem "jekyll-paginate"
   gem "jekyll-compose"
   # Needs git because support for Jekyll 4.0 hasn't seen a release yet.
   gem "jekyll-remote-theme", git: 'https://github.com/benbalter/jekyll-remote-theme'
   gem "jekyll-redirect-from"
   gem "jekyll-include-cache"
   gem "jekyll-archives"
end

# See https://github.com/jekyll/jekyll/issues/8523
gem "webrick", "~> 1.7"
