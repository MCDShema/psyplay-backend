# Psychology News Website

A modern, AI-powered psychology news website with bilingual support (English/Ukrainian) and Directus CMS integration.

## Features

- **Bilingual Support**: Automatic AI translation between English and Ukrainian
- **Directus CMS Integration**: Content management with admin panel
- **Category-based Organization**: Politics, Technology, Sports, Business, Health, Lessons
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Clean design with brown/mocha color scheme
- **Search Functionality**: Global search across all content
- **Social Sharing**: Share articles on social media platforms
- **RSS Integration**: Automatic news fetching from external sources

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **CMS**: Directus
- **AI Translation**: OpenAI GPT or Google Translate API
- **Build Tool**: Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your Directus instance and API keys in `.env`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Directus Setup

### Content Type Structure

Create a `news` collection in Directus with the following fields:

- `id` (UUID, Primary Key)
- `title` (Text, Required)
- `content` (Rich Text, Required)
- `excerpt` (Text)
- `category` (Dropdown: politics, technology, sports, business, health, lessons)
- `tags` (JSON)
- `author` (Text)
- `slug` (Text, Unique)
- `featured` (Boolean)
- `language` (Dropdown: en, uk)
- `image` (File)
- `status` (Dropdown: draft, published)
- `date_created` (Timestamp)
- `date_updated` (Timestamp)

### API Permissions

Ensure the public role has read access to the `news` collection.

## AI Translation

The website supports automatic translation using either:

1. **OpenAI GPT API** (Recommended)
2. **Google Translate API** (Alternative)

Configure your preferred translation service in the environment variables.

## RSS Integration

The application can automatically fetch news from RSS feeds for different categories. Configure RSS feed URLs in `src/services/rss.ts`.

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.