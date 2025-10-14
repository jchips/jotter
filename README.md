# Jotter

<center><img src='./public/jotter-circle.png' alt='Jotter logo' height='50px' width='50px'/></center>

Tired of searching for the perfect tool to easily organize your thoughts and ideas? Say hello to **Jotter**, the intuitive note-taking web app that combines the simplicity of Markdown with the power of organization.

**Why Choose Jotter?**

- **Stay Organized Your Way**: Create folders to neatly categorize your notes. Move notes and folders effortlessly to stay on top of your workflow.
- **Markdown Made Easy**: Use Markdown to format your notes quickly and beautifully, whether it’s for lists, headings, code snippets, and more.
- **Personalized Accounts**: Sign up and securely log in on browser or mobile device to access your notes anywhere, anytime.
- **Seamless Note Management**: Create, save, edit, and delete notes and folders with ease.
- **Adaptive Themes**: Whether your device is set to light or dark mode, **Jotter** adapts to your preferences, keeping your note-taking experience easy on the eyes.
- **A Minimalist Design**: No clutter, no distractions—just you and your thoughts, perfectly synced.

Whether you're a student, professional, or creative thinker, **Jotter** empowers you to take control of your notes and ideas with precision and style.

Try **Jotter** today and elevate your note-taking game!

TLDR: Jotter is a web app designed for note-taking with Markdown.

[View the Android version here!](https://github.com/jchips/jotter-rn)

[View the Jotter backend code here!](https://github.com/jchips/jotter-api)

## Creator & developer: Jelani R

## Version: 1.3.0

## Architecture

- Built with React + Vite, Redux, Chakra UI.
- Languages used: JavaScript, SASS.
- Backend uses MySQL, Sequelize, Nodejs, Express, Bcrypt, Base-64, Jsonwebtoken.

## Included Markdown features

- Headers
- Paragraphs
- Bold, Italics, Strikethrough
- Ordered and unordered lists
- Checkboxes
- Links
- Dividers
- Blockquotes
- Inline code
- Code blocks
- Tables
- Images
- HTML tags (not supported on mobile)

Note: Importing notes is limited to certain browsers. Works on Google Chrome.

## Keypress options

### Dashboard / Home page

- **ctrl/cmd-h** or **alt-h:** navigate to root folder

### View Note

- **ctrl/cmd-x** or **ctrl/cmd-e or alt-q:** exit note
- **ctrl/cmd-o** or **alt-o:** edit note

### Note Editor

- **ctrl/cmd-s:** save new changes
- **ctrl/cmd-e:** save and exit note
- **alt-q:** exit editor without saving
- All common text editing commands suchs as ctrl/cmd-c for copy, ctrl/cmd-v for paste, and so on.

## Screenshots

### Light theme

![Jotter note light](https://iili.io/3waJBJn.jpg)
![Jotter basic markdown light](https://iili.io/3waJ9Dv.jpg)
![Jotter editor light](https://iili.io/3waJFfI.jpg)
![Jotter dashboard light](https://iili.io/3waHyOJ.jpg)
![Jotter folder light](https://iili.io/3e1A5Ou.jpg)
![Jotter login light](https://iili.io/3e1A7Db.jpg)
![Jotter settings light](https://iili.io/3e1AcWx.jpg)

### Dark theme

![Jotter note dark](https://iili.io/3waJfUX.jpg)
![Jotter editor dark](https://iili.io/3waJ2iN.jpg)
![Jotter dashboard dark](https://iili.io/3e1ATU7.jpg)
![Jotter folder dark](https://iili.io/3e1AAJ9.jpg)
![Jotter login dark](https://iili.io/3e1ARRe.jpg)
![Jotter settings dark](https://iili.io/3e1Aaxj.jpg)

## Changelog

- **1.3.0** (2025-10-13, 8:40pm) - Users can import zip files that contain folders and markdown (.md) notes.
- **1.2.5** (2025-05-07, 9:30pm) - Two users can be logged in concurrently, in two seperate tabs.
- **1.2.4** (2025-04-28, 8:00pm) - Improved colors in dark mode.
- **1.2.3** (2025-04-27, 8:50pm) - Users can change their account email and/or password.
- **1.2.2** (2025-04-16, 4:50pm) - Switched up key press options so none conflicts with editing commands, users can permanently delete their accounts in settings, improved ui, bug fix.
- **1.2.1** (2025-04-12, 4:05pm) - Improved mobile web viewing.
- **1.2.0** (2025-04-04, 9:05pm) - Added settings page, added more key press controls.
- **1.1.4** (2025-02-02, 5:30pm) - Improved error handling.
- **1.1.3** (2025-01-21, 3:47am) - Sort is no longer temporary.
- **1.1.2** (2025-01-20, 6:25pm) - Fixed alphabetical sort bug, added support for blockquotes.
- **1.1.1** (2025-01-10, 2:02am) - Fixed folder breadcrumb bug when renaming folder.
- **1.1.0** (2025-01-09, 10:06pm) - Added import file button, fixed some bugs.
- **1.0.3** (2024-12-27, 5:07pm) - Minor editor improvements, added logo.
- **1.0.2** (2024-12-25, 6:12pm) - Fixed bug where cursor jumps to top of editor when typing quickly, minor editor improvements.
- **1.0.1** (2024-12-23, 8:22pm) - Export notes, fixed a bug when moving notes. Minor improvements.
- **1.0.0** (2024-12-23, 2:52am) - Users can edit folder titles, move folders/notes, and delete folders.
- **0.2.3** (2024-12-22, 1:23am) - Added temporary sort for notes and folders.
- **0.2.2** (2024-12-21, 9:31pm) - Added word count, improved editor, added support for HTML code rendering.
- **0.2.1** (2024-12-21, 4:33am) - Folder breadcrumbs.
- **0.2.0** (2024-12-20, 8:56pm) - Folder support, ctrl/cmd-s support in editor.
- **0.1.1** (2024-12-20, 2:04am) - Users can delete notes, improved design, editor/preview scrolling sync.
- **0.1.0** (2024-12-18, 3:11pm) - Users can create notes that support markdown, edit, and save them.
- **0.0.2** (2024-12-18, 11:32am) - Users can create notes.
- **0.0.1** (2024-12-15, 6:43pm) - Initial commit with functional login/signup.

## Resources

- [React-markdown](https://www.npmjs.com/package/react-markdown)
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [React-codemirror](https://uiwjs.github.io/react-codemirror/)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [rehype-raw](https://www.npmjs.com/package/rehype-raw)
- [React Hook Form](https://react-hook-form.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Chakra UI](https://www.chakra-ui.com/docs/get-started/installation)
- [Chakra templates](https://chakra-templates.vercel.app/navigation/navbar)
- [Table styling](https://dev.to/letsbsocial1/how-to-add-tables-to-react-markdown-21lc)
- [Lodash](https://lodash.com/)
